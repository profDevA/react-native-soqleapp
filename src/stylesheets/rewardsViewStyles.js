import {Dimensions, StyleSheet} from 'react-native'

const screenWidth = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2649'
  },
  rewardsScrollView: {
    flex: 1,
    backgroundColor: '#2C2649',
    margin: 16
  },
  sortByButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 2
  },
  sortByWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  sortByText: {
    color: '#FFFFFF',
    fontSize: 13,
     //   fontFamily: 'SF Pro Text',
    lineHeight: 15,
    textAlign: 'center'
  },
  sortBy: {
    color: '#2FBEB8',
    fontSize: 15,
    textAlign: 'center'
  },
  sortByTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  triangle: {
    color: '#FFFFFF',
    fontSize: 13,
     // fontFamily: 'SF Pro Text',
    lineHeight: 15
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  headerText: {
    color: '#FFFFFF'
  },
  headerTriangle: {
    color: '#ffffff'
  },
  rewardsImg: {
    width: screenWidth - 32,
    height: screenWidth - 32,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  rewardsInfo: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rewardsName: {
    fontFamily: 'SF UI Display',
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold'
  },
  rewardsSparks: {
    fontFamily: 'SF UI Display',
    fontSize: 18,
    color: '#9600A1',
    fontWeight: 'bold'
  },
  rewardsDescription: {
  //  fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  rewardsState: {
    fontFamily: 'SF UI Display',
    fontSize: 15,
    color: '#1FBEB8',
    textAlign: 'right',
    width: '100%',
    fontWeight: 'bold'
  },
  rewardsWrapper: {
    marginTop: 10,
    borderRadius: 5
  },
  accordion: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  sectionContentList: {
    marginLeft: 50,
    marginBottom: 10
  },
  sectionContentItemText: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  sectionContentItemWrapper: {
    margin: 5
  },
  buyReward: {
    margin: 2,
    padding: 5,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1FBEB8',
    overflow: 'hidden',
    backgroundColor: '#1FBEB8',
    color: '#FFFFFF'
  }
})
