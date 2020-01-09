import { Dimensions, Platform, StyleSheet } from 'react-native'
import { Right } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const deviceWidth = Dimensions.get('window').width
const { height } = Dimensions.get('window')

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0
const fontFamilyName = Platform.OS === 'ios' ? 'SFUIDisplay-Regular' : 'SF-UI-Display-Regular'

const styles = StyleSheet.create({
  iosKeyBoardAvoid: {
    flex: 0,
    height: (height - 258)
  },
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column'
  },
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0
  },
  headerIconStyle: {
    color: '#FFFFFF'
  },
  headerTitleStyle: {
    color: '#000000'
  },
  modalHeight: { backgroundColor: 'red', height },
  buttonHeight: { backgroundColor: '#1FBEB8', height: 100 },
  headerRightTextStyle: {
    color: '#1FBEB8'
  },
  storyDetailView: {
    paddingVertical: 15,
    paddingTop: 5,
    paddingHorizontal: 0,
    backgroundColor: '#F8F8F8'
  },

  storyDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  storyDetailTitle: {
    fontSize: 18,
    color: '#000000',
    width: '70%',
    fontWeight: '400'
  },
  storyDetailXP: {
    fontSize: 16,
    color: '#9600A1',
    fontWeight: '500'
  },
  storyDetailText: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000'
  },
  storyDetailTagTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: fontFamilyName
  },
  storyDetailTags: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  storyDetailTag: {
    color: '#1FBEB8',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1FBEB8',
    marginRight: 8,
    fontSize: 13,
    fontFamily: fontFamilyName
  },
  storyBonusSparkTag: {
    borderRadius: 13,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1FBEB8',
    marginRight: 6,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  storyBonusSparkTagText: {
    color: '#1FBEB8',
    paddingTop: 4,
    paddingBottom: 5,
    paddingLeft: 6,
    paddingRight: 5,
    fontSize: 13,
    fontFamily: fontFamilyName
  },
  storyBonusSparkTagTextHighlight: {
    backgroundColor: '#1FBEB8',
    color: '#9600A1',
    paddingVertical: 4,
    fontSize: 13,
    paddingHorizontal: 7
  },
  storyDetailActionTag: {
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 13,
    overflow: 'hidden',
    backgroundColor: '#1FBEB8',
    fontFamily: fontFamilyName
  },
  chatView: {
    flex: 1,
    flexDirection: 'column',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5
  },
  chatItemsView: {
    flex: 1,
    padding: 15
  },
  chatItem: {
    width: '100%',
    marginBottom: 10
  },
  chatActionView: {
    height: 50,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  chatAttachmentIcon: {
    color: '#cccccc',
    fontSize: 20,
    marginRight: 15
  },
  chatInputItem: {
    height: 30,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    paddingVertical: 0,
    paddingHorizontal: 10
  },
  viewShowMember: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10
  },
  member1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -5
  },
  member2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -5
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
    color: '#9600A1',
    fontSize: 14
  },
  viewChatContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute'
  },
  viewChat: {
    flexDirection: 'row',
    borderRadius: 5,
    borderColor: 'green',
    borderWidth: 1
  },
  sendImage: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end'
  },
  textInput: {
    alignSelf: 'flex-start'
  },
  viewBubble: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flag: {
    width: 15,
    height: 15
  },
  flagButton: {
    right: 10,
    width: 30,
    height: 30,
    alignSelf: 'flex-end'
  },
  faceButton: {
    alignSelf: 'center'
  },
  showOrLess: {
    color: '#1FBEB8'
  },
  contentHeight: {
    maxHeight: wp('20%'),
    overflow: 'hidden'
  },
  contentHeightMax: {
    maxHeight: wp('43%'),
    overflow: 'hidden'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9600A1'
  },
  modalTitle: {
    color: '#fff',
    fontSize: 17,
    margin: 16,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    position: 'absolute',
    right: 0,
    height: 52,
    backgroundColor: '#9600A1',
    borderRadius: 50,
    bottom: 32
  },
  rewardsIcon: {
    width: 14,
    height: 17
  },
  rewardsText: {
    color: '#fff',
    fontSize: 9
  },
  rewardsImg: {
    width: 116,
    height: 116,
    borderRadius: 10
  },
  rewardItemRoot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    width: deviceWidth,
    padding: 16,
    marginTop: 8,
    marginBottom: 8
  },
  rewardItemContainer: {
    height: 99,
    backgroundColor: '#fff',
    padding: 8,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
    flexDirection: 'column',
    flex: 1
  },
  rewardItemTitle: {
    fontSize: 17,
    color: '#000'
  },
  rewardItemDesc: {
    fontSize: 12,
    color: '#000'
  },
  rewardItemCounter: {
    color: '#1FBEB8',
    fontSize: 13,
    alignItems: 'center',
    textAlign: 'right'
  },
  likeModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  likeModalInnerView: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 10
  },
  likeModalTitle: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  likeModalText: {
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
  },
  likeModalSeparator: {
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    textAlign: 'center'
  },
  likeModalAction: {
    backgroundColor: '#1FBEB8',
    color: '#ffffff',
    fontSize: 17,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 40,
    borderRadius: 25,
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
  header: {
    flexDirection: 'row'
    /* height: Platform.select({
            android: 48,
            ios: 44,
        }), */
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  fontStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamilyName,
    fontWeight: '600'
  },
  editGroupNameModalInnerView: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 10,
    borderColor: '#9600A1',
    borderWidth: 3,
    alignItems: 'center'
  },
  editGroupNameDialogTitle: {
    color: '#9600A1',
    fontSize: 20,
    fontFamily: fontFamilyName
  },
  submitBtn: {
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 20,
    paddingEnd: 20,
    borderRadius: 40,
    margin: 10,
    backgroundColor: '#9600A1'
  },
  inputStyle: {
    borderColor: '#9600A1',
    borderWidth: 1,
    borderRadius: 5,
    width: '50%',
    height: 40,
    color: '#9600A1',
    paddingStart: 10,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10
  },
  modalVideo: {
    width: deviceWidth,
    height:height,
    borderRadius: 13,
    margin: 3,
  }
})

export default styles
