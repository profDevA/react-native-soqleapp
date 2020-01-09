/*
 * @file: PushNotification.js
 * @description: Contains all function related push notification.
 * @date: 12.Oct.2019
 * @author: Parshant Nagpal
 * */
/* eslint-disable */
import { AsyncStorage , Platform } from "react-native";
import firebase from "react-native-firebase";
// eslint-disable-next-line no-console
import type { Notification, NotificationOpen } from "react-native-firebase";
import { NavigationActions, StackActions } from 'react-navigation';
import { saveWorld, getUserLastLoginInfo, createUserLogin, getUserById} from "../realm/RealmHelper";
import NavigationService from '../navigator/NavigationService';

/*
Get the Fcm token of the device
*/
const getToken = async () => {
  console.log("fcmTokendata");
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    console.log("fcmToken", fcmToken);
    await AsyncStorage.setItem("device_token", `${fcmToken}`);
  }
};

/*
All Listeners related to Firebase
*/
export const listeners = () => {

  this.notificationDisplayedListener = firebase
    .notifications()
    .onNotificationDisplayed(notification => {

    });
  this.notificationListener = firebase
    .notifications()
    .onNotification(notification => {
      // When app is in forground  and push come immedialtely show (Without Touch)

    });
  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(async (notificationOpen: NotificationOpen) => {
      console.log("pushreceived ", notificationOpen )

      let data=notificationOpen.notification._data;
      if (data.type==="Simple Message"){
        console.log("pushreceived Simple Message " )

          let dataSent= {
            task_group_id: data.data,
            taskUpdated: false
          }
          NavigationService.navigate('Chat',{params:dataSent});

          }



      if (data.type==="Share Comment"){

      }
      //when app is in background (not killed ) tapping on the push notification call that


    });
};
/*
when app is killed or not in memory push noptification come then cick on the push notification will call that function
*/
const getInitialNotification = async () => {
  const notificationOpen: NotificationOpen = await firebase
    .notifications()
    .getInitialNotification();
  if (notificationOpen) {
    //When the app is killed and tapping on the push will call this function

  }
};
/**
 * Checking the app has permission for using firebase in ios
 */
const checkPermision = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    trigerAllEvents();
  } else {
    requestpermission();
  }
};
/**
 * Requesting the app permission for firebase in ios
 */
const requestpermission = async () => {
  try {
    const enabled = await firebase.messaging().requestPermission();
    if (enabled) {
      trigerAllEvents();
    } else {
      requestpermission();
    }
  } catch (error) {
    // User has rejected permissions
  }
};

const trigerAllEvents = () => {

  getToken();

  getInitialNotification();

  listeners();
};
/*
Remove All Listeners
*/
export const removeListeners = () => {
  this.notificationDisplayedListener();
  this.notificationListener();
  this.notificationOpenedListener();
};
/**
 It loads the fcm
 */
export const pushNotifificationInit = async () => {
  try{

      if (Platform.OS === "ios") {
        checkPermision();
      } else {
        trigerAllEvents();
      }

    }catch(error){console.log(error)}
};
