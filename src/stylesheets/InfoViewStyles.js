import { Dimensions, StyleSheet, Platform } from 'react-native'
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
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0
  },
  headerTitleStyle: {
    color: '#000000'
  },
  headerRightTextStyle: {
    color: '#1FBEB8'
  },
  member1: {
    width: 28,
    height: 28,
    borderRadius: 14
  },
  member2: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -9
  },
  plusMemberView: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: '#1FBEB8',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginLeft: -9
  },
  plusTxt: {
    color: '#1FBEB8',
    fontSize: 13
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
  imageBgContainer: {
    width: '100%',
    height: Platform.OS === 'ios' ? 94 : 57,
    flex: 0
  },
  storyImageContainer: {
    width: '100%',
    height: 314
  },
  storyImage: {
    flex: 1,
  },
  StoryDetailsContainer: {
    width: '100%',
    height: 185,
    backgroundColor: '#3C1364'
  },
  storyTitleStyle: {
    fontFamily: fontFamilyName,
    fontSize: 17,
    color: '#FFF',
    fontWeight: '600'
  },
  storyDiscriptionStyle: {
    fontFamily: fontFamilyName,
    fontSize: 14,
    color: '#FFF',
    marginTop: 20
  },
  roundImageContainer: {
    padding: 20,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  SparkImageStyle: {
    width: 20,
    height: 20,
    alignSelf: 'center'
  },
  sparkTextStyle: {
    fontSize: 15,
    fontFamily: fontFamilyName,
    color: '#1FBEB8'
  },
  nextSequenceContainer: {
    height: 220,
    width: '100%',
    backgroundColor: '#F2F2F2'
  },
  swipeImageStyle: {
    width: 24,
    height: 18,
    marginTop: 32,
    alignSelf: 'center'
  },
  rectangleStyle: {
    width: wp('44.7%'),
    height: 78,
    backgroundColor: '#1FBEB8',
    borderRadius: 13,
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  rectangleTextStyle: {
    fontSize: 14,
    fontFamily: fontFamilyName,
    color: '#FFFFFF',
    alignSelf: 'center',
    paddingHorizontal: 10
  }
})

export default styles
