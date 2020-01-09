import React, {Component, Fragment} from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image,
    Alert,
    TextInput,
    Platform,
    Dimensions,
    Animated,
    Modal,
    FlatList,
    TouchableHighlight,
    KeyboardAvoidingView,
    Keyboard,
    ImageBackground,
} from 'react-native';
import * as axios from 'axios';
import {Thumbnail, Fab, Card, CardItem, Body} from 'native-base';
import {SystemMessage} from 'react-native-gifted-chat';
import Bubble from '../giftedChat/Bubble';
import Video from "react-native-gifted-chat/node_modules/react-native-video";

// When we keyboard appears and rest of screen componenets disappear it messes up calculation for MessageContainer in default gifted chat.
// To compensate that we are using our customized GiftedChat so MessageContainer takes flex:1 size instead dynamic caluclation.
import {GiftedChat} from '../giftedChat/GiftedChat';
import InputToolbar from '../giftedChat/InputToolbar';
import {EVENT_BRAINDUMP_COMPLETE, EVENT_TASK_COMPLETE, EVENT_CHAT_MESSAGE,EVENT_GROUP_NAME_CHANGE, EVENT_LEAVE_GROUP} from '../constants'
import SocketIOClient from 'socket.io-client';
import {CountDownText} from 'react-native-countdown-timer-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import MixPanel from "react-native-mixpanel";
import ImageOrVideo from "../components/ImageOrVideo"
import {TASK_GROUP_TYPES, TASK_GROUP_OBJECTIVE, MAIN_COLOR} from '../constants';
import {
    SAVE_TASK_PATH_API,
    UPDATE_USER_TASK_GROUP_API_PATH,
    GET_OBJECTIVE_API_PATH,
    CHAT_SOCKET_URL,
    GET_OBJECTIVE_BY_NAME_API_PATH,
    UPLOAD_TASK_FILE_API_PATH,
    TEAM_UPDATE_API,
    USER_TASK_GROUP_LIST_PATH_API,
    SAVE_USER_REWARD_LAST_USED_API_PATH
} from '../endpoints';
import styles from '../stylesheets/chatViewStyles';
import Header from '../components/Header';
import {patchGroup} from "../utils/patchutil";
import {getMessages, getuuid, getProfileImg, trackMixpanel, trackError} from '../utils/common';
import ReadMore from 'react-native-read-more-text';
//import Card from "../components/Card";
import {Client} from 'bugsnag-react-native';
import {BUGSNAG_KEY, API_BASE_URL} from "../config";
import _ from 'lodash';
import RewardModalHeader from "../components/RewardModalHeader";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BaseComponent from "./BaseComponent";
import { isSystemEvent, isUserEvent, setText } from "../utils/EventUtil";
import {showMessage} from 'react-native-flash-message';
import {  getUserTaskGroupsById, getUser, UpdateUserTaskGroup } from "../utils/grouputil";
import {  addMessage, updateConversation, createUpdateGroup } from "../realm/RealmHelper";
import { getSocket } from "../utils/socket";
let {height,width} = Dimensions.get('window')

import { submitScreenShot } from '../utils/braindump';

import I18n from '../utils/localize'
import reactotron from 'reactotron-react-native';
import ChatBonusView from '../components/ChatBonusView';
import ChatMembersView from '../components/ChatMembersView';
import ChatHandler from '../components/ChatHandler';

const fontFamilyName = Platform.OS === 'ios' ? "SFUIDisplay-Regular" : "SF-UI-Display-Regular";
const bugsnag = new Client(BUGSNAG_KEY);

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

const deviceWidth = Dimensions.get('window').width;
// TODO: Update this class to new Lifecycle methods
export default class ChatView extends BaseComponent {

  static flashMessage = message => showMessage({message, type: MAIN_COLOR});

    constructor(props) {
        super(props);
        const {navigation: {state: {params: {taskGroup = {}} = {}} = {}} = {}} = props;
        this.state = {
            taskGroup, //userTaskGroup
            group: null,
            userTask: {},
            processing: false,
            messages: [],
            userId: null,
            isReport: false,
            storyItemTextStyle: styles.storyItemImage,
            animatedStyle: {maxHeight: new Animated.Value(styles.contentHeight.maxHeight)},
            contentHeight: styles.contentHeight,
            rewardsVisible: false, //use this to show/hide Purchased Rewards model.
            dialogVisible: false,
            selectedReward: {},
            keyboardShow: false,
            editModalVisible: false,
            groupName: '',
            renderModalVideo : false,
            videoModalUri: "",

        };


        this.setOnSend = this.setOnSend.bind(this);
        this.renderModalVideo = this.renderModalVideo.bind(this);

    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.setTaskAndTaskGroup();
        trackMixpanel("Entered Chatroom (Chatview)")

    }

    componentDidMount() {

        super.componentDidMount();

        const {userActions} = this.props;
        this.props.navigation.addListener(
            'willFocus',
            () => {
                //  userActions.getMessageListRequest(this.state.taskGroup._team._id);
            }
        );

    }

    shouldComponentUpdate(nextProps, nextState)
    {
      return (
       !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
      );
    }

    refreshAppFromBackground (){
      //update the app with components needed after coming alive.
      instance.get(`${API_BASE_URL}/getConversationById?id=${this.state.group._team.conversation._id}`)
          .then((response) => {
                  let convo = response.data;
                    updateConversation(convo);
                    let messages=getMessages (this.state.group,convo.messages,this.props.user.blockUserIds, this.props.user);
                    messages.reverse();
                    this.setState({messages: messages});
                })
          .catch((error) => {
          trackError(error)
        });

    }

    componentWillReceiveProps(nextProps) {

      if (nextProps.navigation.state.params.statusMessage) {
          // ChatView.flashMessage(nextProps.navigation.state.params.statusMessage);
      }

        if (nextProps.navigation.state.params.taskUpdated) {
            this.setTaskAndTaskGroup();
        }

        if (nextProps.reportUserSuccess && nextProps.reportUserSuccess != this.props.reportUserSuccess) {
            alert('Your report has been successfully submitted. We will take action against him.')
        }

        //comes from braindumpview when a camera shot is taken
        if (nextProps.navigation.state.params.msgContent) {
            const msg = nextProps.navigation.state.params.msgContent;
            const mediaType = nextProps.navigation.state.params.mediaType;
            const mediaDataURI = nextProps.navigation.state.params.mediaDataURI;

            nextProps.navigation.state.params.msgContent = null;
            nextProps.navigation.state.params.mediaType = null;
            nextProps.navigation.state.params.mediaDataURI = null;

            const msgUser = this.props.user;
            this.onSend([
                {
                    createdAt: new Date(),
                    _id: getuuid(),
                    user: {
                        _id: this.props.user._id,
                        name: this.props.user.profile.firstName,
                        avatar: msgUser.profile.pictureURL || `https://ui-avatars.com/api/?name=${msgUser.profile.firstName ? msgUser.profile.firstName : ''}+${msgUser.profile.lastName ? msgUser.profile.lastName : ''}`
                    }
                }
            ], msg, mediaType, mediaDataURI);
        }
    }

    componentWillUnmount() {


        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({keyboardShow: true})
    }

    _keyboardDidHide = () => {
        this.setState({keyboardShow: false})
    }

    handleActiveRefresh(){
      console.log("Chatview handling active refresh")
      // handle view specific refresh
    }

    //this sets the group that will be used in the page
    setTaskAndTaskGroup() {
        let id = this.props.navigation.state.params.params ? this.props.navigation.state.params.params.task_group_id : this.props.navigation.state.params.task_group_id ;
        console.log("ID to be searched ", id)
        let idsArray =[];
        idsArray.push(id);

        let group = getUserTaskGroupsById(idsArray)[0];

        this.setState({group: group});

        if (group._team && group._team.conversation && group._team.conversation.messages && group._team.conversation.messages.length > 0) {
            let arrayMessages = getMessages(group, group._team.conversation.messages, this.props.user.blockUserIds, this.props.user);
              arrayMessages.reverse();
            this.setState({messages: arrayMessages});
        }


    }

    componentWillUnmount() {
        let st = this.state;
    }

    goToTask = story => {
        if (this.state.processing) {
            return;
        }
        const {group} = this.state;
        let objectiveName = group._userStory && group._userStory._objective.name;
        let objectiveType = group._userStory && group._userStory._objective.type;

        trackMixpanel("User started task ",this.state.group )

        if (objectiveType === TASK_GROUP_OBJECTIVE.BRAINDUMP || objectiveType.includes(TASK_GROUP_OBJECTIVE.BRAINDUMP)) {
             this.props.navigation.navigate('Braindump', {group: group,user: this.props.user, isToOpenCamera:true,isFromChatView:false,showStoryView:false});
            //this.props.navigation.navigate('Camera', {group: group, user: this.props.user, isFromChatView: false});
            return;
        }

        if (objectiveType === TASK_GROUP_OBJECTIVE.ILLUMINATE || objectiveType.includes(TASK_GROUP_OBJECTIVE.ILLUMINATE)) {
            this.props.navigation.navigate('Illuminate', {group: group});
            return;
        }

        if (objectiveType === TASK_GROUP_OBJECTIVE.DECODE || objectiveType.includes(TASK_GROUP_OBJECTIVE.DECODE)) {
            this.props.navigation.navigate('DecodeView', {group: group});
            return;
        }

        if (objectiveType === TASK_GROUP_OBJECTIVE.VOICE || objectiveType.includes(TASK_GROUP_OBJECTIVE.VOICE)) {
            this.props.navigation.navigate('VoiceView', {group: group});
            return;
        }

        let taskGroupId = this.props.navigation.state.params.task_group_id;
        const {skill, reward, objectiveValue} = story;
        if (!skill) {
            return;
        }

    };

    gotoRewards = story => {
        this.props.navigation.navigate('Rewards', {
            user: this.props.user,
        });
    };

    //used when determining whether to lock the user's start task button
    isTaskCompleted() {

        return this.state.userTask && this.state.userTask.status === 'complete';
    }

    //used when determining whether to lock the user's start task button
    isTaskRepeating() {

        return this.state.group && this.state.group._userStory && this.state.group.taskCounter && this.state.group.taskCounter > 0;
    }

    //used when determining whether to lock the user's start task button
    isTaskQuotaOver() {

        return this.state.group && this.state.group._userStory && this.state.group.taskCounter === this.state.group._userStory?.quota;
    }

    secondsUntilMidnight() {
        var midnight = new Date();
        midnight.setHours(24, 0, 0, 0)
        return parseInt((midnight.getTime() - new Date().getTime()) / 1000);
    }

	setMessagesWithOrder (msgs) {
        msgs.sort((x, y) => {
            return x.time - y.time;
        })
        msgs.reverse();
        this.setState({messages: msgs});
    }

    showReportAlertInformation() {
        alert('You need to long press on the chat for reporting it to the admin.')
    }

    navigateToUserList() {
        this.props.navigation.navigate('UsersList', {taskGroupData: this.state.group, user: this.props.user});
    }

    setMessageReceiveListener(listener) {
        this.messageReceiveListener = listener;
    }

    setOnSend(onSend) {
        this.onSend = onSend;
    }

    onReceivedMessage(message) {
      console.log("onReceivedMessage")
        let group = this.state.group;
        // reject messages intended for other groups
        if (message.receiver !== group._team._id) {
            return;
        }
        super.onReceivedMessage(message); //calls the parent received message which will update the task object if the event is suitable
        this.messageReceiveListener(message)
    }
    renderModalVideo(){

        let {videoModalUri} = this.state;
        return(
            <Modal
            animationInTiming={1000}
            animationType={"slide"}
            transparent={true}
            visible={this.state.renderModalVideo}
            style={[styles.modalContent,{ backgroundColor : "red"}]}
             onRequestClose={this._setModalVideoVisible.bind(this)}
             onBackdropPress={this._setModalVideoVisible.bind(this)}
             onSwipeComplete={this._setModalVideoVisible.bind(this)}
        >
    <TouchableOpacity activaOpacity={1} onPress={() => {this.setState({renderModalVideo : false})}} style={{backgroundColor: "#000000"}}>
    <View  style={{height: height,width :width, position: "absolute",
          top: 20,
          left: 20,
           zIndex: 100,
          }} >
                    <Icon name="close-circle-outline" size={30} color="#ffffff"/>
             </View>

              <ImageOrVideo
           type={"video"}
            style={[
              {
                width: '100%',
                height: '100%'
              },
              { backgroundColor:  'black' }
            ]}
            // source={{ uri:
            //     "http://techslides.com/demos/sample-videos/small.mp4" }}
                source={{ uri:
                    videoModalUri }}
            >

            </ImageOrVideo>

{/* <Video source={{uri:
                "http://techslides.com/demos/sample-videos/small.mp4" }}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
                     // Callback when video cannot be loaded
          fullscreen={false}
          resizeMode={"cover"}
          muted={true}
          rate={1.0}
          controls={false}
          repeat={true}
          ignoreSilentSwitch={"obey"}
          style={{height: height,width :width, position: "absolute",
          top: 0,
          left: 0,
          alignItems: "stretch",
        //   zIndex: 10,
          bottom: 0,
          right: 0}} > */}


              {/* </Video> */}
          </TouchableOpacity>
          </Modal>
            );
    }


    render() {
        const {group, keyboardShow} = this.state;

        const isRepeating = this.isTaskRepeating();
        const isQuotaOver = this.isTaskQuotaOver();
        //const isCompleted = this.isTaskCompleted();
        const secondsUntilMidnight = this.secondsUntilMidnight();
        const uri = getProfileImg (this.props.user.profile);
        // const user = {
        //     _id: this.props.user._id,
        //     name: this.props.user.profile.firstName ? this.props.user.profile.firstName : '' + ' ' + this.props.user.profile.lastName ? this.props.user.profile.lastName : '',
        //     avatar: uri,
        // };
        const story = group._userStory;

        const taskGroupType = group.type;

        // this is used to derive how many additional members to show in the group members section of the GUI
        let image1, image2, countExtraMember;
        if (group._team && group._team.users){
          countExtraMember = group._team.users.length - 2;
          // Now showing photos
          if (group._team.users.length > 0) {
              let user = this.state.group._team.users [0];
              const uri = getProfileImg (user.profile);
              image1 = <Thumbnail
                  style={styles.member1}
                  source={{uri: uri }}/>;
          }
          if (group._team.users.length > 1) {
              let user = this.state.group._team.users [1];
              const uri = getProfileImg (user.profile);
              image2 = <Thumbnail
                  style={styles.member2}
                  source={{uri: uri }}/>;
          }
        }

        return (
            <Fragment>
                 <ImageBackground source={require('../images/backblue.png')}
                                 style={{width: '100%', height: Platform.OS === 'ios' ? 94 : 57, flex: 0}}>
                    <SafeAreaView style={{flex: 0, backgroundColor: "transparent"}}>
                        <Header
                            title={group.name + '...'}
                            navigation={this.props.navigation}
                            bottomText={story.quota ? `${group._team.users.length} of ${story.quota} Members Online` : ''}
                            showEditIcon={group._user._id === this.props.user._id}
                            onEditIconClick={() => this.onEditIconClick()}
                            headerStyle={styles.headerStyle}
                            fontStyle={styles.fontStyle}
                            headerTitleStyle={styles.headerTitleStyle}
                            ShowInfoIcon={true}
                            TaskGroupData={group}
                            onInfoPress={this.props.navigation}
                            headerRightTextStyle={styles.headerRightTextStyle}
                        />
                    </SafeAreaView>
                </ImageBackground>

                <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
                    {this.renderModalVideo()}
                    {!keyboardShow && this._renderRewardsModal()}
                    {!keyboardShow && this._renderUsingRewardModal()}
                    {this._renderEditModal()}
                    {!keyboardShow && <View style={styles.storyDetailView}>

                        <ChatBonusView
                            group={group}
                            isRepeating={isRepeating}
                            isQuotaOver={isQuotaOver}
                            secondsUntilMidnight={secondsUntilMidnight}
                            goToTask={this.goToTask}
                            processing={this.state.processing}
                        />
                       </View> }
                    {!keyboardShow && this.state.selectedImage ?
                        <View style={{paddingHorizontal: 15}}>
                            <View style={{padding: 4, borderRadius: 10, flexDirection: 'row'}}>
                                <Image source={this.state.selectedImage}
                                       style={{height: 70, width: 70, borderRadius: 10, marginRight: 5}}/>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => this.uploadSelectedImage(story)} style={{
                                        backgroundColor: "#1FBEB8",
                                        borderRadius: 15,
                                        flexDirection: 'row'
                                    }}>
                                        <View style={{paddingRight: 6, flexDirection: 'row', alignItems: 'center'}}>
                                            {this.state.processing ? (
                                                <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 30}
                                                                   color="#ffffff"/>
                                            ) : <Icon name="progress-upload" size={30} color="#FFF"/>}
                                            <Text style={{fontSize: 12, color: "#FFF"}}>Submit for approval</Text>
                                        </View>

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.removeSelectedImage()}>
                                        <Icon name="close-circle-outline" size={30} color="#0000004D"/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        : null}
                    {!keyboardShow &&
                    <ChatMembersView
                        image1={image1}
                        image2={image2}
                        countExtraMember={countExtraMember}
                        user={this.props.user}
                        group={group}
                        navigation={this.props.navigation}
                     />
                    }


                    <View style={[{flex: 1}]}>
                    <ChatHandler
                        messages={this.state.messages}
                        setOnSend={this.setOnSend}
                        extraData={this.state}
                        user={this.props.user}
                        userActions={this.props.userActions}
                        group={this.state.group}
                        navigation={this.props.navigation}
                        setMessageReceiveListener={this.setMessageReceiveListener.bind(this)}
                    />
                        {/* <GiftedChat
                            keyboardShouldPersistTaps={"never"}
                            messages={this.state.messages}
                            onSend={messages => this.onSend(messages)}
                            extraData={this.state}
                            user={user}
                            showUserAvatar={true}
                            renderMessageVideo={(props) => this.renderMessageVideo(props)}
                            renderInputToolbar={this._renderGiftedToolBar}
                            showAvatarForEveryMessage={true}
                            onLongPress={(context, message) => this.reportConfirmation(message)}
                            renderSystemMessage={this.renderSystemMessage.bind(this)}
                            renderBubble={this.renderBubble.bind(this)}
                        /> */}
                    </View>
                </SafeAreaView>
                {Platform.OS === 'ios' && <KeyboardSpacer/>}
                <SafeAreaView style={{backgroundColor: '#3C1364', flex: 0}}/>
            </Fragment>
        );

    }


    _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={styles.showOrLess} onPress={() => {
                handlePress();
                Animated.timing(this.state.animatedStyle.maxHeight, {
                    toValue: styles.contentHeightMax.maxHeight,
                    duration: 500
                }).start(function () {

                });
            }}>
                more
            </Text>
        );
    }

    _renderRevealedFooter = (handlePress) => {

        return (
            <Text style={styles.showOrLess} onPress={() => {
                Animated.timing(this.state.animatedStyle.maxHeight, {
                    toValue: styles.contentHeight.maxHeight,
                    duration: 500
                }).start(function () {
                    handlePress();
                });
            }}>
                less
            </Text>
        );
    }

    onEditIconClick = () => {
        this.setState({
            editModalVisible: true
        })
    }

    setModalVisible(visible){
        this.setState({
            editModalVisible: visible
        })
    }

    onSubmitBtnClicked() {


      const data = {
          "newName": this.state.groupName,
          "_id": this.state.group._id
      }

      this.setModalVisible(false);

      instance.post(`${API_BASE_URL}/saveTaskGroup`, data).then(response => {
              if (response) {

                savedGroup= response.data;
                  getSocket().emit('client:message', {
                      msgId: getuuid(),
                      sender: this.props.user._id,
                      receiver: savedGroup._team._id,
                      chatType: 'GROUP_MESSAGE',
                      type: EVENT_GROUP_NAME_CHANGE,
                      groupId: savedGroup._id,
                      time: new Date().toISOString(),
                      message: 'The group name has changed to ' + this.state.groupName ,
                      isJoining: true,
                      userProfile: this.props.user
                  });


                //this.state.group.name=this.state.groupName;

                  createUpdateGroup(response.data);
                  savedGroup._team.conversation.messages=this.state.messages;
                  this.setState({group: savedGroup});

                //  this.refreshUserTask()
              }

          }).catch((error) => {
            trackError(error);
          });
    }

    onCancelBtnClicked() {
        this.setModalVisible(false)
    }

    _renderEditModal() {
        return (
            <Modal
                        animationInTiming={1000}
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.editModalVisible}
                        style={[styles.modalContent, { justifyContent: "flex-end", margin: 0 }]}
                        onRequestClose={this.setModalVisible.bind(this)}
                        onBackdropPress={this.setModalVisible.bind(this)}
                        onSwipeComplete={this.setModalVisible.bind(this)}
                    >
              <View style={styles.likeModalView}>
            <View style={styles.editGroupNameModalInnerView}>
            <Text style={styles.editGroupNameDialogTitle}>{I18n.t("enterGroupName")}</Text>

            <TextInput
            autoCapitalize="none"
            keyboardType="default"
            underlineColorAndroid="transparent"
            placeholder={'Enter group name'}
            placeholderTextColor="#a4b0be"
            style={styles.inputStyle}
            value={this.state.groupName}
            onChangeText={groupName => {
              this.setState({ groupName });
            }}
          />

            <View style={{
                flex: 0,
                flexDirection: 'row'
            }}>
            <TouchableOpacity onPress={this.onSubmitBtnClicked.bind(this)}>
                <Text style={styles.submitBtn}>{I18n.t("submit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onCancelBtnClicked.bind(this)}>
                <Text style={styles.submitBtn}>{I18n.t("cancel")}</Text>
            </TouchableOpacity>
            </View>

          </View>
          </View>
          </Modal>
        )
    }



    _renderRewardsModal() {
        return (
            <SafeAreaView>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.rewardsVisible}
                    onRequestClose={() => {
                        this._handleModalVisibility(false)
                    }}>

                    <View style={styles.modal}>
                        <RewardModalHeader title='Rewards' navigation={this.props.navigation} onLeft={() => {
                            this._handleModalVisibility(false)
                        }}/>

                        <FlatList
                            renderItem={this._renderListItem.bind(this)}
                            data={this.props.user.userRewards}
                            keyExtractor={item => item._id}/>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    };

    _renderListItem(rewardItem) {
        if (rewardItem?.item?.reward?._upgrade != null) {
            return (
                <TouchableOpacity style={styles.rewardItemRoot} onPress={() => {
                    this.setState({
                        selectedReward: rewardItem
                    });
                    this._showUsingRewardPopup()
                }}>
                    <Image style={styles.rewardsImg} source={rewardsImg}/>
                    <View style={styles.rewardItemContainer}>
                        <Text style={styles.rewardItemTitle}>{rewardItem.item.reward._upgrade.name}</Text>
                        <Text style={styles.rewardItemDesc}
                              ellipsizeMode='tail'
                              numberOfLines={3}
                        >
                            {rewardItem.item.reward._upgrade.description}
                        </Text>
                        <Text style={styles.rewardItemCounter}>{rewardItem.item.reward._upgrade.sparks}</Text>
                    </View>

                </TouchableOpacity>
            );
        } else {
            return (
                <View/>
            );
        }
    };

    _handleModalVisibility = (visibility) => {
        this.setState({
            rewardsVisible: visibility
        })
    };

    _handleTextReady = () => {
        // ...
    };

    _showUsingRewardPopup() {
        this._setModalVisible(true)
    }

    onRequestCloseModal() {
        this._setModalVisible(!this.state.dialogVisible);
    }

    _renderUsingRewardModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.dialogVisible}
                onRequestClose={this.onRequestCloseModal.bind(this)}
            >
                <View style={styles.likeModalView}>
                    <View style={styles.likeModalInnerView}>
                        <Text style={styles.likeModalTitle}>You will use the Reward:</Text>
                        <Text
                            style={styles.likeModalTitle}>{this.state.selectedReward?.item?.reward?._upgrade?.name}</Text>
                        <View>
                            <Text style={styles.likeModalText}>Extend the Group Bonus Spark
                                by {this.state.selectedReward?.item?.reward?._upgrade?.usageValue} Number of
                                Uses: {this.state.selectedReward?.item?.reward?._upgrade?.sparks} |
                                Reset Weekly</Text>

                            {this.state.processing ? (
                                <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 22}
                                                   style={{paddingHorizontal: 14}} color="#1FBEB8"/>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => this._onRewardConfirm()}>
                                    <Text style={{
                                        ...styles.likeModalAction
                                    }}>
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </View>
                        <TouchableOpacity
                            onPress={this.onRequestCloseModal.bind(this)}
                            style={styles.likeModalClose}
                        >
                            <View>
                                <Icon name='close' style={styles.likeModalCloseIcon}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    _setModalVisible(visible) {
        this.setState({dialogVisible: visible});
    }
    _setModalVideoVisible(visible) {
        this.setState({renderModalVideo: visible});
    }

    _onRewardConfirm() {
        if (!this.state.processing) {
            this.setState({processing: true});
            const userId = this.props.user?._id;
            const rewardId = this.state.selectedReward?.item?.reward?._upgrade?._id;
            let endpoint = SAVE_USER_REWARD_LAST_USED_API_PATH.replace('{userId}', userId);
            endpoint = endpoint.replace('{rewardId}', rewardId);
            const reducedSpark = this.state.selectedReward?.item?.reward?._upgrade?.usageValue;
            instance.get(endpoint).then(response => {
                this.setState({processing: false});
                if (response != null) {
                    getSocket().emit('client:message', {
                        sender: this.props.user._id,
                        receiver: this.state.group._team._id,
                        chatType: 'GROUP_MESSAGE',
                        type: EVENT_CHAT_MESSAGE,
                        time: new Date().toISOString(),
                        userProfile: this.props.user,
                        message: 'Bonus Sparks has reduced by ' + reducedSpark + '! Complete your tasks now!',
                        isReward: true
                    });
                    //this.state.selectedReward?.item?.currentCounter++;
                    this.onRequestCloseModal();
                }

            }).catch((error) => {
                this.setState({processing: false});
                trackError(error)
            });
        }
    }

}
const rewardsImg = require('../../assets/images/rewardsImg.png');
