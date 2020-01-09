import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {StyleSheet,Dimensions} from 'react-native';

import {MAIN_COLOR} from '../constants';
const {width, height} = Dimensions.get('window')


export default StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: hp('10%'),
        backgroundColor: '#130C38',
        height: height
    },
    content: {
        justifyContent: 'center',
      height: height*.70
    },
    containerContent :{paddingTop: height*.16},
    containerContentStep2:{paddingTop: height*.10}, 
    getTogether: {marginTop: height*.02  },
    inputLabel: {
        color: MAIN_COLOR
    },
    logo: {
        alignSelf: 'center',
    },
    socialLogin: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.3)'
    },
    btnForgotPwd: {
        right: 0,
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    textForgotpassword: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    margin10: {
        marginTop: 20,
    },
    loginButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    textInput: {
        color: 'white'
    },
    textInputPwd: {
        color: 'black',
    },
    helpModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    resultModalContent: {
        flex: 1,
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    helpModalContent: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingVertical: 30,
        paddingHorizontal: 10,
        width: '90%',
        height: '25%',
        borderRadius: 5,
    },
    forgotPwdTitle: {
        textAlign: 'center',
        fontSize: 18
    },
    likeModalClose: {
        position: 'absolute',
        padding: 10,
        right: 5,
        top: 0
    },
    likeModalCloseIcon: {
        color: '#333333',
        fontSize: 20,
    },
    likeModalAction: {
        color: 'rgba(255,255,255,1)'
    },
    stepButton: {
        alignSelf: 'center',
        backgroundColor: MAIN_COLOR,
        marginTop: 5,
    },
    containerLoginWithOtherEmail: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonLoginWithOtherEmail: {
        // right: 0,
        // alignSelf: 'center',
        // marginTop: 5,
    },
    textLoginWithOtherEmail: {
        color: MAIN_COLOR
    },
    iconLeft: {
        color: MAIN_COLOR,
        fontSize: 20
    },
});
