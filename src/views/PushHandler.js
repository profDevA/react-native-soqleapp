import React from 'react';
// var PushNotification = require('react-native-push-notification');
import {AsyncStorage,Platform} from 'react-native';
import  Mixpanel from 'react-native-mixpanel';

export  default class PushHandler extends  React.Component{

    constructor(props){
        super(props)
    }
    componentDidMount(){
//         PushNotification.configure({

//             // (optional) Called when Token is generated (iOS and Android)
//             onRegister:  async function(token) {
//                 console.log( 'TOKEN:', token );
//                 // await  AsyncStorage.setItem("device_token",`${token}`);
//                 if(Platform.OS === 'android'){
//                     Mixpanel.setPushRegistrationId(`${token}`);
//                     Mixpanel.initPushHandling(178636075101);
//                 }
//                 else{
//                     Mixpanel.addPushDeviceToken(`${token}`);
//                 }


// //tell Mixpanel which user record in People Analytics should receive the messages when they are sent from the Mixpanel app,
// //make sure you call this right after you call `identify`


//             },

//             // (required) Called when a remote or local notification is opened or received
//             onNotification: function(notification) {
//                 console.log( 'NOTIFICATION:', notification );

//                 // process the notification

//                 // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
//                 notification.finish(PushNotificationIOS.FetchResult.NoData);
//             },

//             // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
//             senderID: "178636075101",

//             // IOS ONLY (optional): default: all - Permissions to register.
//             permissions: {
//                 alert: true,
//                 badge: true,
//                 sound: true
//             },

//             // Should the initial notification be popped automatically
//             // default: true
//             popInitialNotification: true,

//             /**
//              * (optional) default: true
//              * - Specified if permissions (ios) and token (android and ios) will requested or not,
//              * - if not, you must call PushNotificationsHandler.requestPermissions() later
//              */
//             requestPermissions: true,
//         });
    }

    render(){

        return null
    }
}
