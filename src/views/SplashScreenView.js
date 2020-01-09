import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  ScrollView
} from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
import LoginContainer from '../containers/LoginContainer';
import styles from '../stylesheets/SplashViewStyle.js';
import { API_BASE_URL } from "../config";
import I18n from '../utils/localize'
import {getLanguage} from '../utils/localize'

/*let strings = new LocalizedStrings({
 en:{
   key1title:"Get together, now...",
   key1text:"Digispace enhances community collaboration between friends, trends and brands. It’s real life, made more real.",
   key2title:"Our world, but better - Thank to you",
   key2text:"Plug into our ecosystem for a journey of discovery, rewards and glory. You have a more interesting journey inside of you then you even know.",
   key3title:"Grow yourself and millions around the planet",
   key3text:"Digispace pushes the boundary by creating new ways for you to unlock achievements for intrinsic qualities.",
   key4title:"Seamlessly discover the world around you",
   key4text:"You unlock special in-platform benefits using Soqqle sparks, earned by completing tasks. Everyday is important and meaningful to your goals.",
   footer:"Now is the time to take charge of your life."
 },
 id: {
   key1title:"Berkumpullah, sekarang ...",
   key1text:"Digispace meningkatkan kolaborasi komunitas antara teman, tren, dan merek. Ini kehidupan nyata, dibuat lebih nyata.",
   key2title:"Dunia kita, tetapi lebih baik - Terima kasih",
   key2text:"Hubungkan ke ekosistem kita untuk perjalanan penemuan, penghargaan dan kemuliaan. Anda memiliki perjalanan yang lebih menarik di dalam diri Anda daripada yang Anda tahu.",
   key3title:"Tumbuhkan diri Anda dan jutaan orang di planet ini",
   key3text:"Digispace mendorong batas dengan menciptakan cara baru bagi Anda untuk membuka pencapaian untuk kualitas intrinsik.",
   key4title:"Temukan dunia di sekitar Anda dengan mulus",
   key4text:"Anda membuka manfaat khusus di dalam platform menggunakan bunga api Soqqle, diperoleh dengan menyelesaikan tugas. Setiap hari penting dan bermakna bagi tujuan Anda.",
   footer:"Sekarang adalah waktu untuk mengambil alih hidup Anda."
 }
});*/

const { width, height } = Dimensions.get('window');
const slides = [
  {
    key: '1',
    title: "Get together, now...",
    image: require('../images/SplashScreen_1.png'),
    titleStyle: { textAlign: 'center' },
    textStyle: { textAlign: 'center' },
    text:
      'Digispace enhances community collaboration between friends, trends and brands. It’s real life, made more real. ',
    backgroundColor: 'transparent',
  },
  {
    key: '2',
    title: 'Our world, but better - Thank to you!',
    image: require('../images/SplashScreen_2.png'),
    titleStyle: { textAlign: 'center' },
    textStyle: { textAlign: 'center' },
    text:
      'Plug into our ecosystem for a journey of discovery, rewards and glory. You have a more interesting journey inside of you then you even know.',
    backgroundColor: 'transparent',
  },
  {
    key: '3',
    title: 'Grow yourself and millions around the planet',
    image: require('../images/SplashScreen_3.png'),
    titleStyle: { textAlign: 'center' },
    textStyle: { textAlign: 'center' },
    text:
      'Digispace pushes the boundary by creating new ways for you to unlock achievements for intrinsic qualities.',
    backgroundColor: 'transparent',
  },
  {
    key: '4',
    title: 'Seamlessly discover the world around you',
    image: require('../images/SplashScreen_4.png'),
    titleStyle: { textAlign: 'center' },
    textStyle: { textAlign: 'center' },
    text:
      'You unlock special in-platform benefits using Soqqle sparks, earned by completing tasks. Everyday is important and meaningful to your goals.',
    backgroundColor: 'transparent',
  },
];

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      index: 1,
      skip: true,
      loading: true,
    };
  }

  setSlides = async () => {
      slides[0].title= I18n.t("splashKey1Title");
      slides[0].text = I18n.t("splashKey1text")+ " ["+ getLanguage()+ "]";
      slides[1].title= I18n.t("splashKey2title");
      slides[1].text = I18n.t("splashKey2text");

      slides[2].title= I18n.t("splashKey3title");
      slides[2].text = I18n.t("splashKey3text");

      slides[3].title= I18n.t("splashKey4title");
      slides[3].text = I18n.t("splashKey4text");

  }


  componentDidMount = async () => {
    try {
      console.log("setting language to id")
      this.setSlides();
      console.log("setting language hello translated ", slides[0].title)

      let isAppLoaded = await AsyncStorage.getItem('showRealApp');
      if (isAppLoaded === 'true') {
        this.setState({
          showRealApp: true,
          loading: false
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  _onDone = async () => {
    this.setState({ showRealApp: true });
    await AsyncStorage.setItem('showRealApp', 'true');
  };
  renderSkip = () => {
    return this.state.skip ? (
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 0 }}
        onPress={() => this.onSkip()}
      >
        <Text style={{ color: '#1FBEB8' }}>Skip</Text>
      </TouchableOpacity>
    ) : null;
  };
  onSkip = () => {
    //  let { index } = this.state;
    //index =index+ 1;
    // alert(index)
    this.setState({ skip: false });

    this.AppIntroSlider.goToSlide(3);
  };
  renderDone = () => {
    return (
      <View style={styles.signUp}>
        <Text style={styles.signupText}>I18n.t("signUp")</Text>
      </View>
    );
  };
  _renderItem = props => {
    return (
      <View
        style={[
          styles.mainContent,
          {
            // paddingTop: 120,
            // paddingBottom: 50,
            width: props.width,
            height: props.height,
            paddingHorizontal: 15,
          },
        ]}
      >
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <Image
          source={props.image}
          style={{ width: width, height:height/3+50, alignSelf: 'center',marginVertical:-10}}
          resizeMode="contain"
        />
        <Text style={[styles.text,{ marginTop: props.key !== '4' ? 40 : 10 }]}>{props.text}</Text>
        {props.key === '4' ? (
          <View>
            <TouchableOpacity
              style={styles.signUp}
              onPress={() => this._onDone()}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.textBottom}>
              {I18n.t("splashFooter")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  showSplashAgain=()=>{
    this.setState({
      showRealApp:false,
      skip:true
    })
  }




  render() {
    if (this.state.loading) {
      return <ActivityIndicator />;
    } else {
      if (this.state.showRealApp) {
        return <LoginContainer showSplashAgain={this.showSplashAgain} {...this.props} />;
      } else {
        return (
          <ScrollView style={{flex:1}} contentContainerStyle={{minHeight:height}}>
          <View
            style={[styles.container, { marginTop: StatusBar.currentHeight }]}
          >

            <StatusBar
              backgroundColor="#130C38"
              barStyle={'light-content'}
              hidden={false}
              translucent={true}
            />
            <AppIntroSlider
              slides={slides}
              onDone={this._onDone}
              dotStyle={styles.dotView}
              renderItem={this._renderItem}
              activeDotStyle={styles.activedotView}
              showSkipButton={false}
              showNextButton={false}
              showDoneButton={false}
              buttonStyle={{ textAlign: 'right' }}
              bottomButton
              hidePagination={!this.state.skip}
              ref={ref => (this.AppIntroSlider = ref)}
              onSlideChange={index =>
                index === 3
                  ? this.setState({ skip: false })
                  : this.setState({ skip: true })
              }
            />
            {this.state.skip ? (
              <TouchableOpacity
                style={{ position: 'absolute', top: height*0.04, right: 15 }}
                onPress={() => this.onSkip()}
              >
                <Text style={{ color: '#1FBEB8' }}>{I18n.t("skip")}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          </ScrollView>
        );
      }
    }
  }
}
