import React, { Component } from 'react';
import * as axios from 'axios';
//import Video from 'react-native-video'
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
  Alert,
  Animated,
  Easing,
  ImageBackground,
  WebView
  //f<Modal
} from 'react-native';
import { Button, Text, ListItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import _ from 'lodash';
import moment from "moment";
import SocketIOClient from 'socket.io-client';
import { MAIN_COLOR, QUESTION_IMAGE_BASE_URL, PLACEHOLDER_COLOR, } from '../constants';
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
import styles from '../stylesheets/decodeViewStyle';
import MixPanel from "react-native-mixpanel";
import Modal from "react-native-modal";
import { Client } from 'bugsnag-react-native';
import { BUGSNAG_KEY } from "../config";
import { getGroupUserDetails } from "../utils/common";
const bugsnag = new Client(BUGSNAG_KEY);


const { width } = Dimensions.get('window'); //full width

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

const ViewModes = ['initial', 'video', 'review']


const RadioIcon = (props) => {
  const { checked } = props
  return (
    <View style={{ width: 28, height: 28, borderWidth: 1.5, borderColor: '#FF4763', borderStyle: 'solid', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
      {checked ? <View style={{ width: 12, height: 12, backgroundColor: '#FF4763', borderRadius: 6, borderWidth: 1.5, borderColor: '#FF4763', borderStyle: 'solid' }} /> : null}
    </View>
  )
}

export default class DecodeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: ViewModes[0],
      initialStoryTitle: "The futureof work?",
      initialStoryDescription: "The robot take over is Already Here!",
      reviewIndex: 0,
      task: this.props.navigation.state.params.group,
      reviewQuestions: this.filterQuestions(this.props.navigation.state.params.group._userStory),
      countDownTime: 0,
      currentAnswerId: 0,
      storyHeightAnim: new Animated.Value(72),
      questionHeightAnim: new Animated.Value(28),
      videoFlexAnim: new Animated.Value(0),
      questionWrapperHeightAnim: new Animated.Value(1),
      storyOpacityAnim: new Animated.Value(1),
      questionWrapperOpacityAnim: new Animated.Value(1)

    }

    console.log(this.state);
  }

  filterQuestions = (taskDetail) => {
    const requiredSkill = taskDetail.skill;
    const listOfQuestions = this.props.world.questions.listQuestion;
    const listOfMatchedSkilledQuestions = listOfQuestions.filter((item) => {
      return item.roadmapSkill == requiredSkill && item.description != "" /*the description holds the link to the video.
      Therefore only questions with a value in this field should be returned */
    }).map((item) => {
      return item;
    })
    return this.generateContentArray(listOfMatchedSkilledQuestions, listOfMatchedSkilledQuestions.length);
  }

  generateContentArray = (array, pickCount) => {
    // Genaration Of Content Array
    var contentArray = new Array();
    for (i = 0; i < pickCount; i++) {
      question = array[i];
      console.log(question);
      const content = {
        content1: question.question,
        content2: question.conditions,
        content3: question.answers,
        content4: question.correctAnswers,
        media: question.description
      }
      contentArray.push(content);
    }
    console.log(contentArray);
    return contentArray;
  }


  changeViewMode = (viewMode) => {
    switch (viewMode) {
      case "initial": {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(
              this.state.storyHeightAnim,
              { toValue: 72, duration: 800, ease: Easing.cubic }
            ),
            Animated.timing(
              this.state.questionHeightAnim,
              { toValue: 28, duration: 800, ease: Easing.cubic }
            ),
            Animated.timing(
              this.state.videoFlexAnim,
              { toValue: 0, duration: 800, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperHeightAnim,
              { toValue: 1, duration: 600, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.storyOpacityAnim,
              { toValue: 0, duration: 0, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperOpacityAnim,
              { toValue: 0, duration: 0, ease: Easing.quad }
            )
          ]),
          Animated.parallel([
            Animated.timing(
              this.state.storyOpacityAnim,
              { toValue: 1, duration: 400, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperOpacityAnim,
              { toValue: 1, duration: 400, ease: Easing.quad }
            )
          ])
        ]).start();
        this.setState({
          viewMode: ViewModes[0]
        })

        break;
      }
      case "video": {

        Animated.parallel([
          Animated.timing(
            this.state.storyHeightAnim,
            { toValue: 0, duration: 800, ease: Easing.cubic }
          ),
          Animated.timing(
            this.state.videoFlexAnim,
            { toValue: 1, duration: 800, ease: Easing.quad }
          ),
          Animated.timing(
            this.state.questionWrapperHeightAnim,
            { toValue: 0, duration: 800, ease: Easing.quad }
          )
        ]).start();

        this.setState({
          viewMode: ViewModes[1]
        })
        this.startcountDown();
        break;
      }
      case "review": {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(
              this.state.storyOpacityAnim,
              { toValue: 0, duration: 0, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperOpacityAnim,
              { toValue: 0, duration: 0, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.storyHeightAnim,
              { toValue: 28, duration: 800, ease: Easing.cubic }
            ),
            Animated.timing(
              this.state.questionHeightAnim,
              { toValue: 72, duration: 800, ease: Easing.cubic }
            ),
            Animated.timing(
              this.state.videoFlexAnim,
              { toValue: 0, duration: 800, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperHeightAnim,
              { toValue: 1, duration: 800, ease: Easing.quad }
            )
          ]),
          Animated.parallel([
            Animated.timing(
              this.state.storyOpacityAnim,
              { toValue: 1, duration: 400, ease: Easing.quad }
            ),
            Animated.timing(
              this.state.questionWrapperOpacityAnim,
              { toValue: 1, duration: 400, ease: Easing.quad }
            )
          ])
        ]).start();

        this.setState({
          viewMode: ViewModes[2]
        })
        break;
      }
    }
  }

  changeAnswer = (answerId) => {
    this.state.reviewQuestions[this.state.reviewIndex].content4 = [];
    this.state.reviewQuestions[this.state.reviewIndex].content4.push(this.state.reviewQuestions[this.state.reviewIndex].content3[answerId]);
    this.setState({
      currentAnswerId: answerId,
      reviewQuestions: this.state.reviewQuestions
    })
  }

  startcountDown = () => {
    let currentActiveIndex = parseInt(this.state.reviewIndex);
    console.log("Timer Rev Index", currentActiveIndex);
    let timeout = parseInt(this.state.reviewQuestions[currentActiveIndex].content2);
    if (currentActiveIndex > 0 && currentActiveIndex < this.state.reviewQuestions.length) {
      if (this.state.reviewQuestions[currentActiveIndex].media == this.state.reviewQuestions[currentActiveIndex - 1].media) {
        timeout = parseInt(this.state.reviewQuestions[currentActiveIndex].content2) - this.state.reviewQuestions[currentActiveIndex - 1].media;
      }
    }
    this.interval = setTimeout(() => {
      this.changeViewMode(ViewModes[2]);
    }, timeout * 1000);
  }

  selectAnswer = () => {
    let updatedReviewIndex = this.state.reviewIndex;
    if (updatedReviewIndex < this.state.reviewQuestions.length - 1) {
      updatedReviewIndex++;
      this.setState({
        reviewIndex: updatedReviewIndex,
        reviewQuestions: this.state.reviewQuestions
      })
      this.startcountDown();
    }
    this.changeViewMode(ViewModes[1]);
  }

  render() {
    const {
      viewMode, initialStoryTitle, currentAnswerId, initialStoryDescription, reviewQuestions, reviewIndex, storyHeightAnim, videoFlexAnim,
      questionWrapperHeightAnim, questionHeightAnim,
      storyOpacityAnim, questionWrapperOpacityAnim
    } = this.state;
    console.log("Render", reviewIndex);
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={styles.container}>
          <Animated.View style={[styles.storyLayer, { flex: storyHeightAnim }]}>
            <ImageBackground source={viewMode === ViewModes[2] && require('../images/gradient.png')} style={[styles.storyLayer, { width: '100%', height: '100%' }]}>
              <Animated.View style={[styles.storyLayerWrapper, { opacity: questionWrapperOpacityAnim, flex: 1 }]}>
                {viewMode === ViewModes[2]
                  ? (
                    <View>
                      <Text style={[styles.storyText, { fontSize: 26, lineHeight: 31 }]}>{reviewQuestions[reviewIndex].content1}</Text>
                    </View>
                  )
                  : viewMode === ViewModes[0]
                    ? (
                      <View>
                        <Text style={styles.storyText}>{initialStoryTitle}</Text>
                        {/* <Text style={styles.storyText}>{initialStoryDescription}</Text> */}
                      </View>
                    )
                    : null
                }
              </Animated.View>
            </ImageBackground>
          </Animated.View>

          <Animated.View style={[styles.playButton, { display: viewMode === ViewModes[0] ? 'flex' : 'none', opacity: storyOpacityAnim }]}>
            <TouchableOpacity
              onPress={() => this.changeViewMode(ViewModes[1])}
              style={viewMode === ViewModes[0] ? null : { display: 'none' }}
            >
              <Icon name='play' size={24} style={styles.playButtonIcon} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.questionLayer, { flex: questionHeightAnim }]}>
            <Animated.View style={[styles.videoLayer, { flex: videoFlexAnim }]}>
              {viewMode === ViewModes[1] &&
                <WebView
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{ uri: reviewQuestions[reviewIndex].media }}
                />
              }
            </Animated.View>


            <Animated.View style={[styles.questionLayerWrapper, { flex: questionWrapperHeightAnim }]}>
              <ImageBackground source={viewMode === ViewModes[0] && require('../images/gradient.png')} style={[styles.storyLayer, { width: '100%', height: '100%' }]}>
                <Animated.View style={[styles.questionLayerContent, { opacity: questionWrapperOpacityAnim, flex: 1 }]}>
                  {viewMode === ViewModes[0]
                    ? (
                      <View>
                        <Text style={styles.questionTitleText}>{initialStoryDescription}</Text>
                      </View>
                    )
                    : viewMode === ViewModes[2]
                      ? (
                        <View>
                          {reviewQuestions[reviewIndex] && reviewQuestions[reviewIndex].content3.map((answer, index) => {
                            return (
                              <TouchableOpacity style={styles.answerListItem} key={answer.id} onPress={() => this.changeAnswer(index)}>
                                <View style={{ marginRight: 20 }}>
                                  <RadioIcon checked={currentAnswerId === index} />
                                </View>
                                <View>
                                  <Text style={styles.answerText}>{answer}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })}
                          <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.buttonOutline}>
                              <Text style={styles.buttonText}>Don't know</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonOutline}>
                              <Text style={styles.buttonText}>Not sure</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.selectAnswer()} style={styles.button}>
                              <Text style={styles.buttonText}>Sure</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                      : null
                  }
                </Animated.View>
              </ImageBackground>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    )
  }
}
