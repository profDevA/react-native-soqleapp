import _ from 'lodash';
import * as axios from 'axios';
import {AsyncStorage, Alert} from 'react-native'
import {API_BASE_URL} from "../config";
import {trackMixpanel, trackError} from "../utils/common";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});



export const patchConversation = (group) => {
  console.log("PATCHING CONVERSATION")
}


export const patchQuestions = async (skill) => {
    let data ={
        skill:skill,
      }
  await instance.get(`${API_BASE_URL}/patchQuestionsBySkill?skill=${skill}`).then(response => {
      if (response) {
          createUpdateQuestions(response.data);
        }
      }).catch(err => {
        console.log(err);
        trackError(err);
      });
}

export const patchFeid = async (groupId) => {
      let data ={
        groupId:groupId,
      }

      let group = getGroup(groupId);
      await instance.post(`${API_BASE_URL}/patchFEID`, data).then(response => {
      if (response) {
          createUpdateGroup(response.data); //update the id returned from the server

          return response.data;
        }
      }).catch(err => {
        console.log(err);
        trackError(err);
      });

}


export const patchQuestionsBySkill = async (skill) =>{

}

export function patchProfilePicInGroup(group){
  group._team.users.forEach(user=> {
    user.shares.forEach(share => {
      share.comments.forEach(comment =>{
          console.log("checking comment ",comment);

          if (comment.creator){
              let profilePic = getProfileImg(comment.creator);
              comment.creator.pictureURL=profilePic;
              console.log("profilePic ",profilePic);
          }
        });
    });
  });
}

export function patchProfilePicInContent(content){
        if (content.creator){
              let profilePic = getProfileImg(comment.creator);
              comment.creator.pictureURL=profilePic;
          }
}


export const patchUserStory = async (groupId) => {
  await instance.post(`${API_BASE_URL}/patchUserStory`, {groupId}).then(async response => {
      if (response) {
      await createUpdateGroup(response.data); //update the id returned from the server

      return response.data;
    }})
    .catch(err => {
      console.log(err);
      trackError(err);
    });
}

export const patchPushToken = async (user,cb) => {

  AsyncStorage.getItem('device_token', async (err, deviceToken) => {
    if (err){
      console.log(err);
      trackError(err);
    }
     if(!deviceToken  || (user && user.profile && user.profile.pushToken && deviceToken == user.profile.pushToken)){
       return
     }else{
       let data ={
         userId:user._id,
         pushToken: deviceToken,
       }
     let response =   await instance.post(`${API_BASE_URL}/savePushToken`, data)

       if (response) {
         cb(response.data[0]);
         }

     }
   }).catch(err => {
     console.log(err);
     trackError(err);
   });;
}
