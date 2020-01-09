import {Platform, StatusBar, StyleSheet,Dimensions} from 'react-native';

import {MAIN_COLOR} from '../../constants';
const {width} = Dimensions.get('window')

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: statusBarHeight + 5,
        justifyContent: 'center',
        backgroundColor: '#130C38',
        flex: 1
    },
    checkbox: {
        borderWidth: 0,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height :width*.06,
        width : width*0.06
    },
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
        //backgroundColor:'red',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    textForgotpassword: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    margin10: {
        marginTop: 10,
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
    inputWrapper: {
        marginTop: 7
    },
    textInput: {
        color: 'white',
        borderRadius: 5,
    },
    InputPassword :{marginRight:width*.12},
    textInputPwd: {
        color: 'black',
    },
    likeModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    likeModalInnerView: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingVertical: 25,
        paddingHorizontal: 10,
        width: '90%',
        borderRadius: 5,
    },
    itemPwd: {
        marginTop: -15,
        marginBottom: 10,
    },
    likeModalTitle: {
        fontSize: 20,
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    likeModalText: {
        fontSize: 18,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    likeModalSeparator: {
        fontSize: 17,
        color: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 10,
        textAlign: 'center',
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
        backgroundColor: '#2C2649',
        color: '#ffffff',
        fontSize: 17,
        paddingTop: 5,
        paddingBottom: 8,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignSelf: 'center'

    },
    viewModal: {
        backgroundColor: 'rgba(52, 52, 52, 0.001)',
        top: 0,
        bottom: 0,
        left: 10,
        right: 10,
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignSelf: 'center'
    },
    passwordValidation: {
        height: 40,
        top: 10,
        borderRadius: 5,
        backgroundColor: '#FFC600',
    },
    passwordValidationContent: {
        left: 10,
    },
    passwordIconValidation: {
        // marginRight: 16,
        height:width*0.06,
        width:width*0.06,
    },
    passwordIconValidationContainer : {
        height:width*0.10,
        width:width*0.12,
        justifyContent : 'center',
        alignItems : 'center'
    },
    passwordIconValidationEye: {
        height:width*0.04,
        width:width*0.06,
        //  marginRight: 12,
    },
    passwordIconValidationEyeContainer : {
        height:width*0.10,
        width:width*0.12,
        marginRight: 12,
        justifyContent : 'center',
        alignItems : 'center'
    },
    rePasswordIncorrect: {
        color: 'red',
        right: 20,
    },
}); 