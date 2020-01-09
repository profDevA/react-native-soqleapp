import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';

import {MAIN_COLOR, PLACEHOLDER_COLOR} from '../constants';

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default StyleSheet.create({
    wrapper: {
        paddingTop: statusBarHeight,
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        backgroundColor: '#130C38',
    },
    container: {
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        backgroundColor: '#130C38',
        position: 'relative'
    },
    storyText: {
      color: '#FFFFF2',
      fontSize: 36,
      lineHeight: 43,
      fontWeight: 'bold',
      fontFamily: 'SF UI Display'
    },
    storyLayer: {
      flex: 72,
      backgroundColor: "#3C1364",
    },
    storyLayerWrapper: {
      justifyContent: 'center',
      paddingLeft: 48,
      paddingRight: 48
    },
    videoLayer: {
      backgroundColor: "white",
      position: 'relative',
      minHeight: 10,
      flex: 0
    },
    questionLayer: {
      flex: 28,
      backgroundColor: "#0ADB83"
    },
    playButton: {
      backgroundColor: 'transparent',
      position: 'absolute',
      top: (Dimensions.get('window').height * 2 / 3) - 6,
      left: (Dimensions.get('window').width / 2)- 28,
      zIndex: 4
    },
    playButtonIcon: {
      backgroundColor: 'white',
      color: '#2E0D4E',
      borderColor: '#2E0D4E',
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 28,
      textAlign: 'center',
      paddingTop: 16,
      width: 56,
      height: 56
    },
    questionLayerWrapper: {
      display: 'flex',
      flex: 1,
    },
    questionLayerContent: {
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 48,
      paddingRight: 48
    },
    questionTitleText: {
      color: 'white',
      fontSize: 15,
      lineHeight: 18,
      fontFamily: 'SF UI Display'
    },
    buttonGroup: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      flex: 1,
      height: 39,
      marginRight: 8,
      backgroundColor: '#FF4763',
      borderStyle: 'solid',
      borderWidth: 1.5,
      borderRadius: 5,
      borderColor: '#FF4763',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonOutline: {
      flex: 1,
      height: 39,
      borderColor: '#FF4763',
      borderStyle: 'solid',
      borderWidth: 1.5,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    buttonText: {
      fontSize: 10,
      lineHeight: 12,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'SF UI Display'
    },
    answerText: {
      fontFamily: 'SF UI Display',
      color: "#FFFFFF",
      fontSize: 15,
      lineHeight: 18
    },
    answerListItem: {
      flexDirection: 'row',
      marginBottom: 30,
      alignItems: 'flex-start',
      paddingRight: 44
    },
    imageBackground: {
      height: '100%',
      width: '100%'
    }
});
