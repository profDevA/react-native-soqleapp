import { Dimensions, Platform, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0
const fontFamilyName = Platform.OS === 'ios' ? 'SFUIDisplay-Regular' : 'SF-UI-Display-Regular'
const width = Dimensions.get('window').width // full width
const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: '#FcFcFc',
    flex: 1
  },
  header: {
    height: hp('8%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width
  },
  member1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5
  },
  groupMember: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -5,
    marginRight: -5
  },
  headerIcon: {
    width: wp('8%'),
    height: hp('4%')
  },
  headerFontIcon: {
    fontSize: wp('9%'),
    color: '#A1A1A1'
  },
  storyContainerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('4%'),
    height: hp('82%')
  },
  storyContainer: {
    width: wp('90%'),
    height: hp('60%')
  },
  textImageContainer: {
    height: hp('60%')
  },
  challengeContainer: {
    backgroundColor: '#7D0080',
    width: wp('90%'),
    height: hp('100%')
  },
  storyItemImage: {
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%',
    height: hp('35%')
  },
  storyItemImageMin: {
    alignSelf: 'center',
    width: '100%',
    height: hp('20%')
  },
  storyItemVideo: {
    alignSelf: 'center',
    width: '100%',
    height: hp('25%')
  },
  storyTagImage: {
    height: 25,
    width: 25,
    resizeMode:'contain'
  },
  storyTagImageContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  imageContainer:{
    flexDirection:'row', 
    marginLeft:wp('5%'),
    marginTop:hp('2%')
    },
  storyContent: {
    position: 'relative',
    zIndex: -1,
    backgroundColor: '#56478C',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    height: hp('35%')
  },
  storyContentExpanded: {
    height: hp('50%')
  },
  challengeItemTitle: {
    color: '#fff',
    fontSize: wp('4.8%'),
    fontWeight: '500'
  },
  storyItemTitle: {
    width: wp('60%'),
    marginBottom: hp('2%'),
    fontFamily: 'SF UI Display',
    fontSize: 17,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  goButtonContainer: {
    alignItems: 'flex-end',
    position: 'relative'
  },
  goButton: {
    position: 'absolute',
    marginTop: hp('-6.5%')
  },
  goButonImage: {
    height: 100,
    width: 100
  },
  titleText:{
    color:'white',
    marginLeft:wp('6%'),
    fontFamily:'Gilroy-Bold',
    fontSize:wp('8%'),
    bottom:hp('7.5%'),
    // fontWeight:'bold'
   },
  storyItemText: {
    fontSize: 15,
    textAlign: 'justify',
    color: '#ccc8dc',
    letterSpacing: -0.32
  },
  storyHeaderStyle: {
    fontFamily: fontFamilyName,
    fontSize: 20,
    textAlign: 'center',
    color: '#3C1364'
  },
  challengeItemText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: wp('4%'),
    minHeight: 70,
    paddingTop: 2
  },
  dateTimeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: wp('4%'),
    paddingTop: 2
  },
  calendarIconWrapper: {
    marginRight: 10,
    justifyContent: 'center'
  },
  startTimeText: {
    color: 'white',
    paddingTop: 4
  },
  calendarIcon: {
    fontSize: 25
  },
  storySequence: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center'
  },
  sequenceText: {
    position: 'relative',
    zIndex: 15,
    fontSize: 15,
    color: 'white',
    marginTop: '2%',
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  storyTagContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: '-21%',
    flexDirection: 'row'
  },
  storyTag: {
    color: '#3C1464',
    paddingVertical: wp('2%'),
    paddingHorizontal: 10,
    fontSize: 11,
    marginBottom: hp('1%'),
    fontWeight: '700',
    borderRadius: 15,
    overflow: 'hidden'
  },
  objectiveTag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    marginRight: 4
  },
  quotaTag: {
    fontSize: hp('1.6%'),
    fontFamily:'Gilroy-Medium',
    color:'#3C1464',
    marginLeft:hp('1%'),
    textAlign: 'center'
  },
  rewardTag: {
    fontSize: 12,
    marginRight: 0,
    textAlign: 'center'
  },
  storyActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: hp('3%')
  },
  storyActionBlock: {
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10
  },
  storyActionIcon: {
    width: wp('7%'),
    height: hp('3.5%')
  },
  footer: {
    backgroundColor: '#FCFCFC',
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footerTab: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%')
  },
  footerTabIcon: {
    marginTop: 2,
    height: 22,
    width: 22,
    alignSelf: 'center'
  },
  footerTabText: {
    textAlign: 'center',
    color: '#979797',
    paddingTop: hp('1%'),
    fontSize: 10,
    fontFamily: fontFamilyName
  },
  likeModalView: {
    height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25
  },
  modalContent: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    // padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  likeModalInnerView: {
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5
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
    textAlign: 'center'
  },
  likeModalArrowHolder:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeModalArrow: {
    width: 30,
    height: 30,
  },
  likeModalSeparator: {
    fontSize: 17,
    height: 20,
    color: 'rgba(0, 0, 0, 0.6)',
//    paddingVertical: 10,
    textAlign: 'center',
  },
  likeModalAction: {
    backgroundColor: '#2C2649',
    color: '#ffffff',
    fontSize: 17,
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 25,
    borderRadius: Platform.OS === 'ios' ? 18 : 25,
    alignSelf: 'center'

  },
  likeModalClose: {
    position: 'absolute',
    padding: 10,
    right: 5,
    top: 0
  },
  likeModalCloseIcon: {
    color: '#333333',
    fontSize: 20
  },
  taskItem: {
    backgroundColor: '#2C2549',
    padding: 10,
    borderRadius: 5,
    marginVertical: 6
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginRight: 2
    // backgroundColor:'green',
  },
  taskItemName: {
    marginLeft: 0,
    fontSize: 13,
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10,
    // width: '60%',
    fontFamily: fontFamilyName
    // backgroundColor:'red'
  },
  taskItemSize: {
    color: '#1FBEB8',
    fontSize: 15,
    fontFamily: fontFamilyName,
    right: 6
  },
  taskItemFooter: {
    // marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // backgroundColor:'yellow',
  },
  taskItemExpiry: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14
  },
  taskItemXP: {
    color: 'rgba(255, 255, 255, 0.5)', // '#FFFFFF',
    fontSize: 13,
    marginTop: 10,
    // right:5,
    marginLeft: 5,
    fontFamily: fontFamilyName
  },
  showOrLess: {
    color: '#ffffff'
  },
  faceButton: {
    alignSelf: 'center'
  },
  viewShowMember: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10

  },
  plusMemberView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#9600A1',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  plusTxt: {
    color: '#DADADA', // '#9600A1',
    fontSize: 14,
    fontFamily: fontFamilyName
  },
  modalTitleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  myGroupsBtn: {
    position: 'absolute',
    right: 15,
    paddingLeft: 15,
    paddingBottom: 5
  },
  myGroups: {
    color: '#1FBFBF',
    fontSize: 16,
    fontFamily: fontFamilyName,
    right: 5,
    bottom: -2
  },
  headerqrscan:{
    width: wp('7%'),
    height: hp('3%'),
    right: 8
  },
  joinButtonText:{
    fontSize: hp('1.4%'), 
    color: 'white', 
    fontFamily: 'Gilroy-Bold', 
    marginTop: hp('0.5%') 
  },
  teamLengthText:{
    fontSize: hp('1.5%'), 
    color: '#3C1464', 
    fontFamily: 'Gilroy-Bold', 
    marginLeft: 4, 
    marginTop: hp('0.6%')
  },
  joinModalDesText:{
    paddingRight: 5, 
    fontSize: hp('1.7%'),
    color: '#333333', 
    fontFamily: 'Gilroy-Regular', 
    marginTop: hp('1.5%')
  },
  joimModalTitle:{
    fontSize: hp('2.5%'), 
    color: '#333333', 
    fontFamily: 'Gilroy-Bold', 
    marginTop: hp('4%') 
  },
  joinModalCloseIcon:{
    height: 25, 
    width: 45,
    zIndex:9999, 
    right: hp('1.5%'),
    position:'absolute',
    top:hp('1%')
  },
  joinModalMainView:{
    width: '58%', 
    alignSelf: 'center', 
    alignItems: "center", 
    backgroundColor: 'white', 
    borderRadius: 10 
  }
})

export default styles
