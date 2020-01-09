
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
let isLoginScreenPresented;
import {  trackError } from "../utils/common";

export const getUser = () => {
  console.log('Socket Util getting socket')
  return userInfo;
}

export const gInit = async () => {
  GoogleSignin.configure({
    //scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    webClientId: '178636075101-jd0fac80h0o4dosthncb0b3cjq2dflsv.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  });
};

export const gSignin = async () => {
  let userInfo;
  try {
    console.log("starting gsignin")
    await GoogleSignin.hasPlayServices();
     userInfo = await GoogleSignin.signIn();
    console.log("gsignin found userinfo ", userInfo)
    return userInfo;
  } catch (error) {
    trackError(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("error code ", statusCodes.IN_PROGRESS)
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("error code ", statusCodes.PLAY_SERVICES_NOT_AVAILABLE)

      // play services not available or outdated
    } else {
      console.log("some other error")
      // some other error happened
    }
  }
  return userInfo;
};

export const isGSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn();
  this.setState({ isLoginScreenPresented: !isSignedIn });
};
