/**
 * @Updated taskViews
 **/

import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Keyboard
} from 'react-native';
import {  getQuestionsBySkill,createUpdateShare,addTaskToGroup } from "../realm/RealmHelper";
import { patchQuestions, trackMixpanel, flashMessage, resizeImg,getuuid } from "../utils/common";

import { broadcastShare,broadcastMessage } from "../utils/shareutil";
import * as axios from 'axios';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import _ from 'lodash';
import { API_BASE_URL } from '../config';
import {
  SAVE_ANSWERS_PATH_API,
  USER_SPARK_LIST_PATH_API,
  CHAT_SOCKET_URL,
  TASK_GROUP_SEQUENCE_API_PATH,
  TASK_GROUP_SET_TASK_COUNTER_API_PATH,
  TASK_GROUP_SET_SEQUENCE_API_PATH,
  UPLOAD_BRAINDUMP_IMAGE
} from '../endpoints';
import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';
import styles from '../stylesheets/taskViewStyles';
import MixPanel from 'react-native-mixpanel';
import Modal from 'react-native-modal';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Client } from 'bugsnag-react-native';
import { BUGSNAG_KEY } from '../config';
import BaseComponent from "./BaseComponent";
import { ILLUMINATE_STRINGS } from '../utils/strings';
import { black } from 'ansi-colors';
import ViewShot, { captureScreen } from 'react-native-view-shot';
const bugsnag = new Client(BUGSNAG_KEY);
import {EVENT_ILLUMINATE_SHARE,EVENT_ILLUMINATE_COMPLETE} from '../../src/constants';
const { width } = Dimensions.get('window'); //full width
import {checkProgressStory} from '../utils/grouputil';
import AnswerItem from '../components/AnswerItem';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

let illuminateTask = null;

export default class IlluminateView extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      keyboardOpen: false,
      taskId: null, //somehow need the '' otherwise server gets error on the "keys"
      questionContentArray: [],
      currentQuestionIndex: 0,
      dummyText: 'Select and Answer',
      isVisible: true,
      selectedBottomBtnIndex: 3,
      strAnswer: '',
      name: '',
      showShareModal: false,
      userThoughts:'',
      rectangleImages: [
        require('../../assets/images/rectangles/Rectangle1.png'),
        require('../../assets/images/rectangles/Rectangle2.png'),
        require('../../assets/images/rectangles/Rectangle3.png'),
        require('../../assets/images/rectangles/Rectangle4.png'),
        require('../../assets/images/rectangles/Rectangle5.png'),
        require('../../assets/images/rectangles/Rectangle6.png'),
        require('../../assets/images/rectangles/Rectangle7.png'),
        require('../../assets/images/rectangles/Rectangle8.png')
      ],
      rectangleBGImages: [
        require('../../assets/images/rectangles/RectangleBG1.png'),
        require('../../assets/images/rectangles/RectangleBG2.png'),
        require('../../assets/images/rectangles/RectangleBG3.png'),
        require('../../assets/images/rectangles/RectangleBG4.png'),
        require('../../assets/images/rectangles/RectangleBG5.png'),
        require('../../assets/images/rectangles/RectangleBG6.png'),
        require('../../assets/images/rectangles/RectangleBG7.png'),
        require('../../assets/images/rectangles/RectangleBG8.png')
      ],
      selecetedRectangle: 0,
      isNeedsToVisibleComponent: true
    };
    this.onFooterButtonClick = this.onFooterButtonClick.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentWillMount() {
    this.state.group= this.props.navigation.state.params.group
    let questions = this.getRandomQuestions(this.props.navigation.state.params.group._userStory)
    this.state.questionContentArray=questions;

    this.illuminateTask  = this.createTask();
    this.state.taskId = this.illuminateTask._taskId;
  }

  createTask() {
    return {
      _taskId: getuuid(),
      content: []
    };
  }
  componentDidMount() {
    super.componentDidMount();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow() {
    this.setState({keyboardOpen: true});
  }

  _keyboardDidHide() {
    this.setState({keyboardOpen: false});
  }
  captureScreenShot() {

    trackMixpanel('Submitted a Illuminate');
    const {taskId} = this.state;


//    const taskId = '' + new Date().getMilliseconds()


    // captureScreen ({  result: 'tmpfile' })

    this.setState(
      (prevState, props) => ({ isNeedsToVisibleComponent: false }),
      () => {
        this.refs.viewShot.capture()
        .then ( async uri => {
          console.log("URI SAVED>>>>> ", uri)
          let submitURI=uri//await resizeImg(uri,414,414,'JPEG',80);
          let obj = {  uri:submitURI, fileName: taskId, type: 'image/jpeg' };
            console.log("uploadImage >>>>> ", obj)
          let result = await this.uploadImage(taskId, obj);

          if (result){

            var loginUserId = this.props.user._id;
            const { questionContentArray, currentQuestionIndex } = this.state;

            //we set uuid for front end because we want to forward the content to receivers before waiting for the server response.
            let shareuuid=getuuid()
            console.log()
            let data = { 'image':result.Location, 'userid': loginUserId, 'content1': this.state.userThoughts, 'content2':questionContentArray[currentQuestionIndex], 'content3': this.state.strAnswer, _feid: shareuuid, groupId: this.state.group._id };

            const response =  await instance.post('/addShare', data)
            console.log("RESPONSE from addshare", response);
            //userActions.shareContentRequest({arrayParam});
            if (response){
              createUpdateShare(response.data);
              broadcastShare(response.data, this.props.user, this.state.group, EVENT_ILLUMINATE_SHARE);
            }
//            this.callApiToCreateShareObject(this.state.userThoughts,questionOne.content1, this.state.strAnswer)

            /*
            Needed to have the share populated into the this.props.user.shares. THis is used in the export share in the dashboard
            Should just add the share to the state instead - need to synch with login
            */
            this.props.userActions.fetchUserProfile(this.props.user._id);
          }
          this.setState({ isNeedsToVisibleComponent: true });
        })
        .catch(error => {
          bugsnag.notify(error);
          console.log(error);
        });
      }
    );
  }

  async initiateIlluminate() {
    console.log("initiateIlluminate() triggered")
    trackMixpanel('Illuminate Completed');

    var loginUserId = this.props.user._id;

    //we set uuid for front end because we want to forward the content to receivers before waiting for the server response.
    let contentuuid=getuuid();
    let shareuuid=getuuid();

    let content1=this.props.user.profile.firstName + " completes an Illuminate!";


    let contentData = { content1:  content1};
    let data = {
      'taskId': this.state.taskId,
      "contentFeid": contentuuid ,
      'shareFeid':shareuuid ,
      'groupId': this.state.group._id ,
      'userId': loginUserId,
      'contentData': contentData,
      'illuminateData': this.illuminateTask.content,
    };

    this.props.navigation.navigate("Chat", {
        task_group_id: this.state.group._id,
        taskUpdated: true,
        statusMessage: "SUCCESS",
        taskGroup: this.state.group,
    });

    console.log("initiateIlluminate before post")
    const response =  await instance.post('/addIlluminate', data)





    //userActions.shareContentRequest({arrayParam});
    if (response){
      try{
          let latestGroup = await addTaskToGroup(response.data, this.state.group._id);
          this.setState({group:latestGroup});
          //latestGroup.messages=this.state.group._team.conversation.messages;
          checkProgressStory(latestGroup);
          console.log("before broadcastmessage")
          broadcastMessage(content1,this.props.user, this.state.group, EVENT_ILLUMINATE_COMPLETE)
          console.log("after broadcastmessage")


      } catch (error) {console.error(error);}

    //  broadcastShare(response.data, this.props.user, this.state.group, EVENT_ILLUMINATE_SHARE);
  }


  }

  async uploadImage(taskId, photo) {
    let result;

    let data = await this.createFormData(photo, { userId: '123', taskId:taskId });
    let path = UPLOAD_BRAINDUMP_IMAGE.replace('{}', taskId);
    await fetch(path, { method: 'POST', body:  data })
      .then(response => response.json())
      .then(response => {
        console.log("response! ", response)
        result = response;
          return result;
      })
      .catch(error => {
        bugsnag.notify(error);
        console.log(error);
        flashMessage("Error with uploading! ", error)
      });
      return result;
  }

  createFormData(photo, body) {
    const data = new FormData();
    data.append('image', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '')
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  }

  shouldComponentUpdate(nextProps, nextState)
      {
        return (
          !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
        );
      }

  getRandomQuestions(taskDetail) {
    const noOfquestions = parseInt(taskDetail.objectiveValue);
    const requiredSkill = taskDetail.skill;
    listOfQuestion = getQuestionsBySkill(requiredSkill);
    //remove any questions that do not have pre-defined questions

    let noOfPreload=0;
     listOfQuestion.forEach(qns => {
        if (qns.preLoad){
          noOfPreload++;
        }
    });

    if (listOfQuestion.length==0 || noOfPreload < noOfquestions){
       patchQuestions(requiredSkill);
      listOfQuestion = getQuestionsBySkill(requiredSkill);
    }

    //listOfQuestion = _.remove(listOfQuestion, function(question) { return !question.preload });

    // Fitering of questions as per required skill.

  /*  const listOfMatchedSkilledQuestions = listOfQuestion
      .filter(function(item) {
        return item.roadmapSkill == requiredSkill;
      })
      .map(function(item) {
        return item;
      });*/
      return this.shuffleArray(listOfQuestion, noOfquestions);
  }

  /*Shuffling for Questions and pick the requied number of question

     params :
               array - Total number of questions for shuffle
                pickCount -  Required nubmer of questions
      Return  :
        [
            {
                content1: "What is the difference between problem solving and critical thinking skills?",
                content2: undefined
            }
        ]
    ]

     */
  shuffleArray(array, pickCount) {
    let shuffledArray = array;
    shuffledArray = _.shuffle(shuffledArray);

  /*  let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }*/

    var contentArray = new Array();

    for (i = 0; i < pickCount; i++) {

      question = shuffledArray[i];
        if (question) {
          const content = {
            content1: question.question,
            content2: question.preLoad,
            content3: null, // For Answers
            content4: null
          };
          if (content.content1){
            contentArray.push(content);
          }
      }
    }

      return contentArray;
  }



  /* to capture when illuminate is submitted */
  onFooterButtonClick(buttonText) {
    this.answerItemRefUncheck();
    console.log("button clicked ", buttonText)
    const { questionContentArray, currentQuestionIndex } = this.state;
    if (currentQuestionIndex >= questionContentArray.length - 1) {
      console.log("before initiateIlluminate")
      this.initiateIlluminate();
      console.log("after initiateIlluminate")

      return;
    }

    let selectedIndx = 3;
    if (buttonText == ILLUMINATE_STRINGS.btnTextDontCare) {
      selectedIndx = 1;
    } else if (buttonText == ILLUMINATE_STRINGS.btnTextNutral) {
      selectedIndx = 2;
    }

    const questionOne = questionContentArray[currentQuestionIndex];
    if (questionOne){
        questionOne.content4 = buttonText;
        questionContentArray[currentQuestionIndex] = questionOne;
        this.setState({
          questionContentArray: questionContentArray,
          currentQuestionIndex: currentQuestionIndex + 1,
          selectedBottomBtnIndex: selectedIndx
        });
    }
  }

  saveAnswer = () => {
    this.setState({
      isVisible: true
    });
  };
  cancelThisCustomAnswer = () => {
    this.setState({
      isVisible: true
    });
  };

  onTextInputFocus = () => {
    this.setState({
      isVisible: false
    });
  };

  renderTextInput = () => {
    return (
      <View>
        <View style={taskStyles.customInputContainer}>
          <View>
            <TextInput
              style={taskStyles.inputStyle}
              multiline
              placeholder={'Enter your answer here.'}
              placeholderTextColor={'white'}
            />
          </View>
        </View>
        <View style={taskStyles.btnContainer}>
          <TouchableOpacity
            style={taskStyles.borderLessButton}
            onPress={this.saveAnswer}
          >
            <Text style={taskStyles.btnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={taskStyles.borderedButton}
            onPress={this.cancelThisCustomAnswer}
          >
            <Text style={taskStyles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // renderItem = ({ item }) => {
  //   console.log('hello called again');
  //   const questionContent = item;
  //   if (
  //     typeof questionContent == 'string' ||
  //     typeof questionContent == 'undefined'
  //   ) {
      // alert(questionContent); // Network Busy
  //     return;
  //   }

  //   return (
  //     <TouchableOpacity style={taskStyles.dataRow}>
  //       <View style={taskStyles.roundColor} />
  //       <Text style={taskStyles.textAnsColor}>{questionContent.content}</Text>
  //     </TouchableOpacity>
  //   );
  // };

  onGoBack = () => {
    this.props.navigation.navigate({ routeName: 'Chat' });
  };

/*  callApiToCreateShareObject( content1, content2, content3) {
    const { userActions } = this.props;
    var loginUserId = this.props.user._id;
    let arrayParam = { 'user_id': loginUserId, 'content1': content1, 'content2': content2, 'content3': content3 };
    userActions.shareContentRequest({arrayParam});
  }*/
  answerItemRefUncheck(){
    let i = 0;
    while(this.refs['answerItemRef'+i]) {
      this.refs['answerItemRef'+i].uncheckByRef();
      i++;
    }
  }

  answerItemClick(questionOne, questionContent) {
    this.illuminateTask.content.push({content1: questionOne.content1, content2: questionContent.content});
    }

  saveIlluminate() {
    if(this.illuminateTask.content && this.illuminateTask.content.length > 0) {
      const response =  instance.post('/saveIlluminate', this.illuminateTask.content);
      console.log(response);
    }
  }

  render() {
    const {
      dummyText,
      isVisible,
      questionContentArray,
      currentQuestionIndex
    } = this.state;
    const questionOne = questionContentArray[currentQuestionIndex];
    if (questionOne && questionOne.content2 == null || questionOne && questionOne.content2.length <= 0) {
      // Show Alert here , No answers avaiable
      //alert(ILLUMINATE_STRINGS.eMNoAnswersNotAvailable);
    }

    return (
      <View style={taskStyles.taskContainer}>
        {/* Part 1 : Questions */}
        <ImageBackground
          source={require('src/images/backpurple.png')}
          style={taskStyles.questionContainer}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              height: 30,
              marginTop: 20
            }}
          >
            <TouchableOpacity onPress={this.onGoBack}>
              <IconIonicon
                style={{ marginLeft: 20 }}
                name={'ios-arrow-back'}
                size={30}
                color={'white'}
              />
            </TouchableOpacity>
            <Text style={taskStyles.titleText}>{dummyText}</Text>
          </View>
          <Text style={taskStyles.questionText}>{questionOne.content1 }</Text>
        </ImageBackground>

        {/* Part 2 , Answers  */}
        <View style={taskStyles.ansContainer}>
          {isVisible && (
            <View
              style={{
                flex: 1
              }}c
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  height: 56,
                  alignItems: 'center'
                }}
              >
                <View style={[taskStyles.roundColor, { marginLeft: 26 }]} />
                {/* <View style={{ paddingLeft: 10 }}> */}
                <View style={taskStyles.ansInputTextContainer}>
                  <TextInput
                    style={taskStyles.textInput}
                    onFocus={this.onTextInputFocus}
                    placeholder={ILLUMINATE_STRINGS.placeHolderEnterAnswer}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                  />
                </View>
              </TouchableOpacity>
              <ScrollView>
                {questionOne.content2 && questionOne.content2.map((questionContent, index)=> {
                  return <AnswerItem ref={"answerItemRef"+index} itemClick={(selected)=>{
                    console.log("questionContent" + selected);
                    selected && this.answerItemClick(questionOne, questionContent);
                    this.answerItemRefUncheck();
                  }} questionContent={questionContent} showShareModal={() => {
                    this.setState({ showShareModal: !this.state.showShareModal })
                    this.setState({ strAnswer:  questionContent.content})
                  }}/>
                })}
              </ScrollView>
            <Modal
              style={taskStyles.modalView}
              isVisible={this.state.showShareModal}
              animationInTiming={1000}
              animationType={"slide"}
              //onRequestClose={() => this.setState({showShareModal: !this.state.showShareModal})}
              onBackdropPress={() => {
                if(this.state.keyboardOpen) {
                  Keyboard.dismiss();
                } else {
                  this.setState({showShareModal: !this.state.showShareModal})
                }
              }}
              //onSwipeComplete={() => this.setState({showShareModal: !this.state.showShareModal})}
            >
              <View style={{ width: '100%', marginTop: 36, flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/Comment.png')}/>
                <Text style={taskStyles.headingText}>
                  What is Critical Thinking And how is it used today?
                </Text>
              </View>
              <View style={{width: '100%', height: 1, backgroundColor: '#9a9a9a', marginTop: 17, marginBottom: 38}} />
              <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1.0 }} style={{ backgroundColor: '#fff'}}>
                <View style={taskStyles.rectangle} onTouchStart={()=>this.refs.AnsTextInput.focus()}>
                  <Image style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} source={this.state.rectangleBGImages[this.state.selecetedRectangle]} />
                  <TextInput style={taskStyles.inputText}
                    ref='AnsTextInput'
                    onChangeText ={(text) => this.setState({userThoughts: text}) }
                    placeholder='Share a thought or question?'
                    multiline={true}
                  />
                </View>
              </ViewShot>
              {(this.state.isNeedsToVisibleComponent == true ?
                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                      {
                        this.state.rectangleImages.map((image, index) => {
                          return(
                            <TouchableOpacity onPress={() => this.setState({selecetedRectangle: index})}>
                              <Image style={{width: 30, height: 30, resizeMode: 'contain'}} source={image} />
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  : null)}
              <View style={{flexDirection:'row', marginTop: 30, alignItems: 'center'}}>
                <Text style={{fontSize: 14, marginRight: 8}}>Reference</Text>
                <AntDesign name='questioncircleo' size={12} color='rgba(0,0,0,0.5)' />
              </View>
              <View style={taskStyles.answerView}>
                <Image style={{ width: 30, height: 30, marginHorizontal: 10 }} source={require('../../assets/images/Comment.png')}/>
                <ScrollView style={{marginVertical: 5}}>
                  <Text style={taskStyles.answerText}>
                    {this.state.strAnswer}
                  </Text>
                </ScrollView>
              </View>
              <TouchableOpacity style={taskStyles.shareBtn}
                onPress={() =>{
                  this.captureScreenShot();
//                  this.callApiToCreateShareObject(this.state.userThoughts,questionOne.content1, this.state.strAnswer)
                  this.setState({ showShareModal: !this.state.showShareModal })
                }
                }>
                <Text style={taskStyles.shareBtnText}>SUBMIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', top: 10, right: 10}} onPress={() => this.setState({showShareModal: false})}>
                <AntDesign name='closecircle' size={20} color='#FF4763' />
              </TouchableOpacity>
            </Modal>

              {/* <FlatList
                renderItem={this.renderItem}
                data={questionOne.content2}
                initialNumToRender={100}
                keyExtractor={(item, index) => {
                  return item + index;
                }}
              /> */}
            </View>
          )}

          {!isVisible && this.renderTextInput()}
        </View>

        {/* Part 3, Footer  */}
        {isVisible && (
          <View style={taskStyles.footerContainer}>
            <Button
              bordered
              style={[
                taskStyles.bottomBtn,
                this.state.selectedBottomBtnIndex === 1
                  ? taskStyles.bottomBtnSelected
                  : taskStyles.bottomBtnUnSelected
              ]}
              onPress={() => {
                this.onFooterButtonClick(ILLUMINATE_STRINGS.btnTextDontCare);
              }}
            >
              <Text uppercase={false} style={taskStyles.bottomBtnText}>
                {ILLUMINATE_STRINGS.btnTextDontCare}
              </Text>
            </Button>
            <Button
              bordered
              style={[
                taskStyles.bottomBtn,
                this.state.selectedBottomBtnIndex === 2
                  ? taskStyles.bottomBtnSelected
                  : taskStyles.bottomBtnUnSelected
              ]}
              onPress={() => {
                this.onFooterButtonClick(ILLUMINATE_STRINGS.btnTextNutral);
              }}
            >
              <Text uppercase={false} style={taskStyles.bottomBtnText}>
                {ILLUMINATE_STRINGS.btnTextNutral}
              </Text>
            </Button>
            <Button
              bordered
              style={[
                taskStyles.bottomBtn,
                this.state.selectedBottomBtnIndex === 3
                  ? taskStyles.bottomBtnSelected
                  : taskStyles.bottomBtnUnSelected
              ]}
              onPress={() => {
                this.onFooterButtonClick(ILLUMINATE_STRINGS.btnTextLikeThis);
              }}
            >
              <Text uppercase={false} style={taskStyles.bottomBtnText}>
                {ILLUMINATE_STRINGS.btnTextLikeThis}
              </Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}

const taskStyles = StyleSheet.create({
  taskContainer: {
    flex: 1,
    backgroundColor: 'rgba(68,0,104,1.0)'
  },
  questionContainer: {
    flex: 3
  },
  roundColor: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FF4763'
  },
  roundColor1: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'yellow'
  },
  ansContainer: {
    flex: 6,
    backgroundColor: 'rgba(68,0,104,1.0)'
  },
  titleText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    paddingRight: 10
  },
  questionText: {
    marginTop: Platform.OS === 'ios' ? 25 : 18,
    color: 'white',
    fontSize: Platform.OS === 'ios' ? 25 : 22,
    fontWeight: '500',
    fontFamily: 'SF UI Display',
    marginLeft: 40,
    marginRight: 40
  },
  flatListContainer: {
    flex: 1
  },
  dataRow: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 26,
    marginRight: 26,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderColor: '#FF4763',
    flexDirection: 'row'
  },

  /* Ans TextView  */
  ansInputTextContainer: {
    marginLeft: 8,
    marginRight: 26,
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF4763',
    height: 40
  },
  textInput: {
    color: 'white'
  },
  textAnsColor: {
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'SF UI Display',
    marginLeft: 8,
    marginRight: 18,
    marginBottom: 10
  },
  customInputContainer: {
    margin: 40,
    borderColor: '#FF4763',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(68,0,104,1.0)',
    justifyContent: 'flex-start'
  },
  inputStyle: {
    height: Platform.OS === 'ios' ? 160 : 130,
    color: 'white'
  },
  borderLessButton: {
    borderWidth: 1,
    borderColor: '#FF4763',
    height: 45,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  borderedButton: {
    borderColor: '#FF4763',
    height: 45,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  btnText: { color: 'white' },
  btnContainer: {
    paddingHorizontal: 80,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  /* Footer  */
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginLeft: 26,
    marginRight: 26
  },
  bottomBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#FF4763',
    height: 40,
    width: 100,
    marginRight: 10
  },
  bottomBtnUnSelected: {
    backgroundColor: 'transparent'
  },
  bottomBtnSelected: {
    backgroundColor: '#FF4763'
  },
  bottomBtnText: {
    color: 'white',
    fontSize: 14
  },
  modalView: {
    backgroundColor: '#fff',
    // width: '80%',
    display: 'flex' ,
    // flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 24,
    // alignSelf: 'center'
  },
  headingText: {
    width: 205,
    // height: 68,
    marginLeft: 12,
    // top: 150,
    fontFamily: 'SF UI Display',
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    lineHeight: 18,
    textAlign: 'center'
  },

  inputView: {
    height: '20%',
    marginHorizontal: 20 ,
    // marginTop: 10,
    display:'flex',
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  rectangle: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: '#fff'
  },
  inputText: {
    paddingHorizontal: 14,
    fontFamily: 'SF UI Display',
    lineHeight: 18,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    textAlignVertical: 'center',
  },
  questionView: {
    position: 'absolute',
    // height: '10%',
    width: 252,
    backgroundColor: 'red',
    height: 68,
    left: 47,
    top: 347,
    borderTopWidth: 2,
    marginHorizontal: 20,
    borderTopColor: 'red',
    alignItems: 'center' ,
    // marginVertical: 10,
    display:'flex',
    flexDirection: 'row',
    paddingTop: 20
  },

  modalQuestionText: {
    position: 'absolute',
    fontFamily: 'SF UI Display',
    width: '75%',
    // height: 68,
    left: 47,
    top: 300,
    textAlign: 'center',
    display:'flex',
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: 'red',
    paddingTop: 20,
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  answerView: {
    height: 72,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    marginTop: 10
  },
  answerText: {
    // position: 'absolute',
    // width: 243,
    // height: 94,
    // left: 10,
    // top: 420,
    fontFamily: 'SF UI Display',
    // textAlign: 'center',
    // paddingTop: 10,
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    fontWeight: '600'
  },

  shareBtn: {
    marginBottom: 40,
    marginTop: 30,
    height: 39,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#FF4763',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14
  }
});
