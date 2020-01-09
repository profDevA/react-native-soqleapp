import React, { Component } from 'react';
import * as axios from 'axios';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform, ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    View, TextInput,
    ActivityIndicator,
    Alert
    //f<Modal
} from 'react-native';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import _ from 'lodash';
import moment from "moment";
import SocketIOClient from 'socket.io-client';
import { MAIN_COLOR, QUESTION_IMAGE_BASE_URL, PLACEHOLDER_COLOR,  } from '../constants';
import { API_BASE_URL } from '../config';
import {
    SAVE_ANSWERS_PATH_API,
    USER_SPARK_LIST_PATH_API,
    CHAT_SOCKET_URL,
    TASK_GROUP_SEQUENCE_API_PATH,
    TASK_GROUP_SET_TASK_COUNTER_API_PATH,
    TASK_GROUP_SET_SEQUENCE_API_PATH
} from '../endpoints';
import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';
import styles from '../stylesheets/taskViewStyles';
import MixPanel from "react-native-mixpanel";
import Modal from "react-native-modal";
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
import {getGroupUserDetails} from "../utils/common";
import {checkUnlockAllParties,checkUnlockNextSequence} from "../utils/grouputil";
const bugsnag = new Client(BUGSNAG_KEY);


const { width } = Dimensions.get('window'); //full width

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: { 'Content-type': 'application/json' }
});

// TODO: Update this class to new Lifecycle methods
export default class TaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareObject:{comment:''},
            questions: [],
            currentSlideIndex: 0,
            modalVisible: false,
            helps: [],
            heightInput: 65,
            resultModalVisible: false,
            forwardQuestionModalVisible:false,
            processing: false,
            achievementCompletionDetail: {},
        };
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
    }

    static flashMessage = message => {
        showMessage({ message, type: MAIN_COLOR });
    };

    componentDidMount() {
        let user = this.props.user;
        let query = `userID=${user._id}&username=${user._id}&firstName=${user.profile.firstName ? user.profile.firstName : ''}&lastName=${user.profile.lastName ? user.profile.lastName : ''}&userType=test`;
        this.socket = SocketIOClient(CHAT_SOCKET_URL, { query: query, transports: ['websocket'] });
        this.socket.on('server:message', this.onReceivedMessage);

        const skill = this.props.navigation.getParam('skill', null);
        const objectiveValue = this.props.navigation.getParam('objectiveValue', 0);
        //todo create object for skills and objective
        if (skill) {

            this.props.taskActions.getQuestions({
                skill: skill,
                objective: objectiveValue
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.questions && !_.isEqual(nextProps.questions, this.state.questions) && _.size(nextProps.questions)) {
            this.setState({ questions: nextProps.questions, helps: nextProps.questions[0].preLoad || [] });
        }
    }

    onReceivedMessage(message) {
        const {navigation: {state: {params: {taskGroup: propsTaskGroup = {}} = {}} = {}} = {}} = this.props;
        // reject messages from myself
        if(message.user && message.user._id === this.props.user._id){
            return;
        }
        // reject messages intended for other groups
        if(message.receiver !== propsTaskGroup._team._id){
            return;
        }
        if (message.message && message.message == 'Task is completed' && message.task) {
            // console.log('got task completed',message.task);
            // this.refreshUserTask();
        }
    }

    // fetch latest userTaskGroups
    // refresh the redux state
    refreshUserTask = async () => {
        try {
            let response = await instance.get(`${API_BASE_URL}/userTaskGroupWithMessage?user_email=${this.props.user.profile.email}`)
            if (response && response.data && response.data.latestUserTaskGroups) {
                let _data = getGroupUserDetails(response.data)
                this.setState({
                    userTaskGroups: _data.latestUserTaskGroups
                })

                console.log('latestUserTaskGroups',_data.latestUserTaskGroups);
                this.props.userActions.getUserTaskGroupsCompleted({
                    ...this.props.taskGroups,
                    taskGroups: [..._data.latestUserTaskGroups]
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    onChange = (index, field, value) => {
        const { questions } = this.state;
        this.setState({
            modalVisible: false,
            questions: questions.map((question, i) => index === i ? { ...question, [field]: value } : question),
            activeIndex: null
        }, () => {});
    };

    onSave = () => {
        const { questions } = this.state;
        let isCompleted = true;
        for (let i = 0; i < questions.length; i++) {
            if (_.isEmpty(questions[i].answers)) {
                TaskView.flashMessage('Please complete all questions!');
                this.setState({ currentSlideIndex: i });
                this._carousel.snapToItem(i, true);
                isCompleted = false;
                break;
            }
        }
        if (isCompleted && !this.state.processing) {
            this.saveUserQuestions(questions);
        }
    };

    saveUserQuestions(questions) {
        const { taskGroups: { taskGroups }, navigation: {state: { params: { task_group_id }}} } = this.props;
        let index = taskGroups.findIndex( item => item._id === task_group_id);
        let memberIds = [];
        let leftBonusSparks = 0;
        if (index > - 1) {
            memberIds = taskGroups[index]._team.emails.map( item => {
                if (item.hasOwnProperty('userDetails')) {
                    return item['userDetails']._id;
                }
            });
            leftBonusSparks = taskGroups[index].leftBonusSparks;
        } else {
            let taskGroup = this.props.navigation.getParam('taskGroup', null);
            memberIds = taskGroup._team.emails.map( item => {
                if (item.hasOwnProperty('userDetails')) {
                    return item['userDetails']._id;
                }
            });
            leftBonusSparks = taskGroup.leftBonusSparks
        }

        let task = this.props.navigation.getParam('task', null);
        const reward = this.props.navigation.getParam('reward', {});
        if (!task) {
            return;
        }

        this.setState({
            processing: true,
        });
        const data = {
            taskId: task._id,
            userId: this.props.user._id,
            memberIds: memberIds,
            leftBonusSparks: leftBonusSparks,
            tokenCount: reward.value || 0,
            answers: questions.reduce((obj, item) => {
                obj[item._id] = { text: item.answers, timeChanged: Date.now() };
                return obj;
            }, {})
        };
        instance.post(SAVE_ANSWERS_PATH_API, data).then(async response => {
            console.log('waiting...');
            await this.refreshUserTask();
            console.log('waiting done.');
            this.updateTaskStatus(response.data.foundTask);
            this.updateTaskGroupStatus()
            this.refreshSparks();
            this.setState({
                resultModalVisible: true,
                processing: false,
                achievementCompletionDetail: this.getAchievementDetails(response.data)
            });
            const taskGroups = this.props.taskGroups.taskGroups;
            const id = this.props.navigation.state.params.task_group_id;
            const team_id = this.props.navigation.state.params.team_id;
            console.log('Task completed',this.props.user);
            MixPanel.track('Task Completed', {
                'user': this.props.user,
                'task': response.data.foundTask
                })
            this.socket.emit('client:message', {
                sender: this.props.user._id,
                receiver: team_id,
                chatType: 'GROUP_MESSAGE',
                message: 'Task is completed',
                task: response.data.foundTask
              });
        }).catch(error => {
            bugsnag.notify(error)
            console.error(error)
        });
    }

    getAchievementDetails(responseData, achievementIndex = 0) {
        let data = {};
        const { updatedAchievements, userAchievementResult, result } = responseData;

        if (updatedAchievements && updatedAchievements.length) {
            let updates = updatedAchievements[achievementIndex]; // for now take only 1
            let achievementsInfo = userAchievementResult.achievements.filter(
                info => info.achievementId === updates._id,
            )[0] || {};
            let achievementDescription = result.filter(
                info => info._id === updates._id,
            )[0] || {};
            updates = { ...updates, conditions: achievementsInfo.conditions || [] };

            data = {
                ...updates,
                countProgress: updates.conditions[0].counter,
                countComplete: updates.conditions[0].count,
                displayName: updates.name,
                id: updates._id,
                displayProgressVsComplete: `${this.getProgress(updates)}`,
                generic: false,
                description: achievementDescription.description
            };
        }
        return data;
    }

    getProgress(updates) {
        const conditionCounter = updates.conditions[0].counter;
        const conditionCount = updates.conditions[0].count;

        if (conditionCounter === conditionCount) {
            return `${updates.conditions[0].taskType} Complete!`;
        }

        const mathFloor = ~~((conditionCounter / conditionCount) * 100);
        return `${conditionCounter}/${conditionCount} ${updates.conditions[0].taskType || updates.conditions[0].task} - ${mathFloor}% Complete!`;
    }

    updateTaskStatus(task) {
        const {taskGroups: {stateTaskGroups = []} = {}} = this.props;
        const {navigation: {state: {params: {taskGroup: propsTaskGroup = {}} = {}} = {}} = {}} = this.props;
        const id = this.props.navigation.state.params.task_group_id;

        let taskGroups = [propsTaskGroup, ...stateTaskGroups]
        const index = id && taskGroups.findIndex(t => t._id === id);
        if (index > -1) {
            let taskIndex = taskGroups[index]['_tasks'].findIndex(t => t._id === task._id);
            if (taskIndex > -1) {
                taskGroups[index]['_tasks'][taskIndex] = task;
            }
        }
        this.props.userActions.getUserTaskGroupsCompleted({ ...this.props.taskGroups, taskGroups });
    }

    async updateTaskGroupStatus() {
        // collect info
        // get userTaskGroups from redux store
        const {taskGroups: {stateTaskGroups = []} = {}} = this.props;
        const {navigation: {state: {params: {taskGroup: propsTaskGroup = {}} = {}} = {}} = {}} = this.props;
        const id = this.props.navigation.state.params.task_group_id;
        // userTaskGroups
        let taskGroups = [propsTaskGroup, ...stateTaskGroups]
        const index = id && taskGroups.findIndex(t => t._id === id);
        const userTaskGroup = id && taskGroups.filter(t => t._id === id)[0];

        try {
            if(!userTaskGroup) throw new Error('userTaskGroup not found');
            const pendingUsers = checkUnlockAllParties(userTaskGroup);
            console.log("====Stories====",this.props.stories);
            const nextSequence = checkUnlockNextSequence(userTaskGroup,this.props.stories);
            console.log('pendingUsers ',pendingUsers);
            console.log('nextSequence ',nextSequence);

            if(!pendingUsers) throw new Error('pendingUsers not found');
            if(pendingUsers.length !== 0) {
                // capture wait until all parties complete a task
                let userDetails = this.getUserNames([...pendingUsers])
                this.setState({
                    pendingUsers: userDetails
                })
                // increment task counter in DB
                let endpoint = TASK_GROUP_SET_TASK_COUNTER_API_PATH
                await instance.post(endpoint,{ id })
                let counter = taskGroups[index]['taskCounter']
                taskGroups[index]['taskCounter'] = counter ? counter + 1 : 1

                this.props.userActions.getUserTaskGroupsCompleted({
                    ...this.props.taskGroups,
                    taskGroups
                });
                console.log('+1 pending users',taskGroups[index]['taskCounter']);
                // return;
                // commented return statement and added else if
                // so code can reach till dispatch action command
            } else if (nextSequence) {
                // capture transition to next sequence
                // set next sequence in DB
                let endpoint = TASK_GROUP_SET_SEQUENCE_API_PATH
                await instance.post(endpoint,{ id, nextSequence: nextSequence._id })
                //_typeobject is not used anymore
                taskGroups[index]['_typeObject'] = {...nextSequence,_objective: nextSequence._objective && nextSequence._objective._id};
                taskGroups[index]['taskCounter'] = 0;
                taskGroups[index]['leftBonusSparks'] = nextSequence.bonusSparks;
                console.log('0 next',taskGroups[index]['taskCounter']);
            } else {
                // capture repeating task
                let endpoint = TASK_GROUP_SET_TASK_COUNTER_API_PATH
                await instance.post(endpoint,{ id })
                let counter = taskGroups[index]['taskCounter']
                taskGroups[index]['taskCounter'] = counter ? counter + 1 : 1
                console.log('+1 repeat',taskGroups[index]['taskCounter']);
            }
            // dispatch action to update user task groups in redux store
            this.props.userActions.getUserTaskGroupsCompleted({
                ...this.props.taskGroups,
                taskGroups
            });


        } catch (error) {
            bugsnag.notify(error)
            console.error(error)
        }
    }

    getUserNames(users) {
        return _.map(users, u => u.profile.firstName);
    }

    refreshSparks() {
        const endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
        this.props.sparkActions.getSparksRequest({ endpoint });
    }

    onShowResult = () => {

        this.setState({ resultModalVisible: false });
        // this.props.navigation.navigate('Chat', { taskUpdated: true });
        this.props.navigation.pop();

    };

    onRemind = () => {
        let userId = this.props.user._id;
        let teamId = this.props.navigation.state.params.team_id;
        if (userId && teamId) {
            this.socket.emit('client:message', {
                sender: this.props.user._id,
                receiver: this.props.navigation.state.params.team_id,
                chatType: 'GROUP_MESSAGE',
                message: 'I\'ve done mine, have you?'
            });
        }
        this.setState({ resultModalVisible: false });
        this.props.navigation.pop();
        // this.props.navigation.navigate('Chat', { taskUpdated: true });

    };

    goToPreviousQuestion = () => {
        if (!this._carousel) {
            return;
        }

        this._carousel.snapToPrev(true);
    };

    goToNextQuestion = () => {
        if (!this._carousel) {
            return;
        }

        this._carousel.snapToNext(true);
    };

    renderIlluminate = ({ item, index }) => {
        const { helps, questions = [] } = this.state;
        let types = questions[index].answers instanceof Array;
        let isImage = types ? questions[index].answers.length !== 0 : questions[index].answers !== "";

        return <KeyboardAvoidingView style={styles.questionCard} enabled={true} behavior="padding">
            {isImage && <View style={styles.imageView}>
                <Image resizeMode="cover" style={styles.imageTick}
                       source={require("../../assets/images/rightTick.png")}

                />
            </View>}

            <Text style={styles.questionText}>{item.question}</Text>

            {!item.noImage && <Image resizeMode="cover" style={styles.image}
                source={{ uri: `${QUESTION_IMAGE_BASE_URL}${item._id}_cover` }}
                onError={() => this.onChange(index, 'noImage', true)}

            />}

            <Pagination
                dotsLength={questions.length}
                activeDotIndex={index}
                inactiveDotOpacity={0.6}
                carouselRef={this._carousel}
                tappableDots={true}
                inactiveDotScale={0.6}
                dotStyle={styles.paginationDots} />

            <TextInput multiline={true} placeholderTextColor={PLACEHOLDER_COLOR}
                       scrollEnabled={true}
                       onContentSizeChange={(event) => {
                           this.setState({
                               heightInput: event.nativeEvent.contentSize.height,
                           });
                       }}
                onChangeText={value => this.onChange(index, 'answers', value)}
                placeholder="Enter answer"
                style={[styles.textArea, {height: Math.min(150, this.state.heightInput)}, questions[index].answers ? styles.answerBorder : styles.placeholderBorder]}
                value={item && item.answers && item.answers.length ? item.answers : questions[index].answers} />

            {helps.length > 0 && <View style={styles.helpOption}>
                <Button style={styles.stepButton} onPress={() => this.setState({ modalVisible: true })}>
                    <Text style={styles.buttonText}>Get Help</Text>
                </Button>
            </View>}

        </KeyboardAvoidingView>;
    };

    renderHelpItem = (item, index, questionIndex) => {
        const { activeIndex } = this.state;
        return <View key={index}>
            <TouchableHighlight
                underlayColor={'#2C2649'}
                onShowUnderlay={() => this.setState({ activeIndex: index })}
                onHideUnderlay={() => this.setState({ activeIndex: null })}
                onPress={() => this.onChange(questionIndex, 'answers', item.content)}
            >
                <View style={styles.helpItem}>
                    <Text style={[styles.helpText, activeIndex === index ? {color: '#FFF'} : {}]}>{item.content}</Text>
                </View>
            </TouchableHighlight>
        </View>;
    };

    toggleModalVisibility() {
        const { modalVisible } = this.state;
        this.setState({ modalVisible: !modalVisible });
    }

    toggleForwardQuestionModal = () => {
        const {forwardQuestionModalVisible, questions, currentSlideIndex} = this.state;
        if(questions[currentSlideIndex].answers.length < 1){
            Alert.alert(
                'Alert',
                'Please answer the question first!',
                [
                  {text: 'OK', onPress: () => {}},
                ],
                {cancelable: false},
            );
            return;
        }
        this.setState({forwardQuestionModalVisible:!forwardQuestionModalVisible})
    }

    createShareObject(title, subtitle, comment) {
        return {
            title,
            subtitle,
            comment
        }
    }

    shareQuestion = () => {
        const { questions, currentSlideIndex, shareObject } = this.state;
        const { userActions, user } =  this.props;

        userActions.addShareObject({
            ...user,
            shares: [
                ...user.shares,
                {
                    ...this.createShareObject(
                        questions[currentSlideIndex].question,
                        questions[currentSlideIndex].answers,
                        shareObject.comment)
                },
            ]
        });

        this.toggleForwardQuestionModal();
    };

    updateShareComment = (text) => {
        this.setState({
            shareObject: {
                comment: text
            }
        });
    };

    render() {
        const { questions = [], currentSlideIndex, modalVisible, helps, resultModalVisible, processing = false, forwardQuestionModalVisible = false, shareObject } = this.state;
        const reward = this.props.navigation.getParam('reward', null);
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={Platform.OS === 'ios'}>
                <SafeAreaView style={styles.container}>
                    <Header title='Task'
                        navigation={this.props.navigation}
                        headerStyle={{
                            elevation: 0,
                        }}
                        headerIconStyle={{
                            color: '#F8F8F8',
                        }}
                        showForwardIcon={true}
                        onRight={this.toggleForwardQuestionModal}

                    />
                    <View style={styles.body}>
                        <Carousel
                            ref={c => this._carousel = c}
                            data={questions}
                            renderItem={this.renderIlluminate}
                            sliderWidth={width}
                            itemHeight={hp('70%')}
                            itemWidth={wp('90%')}
                            onBeforeSnapToItem={slideIndex => this.setState({
                                currentSlideIndex: slideIndex,
                                helps: questions[slideIndex].preLoad || []
                            })}
                        />
                    </View>
                    <View style={styles.actionPrevNextBtn}>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            disabled={currentSlideIndex === 0}
                            onPress={this.goToPreviousQuestion}>
                            <Text style={currentSlideIndex ? styles.actionBtnTxt : styles.actionBtnTxtDisabled}>Back</Text>
                        </TouchableOpacity>
                        {processing && <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 18}
                            style={{ paddingHorizontal: 14 }} color="#ffffff" />}
                        {!processing && <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={questions.length === currentSlideIndex + 1 ? this.onSave : this.goToNextQuestion}>
                            <Text style={styles.actionBtnTxt}>
                                {questions.length === currentSlideIndex + 1 ? 'Save' : 'Next'}
                            </Text>
                        </TouchableOpacity>}
                    </View>
                    <Modal  isVisible={resultModalVisible} styles={{paddingTop:5}}>

                        <View isVisible={true} style={styles.resultModal}>


                             <View style={styles.resultModalContent}>
                                <Text style={{color:"#ffffff",fontSize:25,fontWeight: 'bold',margin:5,marginBottom:15}}>Complete!</Text>
                                <Image
                                    source={require('./../../assets/images/Group.png')}
                                    style={styles.headerIcon}
                                  />
                                <Text style={[styles.buttonText, { fontSize: 18,color:'#ffffff',marginBottom:15   }]}>{this.state.achievementCompletionDetail.displayProgressVsComplete}</Text>
                                <Text style={[{ fontSize: 25,color:'#ffffff' }]}>You gain {reward.value || 0} {reward.type || ''}</Text>
                                {this.state.pendingUsers && this.state.pendingUsers.length !== 0 ?
                                <View>
                                    <Text style={[{ fontSize: 14,color:'#ffffff',textAlign:'center' }]}>The party is unable to move forward because {this.state.pendingUsers} has not completed a task yet.</Text>
                                    <Button style={[styles.stepButton,styles.modalButton,{backgroundColor: '#FFF'}]} onPress={this.onRemind} small rounded>
                                        <Text style={[{ fontSize: 18,color:'rgb(114,209,209)' }]}>Remind on chat</Text>
                                    </Button>
                                </View>:
                                <View>
                                    <Text style={[{ fontSize: 14,color:'#ffffff',textAlign:'center' }]}>The party moves forward to the next story because everyone has completed their task.</Text>
                                    <Button style={[styles.stepButton,styles.modalButton,{backgroundColor: '#FFF'}]} onPress={this.onShowResult} small rounded>
                                        <Text style={[{ fontSize: 18,color:'rgb(114,209,209)' }]}>Go</Text>
                                    </Button>
                                </View>}

                            </View>
                            <TouchableOpacity style={{ width:20,height:20,position:'absolute',top:10, right:10, backgroundColor:'#FFF',borderRadius:10, flex:1,alignItems:'center', justifyContent:'center'}} onPress={this.onShowResult}>

                                    <Icon name="close" size={16} color="#00C2BA"/>

                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        transparent
                        visible={modalVisible}
                        backdropOpacity={0.3}
                        style={styles.helpModalStyle}
                        onRequestClose={this.toggleModalVisibility.bind(this)}
                    >
                        <View style={styles.helpModal}>
                            <View style={styles.helpModalContent}>
                                <View style={styles.marginBottom20}>
                                    <Text style={styles.helpModalTitle}>Get Help</Text>
                                    <Text style={styles.helpModalSubTitle}>Please Choose an Answer</Text>
                                </View>
                                <ScrollView>
                                    {
                                        helps.map((item, index) => this.renderHelpItem(item, index, currentSlideIndex))
                                    }
                                </ScrollView>
                                <View style={styles.helpModalFooterCloseView}>
                                    <Button title='Close' transparent rounded onPress={this.toggleModalVisibility.bind(this)}>
                                        <Text style={styles.helpModalCloseButtonText}>Close</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={forwardQuestionModalVisible}
                        backdropOpacity={0.3}
                    >
                        <KeyboardAvoidingView style={{...styles.resultModal,...styles.forwardModal}} behavior="padding">
                            <View style={styles.forwardModalContent}>
                                <Text style={{...styles.helpModalTitle,...styles.forwardModalTitle}}>A Great question!</Text>
                                { questions[currentSlideIndex] && questions[currentSlideIndex].answers &&
                                    <QuestionCard
                                        header={questions[currentSlideIndex].question}
                                        content={questions[currentSlideIndex].answers}
                                    />
                                }
                                <KeyboardAvoidingView style={styles.forwardQuestionTextArea}>
                                <View style={styles.forwardQuestionCommentContainer}>
                                    <TextInput
                                      multiline={true}
                                      placeholderTextColor="#d4d4d4"
                                      scrollEnabled={true}
                                      placeholder="Add your comment or question"
                                      style={styles.forwardQuestionTextInput}
                                      value={shareObject.comment}
                                      onChangeText={this.updateShareComment}
                                     />
                                     <Icon name="attachment" size={25} color="#61686a"/>
                                 </View>
                                 <Button
                                     rounded
                                     title='Send'
                                     style={styles.forwardQuestionButton}
                                     onPress={this.shareQuestion}
                                 >
                                 <Text style={styles.forwardQuestionButtonText}> Send </Text>
                                </Button>
                                </KeyboardAvoidingView>
                            </View>
                            <TouchableOpacity style={{ width:20,height:20,position:'absolute',top:10, right:10,borderRadius:10, flex:1,alignItems:'center', justifyContent:'center'}} onPress={this.toggleForwardQuestionModal}>
                                <Icon name="close" size={25} color="#61686a"/>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </Modal>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}
