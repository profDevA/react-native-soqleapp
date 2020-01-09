import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StyleSheet, Dimensions } from 'react-native'

import { MAIN_COLOR } from '../constants'
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    backgroundColor: '#130C38',
    flex: 1,
    alignItems: 'center',
    position: 'relative'

  },
  image: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain'
  },

  signUp: {
    borderWidth: 1,
    borderColor: '#FFC600',
    borderRadius: 5,
    width: 120,
    height: 51,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5

  },
  signupText: {
    fontSize: 20,
    color: '#FFC600'
  },
  mainContent: {
    flex: 1,
    position: 'relative'
  },

  text: {
    color: `rgba(255, 255, 255, 0.7)`,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'

    // paddingHorizontal: 16,
  },
  textBottom: {
    color: 'rgba(255, 255, 255,0.54)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'OpenSans-Regular'
  },
  titleWrap: {
    height: height / 6,
    marginTop: height / 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'SFUIDisplay-Regular'
  },
  title: {
    fontFamily: 'SFUIDisplay-Regular',
    fontSize: 28,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  activedotView: {
    backgroundColor: '#9600A1',
    height: 10,
    width: 10,
    borderRadius: 6,
    bottom: 0,
    zIndex: 10
  },
  dotView: {
    backgroundColor: 'rgba(150, 0, 161, 0.4)',
    height: 10,
    width: 10,
    borderRadius: 5,
    bottom: 0,
    zIndex: 10
  }
})
