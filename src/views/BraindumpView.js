import * as axios from 'axios';

import { ADD_BRAINDUMP, CHAT_SOCKET_URL, UPDATE_USER_TASK_GROUP_API_PATH, UPLOAD_BRAINDUMP_IMAGE } from '../endpoints';
import { API_BASE_URL, BUGSNAG_KEY } from '../config';
import { Animated, Image, ImageBackground, Keyboard, PanResponder, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {EVENT_BRAINDUMP_COMPLETE, EVENT_USERSTORY_PROGRESS} from '../../src/constants';
import React, { Component } from 'react';
import { addNewMessage, createTask, createUpdateGroup, createUpdateUserStory, getGroup } from "../realm/RealmHelper";
import { flashMessage, resizeImg, trackMixpanel, trackError } from '../utils/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BaseComponent from "./BaseComponent";
import {Client} from 'bugsnag-react-native';
import ColorPalette from '../components/ColorPalette';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import MixPanel from 'react-native-mixpanel';
import Permissions from 'react-native-permissions';
import SocketIOClient from 'socket.io-client';
import VerticalSlider from '../components/Slider';
import { captureScreen } from 'react-native-view-shot';
import {checkProgressStory} from '../utils/grouputil';
import { getSocket } from "../utils/socket";
import {getuuid} from '../utils/common';
import styles from '../stylesheets/braindumpViewStyle';

import ImageOrVideo from "../components/ImageOrVideo"
import I18n from '../utils/localize'
const bugsnag = new Client(BUGSNAG_KEY);

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const TITLE_CONTENT_SIZE_DIFFERENCE = 18;
const CONTENT_SIZE = 18;
const SLIDE_VALUE_MIN = 12;
const SLIDER_VALUE_MAX = 30;
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});
let braindumpTask = null;

export default class BraindumpView extends BaseComponent {

  constructor(props) {
    super(props);
    // const {
    //   navigation: { state: { params: { group } = {} } = {} } = {},
    //   navigation: { state: { params: { user } = {} } = {} } = {},
    //   navigation: { state: { params: { isFromChatView } = {} } = {} } = {}
    // } = props;
    this.state = {
      pan: new Animated.ValueXY(),
      sliderHeight: 0,
      sliderWidth: 0,
      inputEditable: false,
      enableDrag: false,
      selectedImage:{},
      showStoryView: this.props.navigation.getParam('showStoryView', true),
      isToOpenCamera: this.props.navigation.getParam('isToOpenCamera', false),
      group: this.props.navigation.getParam('group', {}),
      user: this.props.navigation.getParam('user', {}),
      isFromChatView: this.props.navigation.getParam('isFromChatView', false),
      // data: this.props.navigation.getParam('data', {}),
      isNeedsToVisibleComponent: true,
      braindump: {
        currentPage: 0,
        pages: [
          {
            image: '',
            content1: '',
            content2: '',
            color: 'transparent',
            contentSize: CONTENT_SIZE
          }
        ]
      },
      typeVideoOrImage: 'image',
      flagFocus: false
    };

    this.titleText = '';
    if (this.state.isFromChatView) {
      let response = this.props.navigation.state.params.data;
      this.cameraResponse(response);
      // this.openCamera();
      // this.setState({ isCameraOpened: true });
    }
    if (this.state.isToOpenCamera) {
      return this.props.navigation.navigate('Camera', {
        group: this.state.group,
        user: this.state.user,
        isFromChatView: false,
        cameraResponse: this.cameraResponse.bind(this)
      });
    }
    this.uploadImage = this.uploadImage.bind(this);
    this.renderTopView = this.renderTopView.bind(this);
  }

  componentWillMount() {
   this.braindumpTask  = createTask();

    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => this.state.enableDrag,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.enableDrag,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.setState({ enableDrag: false });
      }
    });
  }

  renderTopView() {
      return (
          <View style={styles.topViewContainer}>
              <TouchableOpacity
                  onPress={() => {
                      this.props.handleCloseModal()
                  }}
                  style={styles.closeIconContainer}
              >
                  <View>
                      <Icon name='close' size={30} style={styles.closeButton}/>
                  </View>
              </TouchableOpacity>
          </View>
      );
  }

  componentDidMount() {

    super.componentDidMount();
    // Permissions.checkMultiple(['camera','photo','microphone']).then(response => {
    //   if(response != 'authorized')
    //   {
    //     Permissions.request('camera').then(response => {
    //     });
    //     Permissions.request('photo').then(response => {
    //     });
    //     Permissions.request('microphone').then(response => {
    //     });
    //   }
    //   this.setState({photoPermission: response});
    // });
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (this.state.inputEditable) {
          this.setState({ inputEditable: false });
        }
      }
    );
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  captureScreenShot() {
    trackMixpanel('Submitted a Braindump');
    let taskId = this.braindumpTask._taskId;
    this.setState(
      (prevState, props) => ({ isNeedsToVisibleComponent: false }),
      () => {
        captureScreen ({  result: 'tmpfile' })
        .then ( async uri => {
            // let submitURI=await resizeImg(uri,414,896,'JPEG',80);
            // let obj = {  uri:submitURI, fileName: taskId, type: 'image/png' };
            // let result = await this.uploadImage(obj);

            // if (result){
            //   this.initiateBraindump(result.Location);
            // }

            this.setState({ isNeedsToVisibleComponent: true });
            let { braindump: {  pages: [{ content1, content2 }]}, group } = this.state;
            const isMediaType = this.state.selectedImage.type;

            this.props.navigation.navigate("Chat", {
              task_group_id: group._id,
              taskGroup: group,
              mediaType: this.state.selectedImage.type,
              mediaDataURI: this.state.selectedImage.type == 'video' ? this.state.selectedImage.uri : uri,
              msgContent: {
                text: content1,
                image: uri,
                content: content2,
                group: group,
                taskId: taskId
              }
            });
          })
          .catch(error => {
            trackError(error);
            console.log(error);
          });
      }
    );
  }

  initiateBraindump(imageLocation){
    let { braindump: {  pages: [{ content1, content2 }]}, group } = this.state;

    let generateduuid=getuuid();
    addNewMessage(this.state.group, content1, this.state.user._id,this.state.group._team._id, EVENT_BRAINDUMP_COMPLETE, generateduuid, imageLocation );

    getSocket().emit('client:message', {
      msgId: generateduuid, //special id to synch server and client ids
      sender: this.state.user._id,
      receiver: this.state.group._team._id,
      chatType: 'GROUP_MESSAGE',
      type: EVENT_BRAINDUMP_COMPLETE,
      image: imageLocation,
      userProfile: this.state.user,
      time: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      message: content1,
      groupId: this.state.group._id
    })

    this.saveBrainDump({ imageLocation: imageLocation });

    this.props.navigation.navigate("Chat", {
        task_group_id: this.state.group._id,
        taskUpdated: true,
        statusMessage: "SUCCESS",
        taskGroup: this.state.group,
    });

  }

  async uploadImage(photo) {
    let taskId = this.braindumpTask._taskId;
    let result;
    let { braindump: {  pages: [{ content1, content2 }]}, group } = this.state;

    let data = await this.createFormData(photo, { userId: '123', taskId:taskId });
    let path = UPLOAD_BRAINDUMP_IMAGE.replace('{}', taskId);
    await fetch(path, { method: 'POST', body:  data })
      .then(response => response.json())
      .then(response => {
        result = response;
          return result;
      })
      .catch(error => {
        trackError(error);
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

  async saveBrainDump(data) {
    let taskId = this.braindumpTask._taskId;
    let image = data.imageLocation;
    let { braindump: {pages: [{ content1, content2 }]}, group } = this.state;
    let contentObj = { content1, content2, image };


    let shareuuid=getuuid();
    // Share obj to hold array of content obj.
    let share = { content: [contentObj], userId: this.state.user._id, _feid: shareuuid};
    let path = ADD_BRAINDUMP.replace('{}', group._id);

    await instance
      .post(path, { ...share, taskId })
      .then(res => {
       
        let latestGroup = res.data.userTaskGroup;
        latestGroup.messages=this.state.group._team.conversation.messages;
        checkProgressStory(latestGroup);
        const newGroup =  getGroup(group._id)[0]; //somehow it returns an array

       createUpdateGroup(res.data.userTaskGroup);

       /*
       Needed to have the share populated into the this.props.user.shares. THis is used in the export share in the dashboard
       Should just add the share to the state instead - need to synch with login
       */
       this.props.userActions.fetchUserProfile(this.state.user._id);

        return 'Snapshot Uploaded! :)';
      }).catch(err => {
      console.log('BrainDump Err ', err);
      trackError(err);
      return 'Unable to upload your snapshot :(';
    });
  }

  renderResponse(response) {
    if (response.didCancel) {
      // this.props.navigation.pop();
    } else if (response.error) {
      trackError(response.error);
      console.log('ImagePicker Error: ', response.error);
      // this.props.navigation.pop();
    } else {
      const source = { uri: response.uri, type: response.type };
      const { braindump } = this.state;
      braindump.pages[braindump.currentPage].image = response.data;
      // You can also display the image using data:

      this.setState({
        selectedImage: source,
        braindump
      });
    }
  }

  async cameraResponse(response) {
    this.setState({showStoryView:true})
    delete response.data;
    const source = { uri: response.uri, type: response.type };
    const { braindump } = this.state;
    braindump.pages[braindump.currentPage].image = response.data;
    // You can also display the image using data:
    await setTimeout(() => {
        this.setState({
          selectedImage: { uri: response.uri, type: response.type },
          braindump,
          typeVideoOrImage : response.type
        });
    }, 100);
  }

  openCamera() {
    this.setState({ isCameraOpened: true });
    return this.props.navigation.navigate('Camera', {
      group: this.state.group,
      user: this.state.user,
      isFromChatView: false,
      cameraResponse: this.cameraResponse.bind(this)
    });
  }

  openGallery() {
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, response => {
      // Same code as in above section!
      this.renderResponse(response);
    });
  }

  updateText(prop, text) {
    const { braindump } = this.state;
    braindump.pages[0][prop] = text;
    this.setState({ braindump });
  }

  updateTextSize = (size: number) => {
    const { braindump } = this.state;
    const page = braindump.pages[braindump.currentPage];
    page.contentSize = size;
    braindump.pages.splice(braindump.currentPage, 1, page);
    this.setState({ braindump: { ...braindump } });
  };

  updateTextBackground = (color: string) => {
    const { braindump } = this.state;
    const page = braindump.pages[braindump.currentPage];
    page.color = color;
    braindump.pages.splice(braindump.currentPage, 1, page);
    this.setState({ braindump: { ...braindump } });
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
    if (this.state.inputEditable) {
      this.setState({ inputEditable: false });
    }
  };

  showKeyboard = (id: number) => {
    this.setState({ inputEditable: true }, () => {
      if (id == 1) {
        this.titleText.focus();
      } else if (id == 2) {
        this.contentText.focus();
      }
    });
  };

  renderBottom = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: 'rgba(0,0,0,0.2)',
          position: 'absolute',
          bottom: 0,
          width: '100%'
        }}
      >
        <ColorPalette
          onChange={this.updateTextBackground}
          title=""
          titleStyles={{ height: 0, width: 0 }}
          defaultColor={'#FFFFFF'}
          colors={[
            '#534988',
            '#89229B',
            '#E53EEF',
            '#FFFFFF',
            '#59BBB7',
            '#F7C744',
            '#2F7CF6'
          ]}
          icon={<View style={styles.dot} />}
        />
        <View style={styles.topActionView}>
          <TouchableOpacity onPress={() => this.openCamera()}>
            <Image source={require('../../assets/images/camera.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showKeyboard(1)}>
            <Text style={{ color: 'white', fontSize: 24 }}>Aa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openGallery()}>
            <Image source={require('../../assets/images/add_pic.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.submitView}>
          <TouchableOpacity
            onPress={() => {
              this.captureScreenShot();
              //this.props.navigation.pop();
            }}
          >
            <Text style={[styles.likeModalAction, styles.submit]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {

    const { selectedImage: { uri } = {}, braindump,typeVideoOrImage } = this.state;
    const {
      color: backgroundColor,
      contentSize,
      content1,
      content2
    } = braindump.pages[braindump.currentPage];

    const contentStyle = { backgroundColor, fontSize: contentSize };
    const titleStyle = {
      fontSize: contentSize + TITLE_CONTENT_SIZE_DIFFERENCE
    };

    const panStyle = { transform: this.state.pan.getTranslateTransform() };

    return (
      <TouchableWithoutFeedback onPress={this.hideKeyboard} accessible={true}>
         { this.state.showStoryView ?  <ImageOrVideo
           type={typeVideoOrImage}
            style={[
              {
                width: '100%',
                height: '100%'
              },
              { backgroundColor: uri ? '' : 'black' }
            ]}
            source={{ uri: uri ? uri : '' }}
            >
            <View style={{
              position:'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#333',
              opacity: this.state.flagFocus ? 0.7: 0
              }}
            />
          {this.state.isNeedsToVisibleComponent && (
            <View
              style={[
                styles.sliderContainer,
                { height: this.state.inputEditable ? '90%' : '60%' }
              ]}
            >
              <Image
                style={{ width: 17, height: 17, marginBottom: 6 }}
                source={require('../../assets/images/icon-text.png')}
              />
              <VerticalSlider
                style={styles.slider}
                value={contentSize}
                orientation="vertical"
                onValueChange={this.updateTextSize}
                thumbTintColor="#C4C4C4"
                trackStyle={[
                  styles.sliderTrack,
                  { borderBottomWidth: this.state.sliderHeight }
                ]}
                minimumTrackTintColor="transparent"
                inverted
                minimumValue={SLIDE_VALUE_MIN}
                maximumValue={SLIDER_VALUE_MAX}
                step={1}
                onLayout={event => {
                  const { width, height } = event.nativeEvent.layout;
                  this.setState({ sliderHeight: height, sliderWidth: width });
                }}
              />
            </View>
          )}
          <View style={[
            styles.container,
            {
              justifyContent: this.state.flagFocus ? 'flex-start' : 'center',
              marginTop: this.state.flagFocus ? 30 : 0
            }
          ]}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: this.state.sliderWidth + 25,
                width: '100%'
              }}
            >

              <Animated.View
                {...this.panResponder.panHandlers}
                style={[panStyle, { width: '100%' }]}
              >
                {this.state.inputEditable && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onFocus={() => this.setState({flagFocus: true})}
                    onBlur={() => this.setState({flagFocus: false})}
                  >
                    <TextInput
                      onChangeText={text => this.updateText('content1', text)}
                      ref={ref => (this.titleText = ref)}
                      placeholder={I18n.t("storyTitle")}
                      placeholderTextColor={'white'}
                      style={[styles.textInputTitle, titleStyle]}
                      value={content1}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      onSubmitEditing={()=>{Keyboard.dismiss()}}
                      multiline={true}
                    />
                    <TextInput
                      multiline={true}
                      onChangeText={text => this.updateText('content2', text)}
                      placeholder={I18n.t("enterStory")}
                      ref={ref => (this.contentText = ref)}
                      placeholderTextColor={'white'}
                      style={[styles.textInputContent, contentStyle]}
                      value={content2}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      onSubmitEditing={()=>{Keyboard.dismiss()}}
                    />
                  </View>
                )}

                {!this.state.inputEditable && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => this.showKeyboard(1)}
                      onLongPress={e => {
                        this.setState({ enableDrag: true });
                      }}
                    >
                      <Text style={[styles.textInputTitle, titleStyle]}>
                        {content1.trim() == '' ? I18n.t("storyTitle") : content1}
                      </Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => this.showKeyboard(2)}
                      onLongPress={e => {
                        this.setState({ enableDrag: true });
                      }}
                    >
                      <Text style={[styles.textInputContent, contentStyle]}>
                        {content2.trim() == '' ? I18n.t("enterStory") : content2}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                )}

              </Animated.View>

            </View>
            {!this.state.inputEditable &&
              this.state.isNeedsToVisibleComponent &&
              this.renderBottom()}


          </View>
          {this.state.inputEditable && this.state.isNeedsToVisibleComponent && (
            <TouchableOpacity
              onPress={this.hideKeyboard}
              style={styles.tickContainer}
            >
              <Image
                style={styles.tick}
                source={require('../../assets/images/icon-tick.png')}
              />
            </TouchableOpacity>
          )}
        {this.renderTopView()}
          </ImageOrVideo> : <View style={{backgroundColor:"black",flex:1}}></View> }
      </TouchableWithoutFeedback>


    );

  }
}
