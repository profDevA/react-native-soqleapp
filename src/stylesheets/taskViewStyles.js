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
    },
    body: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    question: {
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    questionText: {
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        fontSize: 24
    },
    questionCard: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    helpOption: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0
    },
    answer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 5,
    },
    margin20: {
        marginRight: 20,
    },
    marginBottom20: {
        marginBottom: 20
    },
    answerText: {
        color: 'white',
        borderColor: 'white',
    },
    answerTextChecked: {
        color: '#FFC600',
    },
    answerCheck: {
        backgroundColor: '#FFC600',
        borderColor: '#FFC600',
    },
    imageView: {
        bottom: 50,
        alignItems: 'center',
    },
    image: {
        width: wp('90%'),
        height: 200,
        marginTop: 10,
    },
    imageTick: {
        width: 63,
        height: 63,
    },
    helpModalStyle: {
        marginVertical: 40
    },
    resultModal: {
        flexDirection:'row',
        alignItems: 'baseline',
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin:'10%',
        backgroundColor: '#00C2BA',
        borderRadius:5
    },
    helpModal: {
        alignItems: 'baseline',
        borderRadius:5
    },
    helpModalTitle: {
        fontFamily: 'SF UI Display',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.3
    },
    helpModalSubTitle: {
        fontFamily: 'SF UI Display',
        textAlign: 'center',
        fontSize: 15,
        letterSpacing: 0.3
    },
    helpModalFooterCloseView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    resultModalContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        width:wp('80%'),
        height:wp('90%'),
        color:'#FFFFFF'
    },
    helpModalContent: {
        backgroundColor: '#ceced0',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    stepButton: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        alignSelf:'flex-end',
        marginBottom: 10
    },
    buttonText: {
        color: '#FFC600',
        fontSize: 18
    },
    submitButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    textArea: {
        borderWidth: 2,
        color: 'white',
        fontSize: 20,
        padding: 15,
        borderRadius: 4,
    },
    answerBorder: {
        borderColor: MAIN_COLOR,
    },
    placeholderBorder:{
        borderColor: PLACEHOLDER_COLOR,
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
    helpItem: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        borderColor: '#2C2649',
        borderWidth: 2
    },
    helpText: {
        fontFamily: 'SF UI Display',
        fontSize: 17,
        lineHeight: 17 * 1.14,
        color: '#2C2649'
    },
    helpModalCloseButtonText: {
        color: '#000'
    },
    actionBtn: {
        padding: 15,
        alignItems: 'center'
    },
    actionBtnTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    actionBtnTxtDisabled: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7e828a'
    },
    actionPrevNextBtn: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: wp('100%'),
        justifyContent:'space-between',
        padding: 5
    },
    paginationDots: {
        width: 9,
        height: 9,
        backgroundColor: MAIN_COLOR
    },
    storyButtontext:{
        color: '#edf4f4',
        fontSize: 18
    },
    modalButton:{
        alignSelf:'center',
        marginTop:20
    },
    forwardModal:{
        backgroundColor:'#b1bdc4',
        margin:'0%'
    },
    forwardModalContent:{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        width:wp('80%'),
        color:'#FFFFFF'
    },
    forwardQuestionCommentContainer:{
        backgroundColor:'#fff',
        borderRadius:5,
        paddingHorizontal:10,
        paddingVertical:10,
        width:'100%',
        marginTop:10,
    },
    forwardQuestionTextInput:{
        width:'100%',
        paddingVertical:0,
        fontSize:18,
        height:50,
        textAlignVertical: 'top'
    },
    forwardModalTitle:{
        marginBottom:20,
        fontFamily: 'SF UI Display',
        fontWeight: '500',
        fontSize: 25,
    },
    forwardQuestionButtonText:{
        color:'#fff',
    },
    forwardQuestionButton:{
        paddingHorizontal:10,
        paddingVertical:5,
        marginTop:20,
        alignSelf:'center',
        backgroundColor:'#9736a1'
    },
    forwardQuestionTextArea:{
        width:'100%'
    }
});
