import { Map, List, fromJS, Seq } from 'immutable';
import React, { Component } from 'react';
import _ from 'lodash';
import {EVENT_BRAINDUMP_COMPLETE, EVENT_TASK_COMPLETE, EVENT_CHAT_MESSAGE} from '../constants'
import { isSystemEvent, isUserEvent, setText } from "../utils/EventUtil";
const uuid = require('react-native-uuid');
import { Thumbnail } from "native-base";
import {  isExistingMsg,createUpdateUserStory,createUpdateGroup,getGroup,createUpdateQuestions } from "../realm/RealmHelper";
import ImageResizer from 'react-native-image-resizer';
import MixPanel from "react-native-mixpanel";
import {BUGSNAG_KEY, API_BASE_URL} from "../config";
import {Client} from 'bugsnag-react-native';
const bugsnag = new Client(BUGSNAG_KEY);
import {MAIN_COLOR} from '../constants';
import {showMessage} from 'react-native-flash-message';
import {Platform,AsyncStorage, Alert} from 'react-native'

import I18n from '../utils/localize'


import * as axios from 'axios';
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});



export const isValidEmail = email => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

export const flashMessage = (message) =>{
  showMessage({message, type: MAIN_COLOR});
}

export function timeDifference(current, previous)
{
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;
  if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + "sec ago";
  } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + "min ago";
  } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + "h ago";
  } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + "d ago";
  } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + "mon ago";
  } else {
      return Math.round(elapsed / msPerYear) + "yrs ago";
  }
}

export function trackError(error, source)
{
  console.error(error);
  
  if (__DEV__){return;}

  if (source){
    bugsnag.notify(source+" :"+error);
  }
  else{
      bugsnag.notify(error);
  }

}

export const trackMixpanelLogin = async (profile) =>{
  if ((!(__DEV__)) && (API_BASE_URL === 'https://betaapi.soqqle.com')) {
      MixPanel.identify(profile.email);
     let deviceToken=    await AsyncStorage.getItem('device_token', (err, deviceToken) );

             if(!deviceToken){
               return
             }

            if(Platform.OS === 'ios'){
                MixPanel.set({

                    '$email': profile.email,
                    'name': `${profile.firstName} ${profile.lastName}`,
                    'platform': Platform.OS,
                    'ios_devices': [`${deviceToken}`],
                    'distinct_id':`${profile.email}`,
                    'token':`${profile.deviceToken}`,
                    'ip':`0`

                });
                MixPanel.addPushDeviceToken(`${profile.deviceToken}`);
            }
            else{
                MixPanel.set({

                    '$email': profile.email,
                    'name': `${profile.firstName} ${profile.lastName}`,
                    'platform': Platform.OS,
                    'android_devices':[`${profile.deviceToken}`],
                    'distinct_id':`${profile.email}`,
                    'token':`${profile.deviceToken}`,
                    'ip':`${profile.email}`
                });
                MixPanel.setPushRegistrationId(`${profile.deviceToken}`);
                MixPanel.initPushHandling("178636075101");


            }



      MixPanel.track('Sign in', {
        '$email': email,
        '$last_login': new Date(),
        'house': characterName,
        'name': `${firstName} ${lastName}`
      });
  }
}

export function trackMixpanel(message, data, event){
  try{
      //we only track production because mixpanel costs $$!!
       if ((!(__DEV__)) && (API_BASE_URL === 'https://betaapi.soqqle.com')) {

         if (message && message=="Sign up - ios"){
           MixPanel.registerSuperProperties();
          }

          if (data){
          MixPanel.track(message, {
              "data": data
          })
        }
        else{
            MixPanel.track(message);
        }
      }
  } catch (error){
        trackError(error);
    }

}

exports.resizeImg= async (imageUri, newWidth, newHeight, compressFormat, quality) => {

  let uriresult;
  await ImageResizer.createResizedImage(imageUri, newWidth, newHeight, compressFormat, quality)
  .then((uri) => {

           uriresult= uri.uri;
         })
         .catch(err => {
           console.error(err);
     });
     return uriresult;
}


export function getProfileImg (profile)
{
  return profile && profile.pictureURL || `https://ui-avatars.com/api/?name=${profile && profile.firstName ? profile.firstName : ''}+${ profile && profile.lastName ? profile.lastName : ''}`;
}

export function deepFromJS(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(deepFromJS).toList() :
            Seq(js).map(deepFromJS).toMap();
}

export function getGroupUserDetails(groupDetails) {
  if (!groupDetails.userDetails){
    return;
  }
    groupDetails.map((group, groupIndex) => {
        return group._team.emails.map((email, emailIndex) => {
            return groupDetails[groupIndex]._team.emails[emailIndex]['userDetails'] = groupDetails.userDetails.find((element) => {
                return element.profile.email === email.email;
            });
        });
    });
    return groupDetails;
}

export function getuuid()
{
  let newuuid= uuid.v1();
  return newuuid;
}

export function mapMessageProperty(group, msgUser, message)
{
  let setId = message._id;
  if (!setId)
  {
    setId= getuuid(); //temporary Id until
  }

  messageProperty = {
 // _id: Math.random(),
    _id: setId,
   createdAt: message.time,
   time: message.time,
   text: setText( group, message)
 }

//the sender of chat-bot  comes from the server when bonus sparks are reduced.
 if (message.sender != "chat-bot" && msgUser &&  msgUser.profile)  {
     messageProperty= { ...messageProperty,
       user: {
         _id: message.sender,
         name: msgUser.profile.firstName ? msgUser.profile.firstName : '' + ' ' + msgUser.profile.lastName ? msgUser.profile.lastName : '',
         avatar: msgUser.profile.pictureURL || `https://ui-avatars.com/api/?name=${msgUser.profile.firstName ? msgUser.profile.firstName : ''}+${msgUser.profile.lastName ? msgUser.profile.lastName : ''}`,
   }
 }
}


 if (message.fromMe) {
     return;
 }

 /*let isUnBlocked = true, blockUserIds = this.props.user.blockUserIds;
 if (message.user && blockUserIds.length > 0 && blockUserIds.indexOf(message.user._id) !== -1) {
     isUnBlocked = false;
 }*/

 if (isSystemEvent(message.type))  {
     messageProperty= { ...messageProperty,
       system: true
     }
 }


 if (message.video) {
  messageProperty= { ...messageProperty,
    video: message.video
  }
}else if (message.image) {
  messageProperty= { ...messageProperty,
      image: message.image
  }
}

 if (message.isJoining) {
     messageProperty= { ...messageProperty,
         isJoining: true
     }
 }

 if (message.isReward) {
     messageProperty= { ...messageProperty,
         isReward: message.isReward
     }
 }
 return messageProperty;
}

export function getMessages(group, messages, blockUserIds, userProfile) {

    let messagesWithUserDetails = [];
    let msgIdsAdded=[];
    messages.map(message => {
        let index= msgIdsAdded.indexOf(message.msgId);
        if (index >= 0)
        {
          return;
        }
        let msgUser = group._team.users.find(user => {
            return user._id == message.sender;
        });


        let isBlocked = false;
        if (blockUserIds.length > 0 && blockUserIds.indexOf(user.userDetails && userData.userDetails._id) !== -1) {
            isBlocked = true;
        }
        if (isBlocked) { return ; }

        //the message may exist but user does not - this happens if user has left the group
        if (msgUser){
            messagesWithUserDetails.push(mapMessageProperty(group,msgUser,message));
          msgIdsAdded.push(message.msgId);
        }

            /*if (message.message == 'Task is completed' || message.isReward) {

                const  firstName  = _.get(userData, 'userDetails.profile.firstName');
                const storyName = group ? _.get(group, '_tasks[0].name', 'Task') : 'Task';
                const sparks = group ? _.get(group, 'leftBonusSparks', 0) : 0;
                messagesWithUserDetails.push(
                    {
                        _id: message._id,
                        text: `${firstName} finishes ${storyName}. (${sparks} sparks)`, // message.message,
                        createdAt: new Date(message.time),
                        system: true,
                        isReward: message.isReward,
                        userProfile: userProfile,
                        image: message.image,
                    }
                );
            } else if (message.isJoining){
                messagesWithUserDetails.push(
                {
                    _id: message._id,
                    text: message.message,
                    createdAt: new Date(message.time),
                    system: true,
                    isJoining: true,
                    userProfile: userProfile,
                    image: message.image,
                }
            );
            } else if (userData && userData.userDetails && userData.userDetails.profile) {
                messagesWithUserDetails.push(
                    {
                        _id: message._id,
                        text: message.message,
                        createdAt: new Date(message.time),
                        user: {
                            _id: userData.userDetails._id,
                            name: userData.userDetails.profile.firstName + ' ' + userData.userDetails.profile.firstName,
                            avatar: userData.userDetails.profile.pictureURL || `https://ui-avatars.com/api/?name=${userData.userDetails.profile.firstName}+${userData.userDetails.profile.lastName}`
                        },
                        userProfile: userProfile,
                        image: message.image,
                    }
                );
            } else {

                messagesWithUserDetails.push(
                    {
                        _id: message._id,
                        text: message.message,
                        createdAt: new Date(message.time),
                        user: {
                            _id: userProfile._id,
                            name: userProfile.profile.firstName + ' ' + userProfile.profile.firstName,
                            avatar: userProfile.profile.pictureURL || `https://ui-avatars.com/api/?name=${userProfile.profile.firstName}+${userProfile.profile.lastName}`
                        },
                        userProfile: userProfile,
                        image: message.image,
                    }
                );
            }*/


    });

    messagesWithUserDetails.sort(function(x, y){
      return x.time - y.time;
    })
    return messagesWithUserDetails;
}

export function getFeedDuration(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " "+I18n.t("daysAgo");
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " "+I18n.t("hoursAgo");
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " "+I18n.t("minsAgo");
        }
        return Math.floor(seconds) + " "+I18n.t("secondsAgo");

}
