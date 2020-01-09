import React, { Component } from 'react';
import BaseComponent from "./BaseComponent";
import {  View,  Text,  Image, FlatList, ImageBackground,  TextInput,  TouchableOpacity,  PanResponder,  Animated,  Platform,  Keyboard, CameraRoll, TouchableWithoutFeedback } from 'react-native';
import styles from '../stylesheets/cameraViewStyle';
import { RNCamera } from 'react-native-camera';
import Icon from "react-native-vector-icons/FontAwesome";
import ImagePicker from 'react-native-image-picker';
import { BUGSNAG_KEY } from '../config';
import {Client} from 'bugsnag-react-native';
import { trackError} from "../utils/common";

const bugsnag = new Client(BUGSNAG_KEY);
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const VIDEO_QUALITY = RNCamera.Constants.VideoQuality['320p'];

export default class CameraView extends BaseComponent {

  constructor(props) {
    super(props);
    const {
      navigation: { state: { params: { group } = {} } = {} } = {},
      navigation: { state: { params: { user } = {} } = {} } = {},
      navigation: { state: { params: { isToOpenCamera } = {} } = {} } = {}
    } = props;
    this.state = {
      captureType: 'photo',
      group,
      user,
      isToOpenCamera,
      focusedScreen:true,
      isRecording: false,
      flashMode: RNCamera.Constants.FlashMode.off,
      cameraType: RNCamera.Constants.Type.back,
    };
  }

  takePicture = async() => {
    if (this.camera) {
      let data = await this.camera.takePictureAsync({
        quality: 1,
        base64: true,
        pauseAfterCapture: true,
        forceUpOrientation: true,
        fixOrientation: true,
        orientation: "portrait"
      });
      delete data.base64;
      this.props.navigation.goBack();
      data = {...data,type : "image"}

      this.props.navigation.state.params.cameraResponse(data);
    }
  };

  openGallery() {
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, response => {
      // Same code as in above section!
      this.renderResponse(response);
    });
  }

  renderResponse(response) {
    if (response.didCancel) {
      // this.props.navigation.pop();
    } else if (response.error) {
      trackError(response.error);
    } else {

      this.props.navigation.goBack();
      let data = {...response, type : "image"}

      this.props.navigation.state.params.cameraResponse(data);
    }
  }


  recordVideo = async() => {
    if (this.camera) {
      this.setState({ isRecording: true });
      let data = await this.camera.recordAsync({
        quality: RNCamera.Constants.VideoQuality['480p'],
        // videoBitrate: 300*1000,
        videoBitrate: 600*1000,
        // quality: RNCamera.Constants.VideoQuality['4:3'],

        mirrorVideo: true
      }).then((s)=>{
        this.camera.pausePreview()
        data = {...s,type : "video"}
        this.props.navigation.state.params.cameraResponse(data);
        this.props.navigation.goBack();
      });
    }
  }

  stopRecording = async() => {
    if(this.camera) {
      if(this.state.isRecording) {
        this.camera.stopRecording();
        this.setState({
          isRecording: false
        });
      }
    }
  }


  componentDidMount() {
    const { navigation } = this.props;
    super.componentDidMount();
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (this.state.inputEditable) {
          this.setState({ inputEditable: false });
        }
      }
    );
    navigation.addListener('willFocus', () =>
     { this.setState({ focusedScreen: true })}
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  checkCameraFocus = () =>{
    const { focusedScreen } = this.state;
    if(focusedScreen){
      return (this.showCam());
    }else{
      return <View />;
    }
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  showCam=()=>{


    return(
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            skipProcessing={true}
            style={styles.preview}
            type={this.state.cameraType}
            flashMode={this.state.flashMode}
            // captureQuality={'480p'}
            defaultVideoQuality={VIDEO_QUALITY}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>


              <View style={{ position: 'absolute', left: 0, right: 0, top: 0, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={ () => this.setState({ flashMode: this.state.flashMode == RNCamera.Constants.FlashMode.torch ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch }) } style={styles.capture}>
                  <Text style={{ fontSize: 11 }}>{ this.state.flashMode == RNCamera.Constants.FlashMode.off ? 'Flash On' : 'Flash Off' }</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={ this.state.isRecording } onPress={ () => this.setState({ cameraType: this.state.cameraType == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back }) } style={styles.capture}>
                  <Text style={{ fontSize: 11 }}>{ this.state.cameraType == RNCamera.Constants.Type.back ? 'Front' : 'Back' }</Text>
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', left: 20, right: 0, top: 90 }}>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate("Chat")}>
                  <Icon name="angle-left" size={36} color="white"/>
                </TouchableOpacity>
              </View>

              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 20 }}>


                <TouchableOpacity onPress={ this.state.captureType == 'photo' ? this.takePicture.bind(this) : (this.state.isRecording == false ? this.recordVideo.bind(this) : this.stopRecording.bind(this) ) } style={styles.capture}>
                  <Text style={{ fontSize: 14 }}>{ this.state.captureType == 'photo' ? 'SNAP' : (this.state.isRecording == false ? 'RECORD' : 'STOP') }</Text>
                </TouchableOpacity>


                <FlatList
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                ref={ (ref) => this.captureTypeList = ref }
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={["photo", "video"]}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity  onPress={ () => {
                        this.setState({ captureType: this.state.captureType == 'photo' ? 'video' : 'photo' })
                        return this.captureTypeList.scrollToItem({ item });
                      }}>
                      <Text style={{ color: this.state.captureType == item ? '#fff':'#aaa',fontSize:17,padding:6}}>{ item.charAt(0).toUpperCase() + item.slice(1) }</Text>
                    </TouchableOpacity>
                  );
                }} />

              <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 20 }}
               onPress={() => this.openGallery()}>
                <Image source={require('../../assets/images/add_pic.png')} />
              </TouchableOpacity>
              </View>
            </RNCamera>
      </View>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.hideKeyboard} accessible={true}>
        {this.checkCameraFocus()}
      </TouchableWithoutFeedback>
    );
  }
}
