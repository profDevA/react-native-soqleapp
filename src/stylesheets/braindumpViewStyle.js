import { Dimensions, Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topActionView: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginLeft: 10
  },
  textInputTitle: {
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    padding: 5
  },
  textInputContent: {
    fontSize: 18,
    height: 'auto',
    color: 'white',
    textAlign: 'center',
    padding: 5
  },
  submitView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10
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
  sliderContainer: {
    position: 'absolute',
    left: 15,
    height: '60%',
    top: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        zIndex: 1000
      }
    })
  },
  slider: {
    height: '100%',
    transform: [{ rotate: '180deg' }]
  },
  sliderTrack: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 350,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#67646D'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000'
  },
  tick: {
    width: 24,
    height: 24
  },
  tickContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 16,
    position: 'absolute',
    right: 4,
    top: 4
  },
  submit: {
    backgroundColor: '#FF4763',
    color: '#FFFFFF',
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 8,
    fontSize: 14
  },
  closeIconContainer: {
      justifyContent: 'center'
  },
  closeButton: {
      color: "#ffffff"
  },
  topViewContainer: {
      position: 'absolute',
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      top: 20,
      justifyContent: 'center'
  },

});

export default styles;
