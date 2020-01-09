import _ from 'lodash';
import { addNewMessage, updateTaskGroup, getUserTaskGroup, saveGroupMessages, getStories, getUserStory,setUserStory, getGroup,createUpdateUserStory } from '../realm/RealmHelper';
import UserTaskGroup, {USER_TASK_GROUP_SCHEMA} from '../realm/schema/userTaskGroup';
import { DEFAULT_AVATAR } from '../constants';
let Realm = require('realm');
import {Client} from 'bugsnag-react-native';
import {BUGSNAG_KEY, API_BASE_URL} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);
import {getProfileImg} from '../utils/common';
import moment from "moment";
import * as axios from 'axios';
let realm = new Realm(updateTaskGroup, );
import { getSocket } from "../utils/socket";
import {EVENT_BRAINDUMP_COMPLETE, EVENT_USERSTORY_PROGRESS} from '../../src/constants';
import {getuuid,trackError} from '../utils/common';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

export const checkProgressStory = async (group) =>{
  let returnGroup;

  try{
  let pendingUsers = checkUnlockAllParties(group);


  let nextSequence = checkUnlockNextSequence(group);

  if (pendingUsers && pendingUsers.length==0 && nextSequence){
       const returnGroup= await setUserStory (group,nextSequence);

     if (returnGroup){
       let generateduuid=getuuid();
       let content = "The story has progressed to " + returnGroup._userStory.name;

       addNewMessage(returnGroup, content, returnGroup._user._id, returnGroup._team._id, EVENT_USERSTORY_PROGRESS, generateduuid,null ); //null is for image

       getSocket().emit('client:message', {
         msgId: generateduuid, //special id to synch server and client ids
         sender: returnGroup._user._id,
         receiver: returnGroup._team._id,
         conversationId: returnGroup._team.conversation._id,
         chatType: 'GROUP_MESSAGE',
         type: EVENT_USERSTORY_PROGRESS,
         time: new Date().toISOString(),
         createdAt: new Date().toISOString(),
         message: content,
         groupId: returnGroup._id
       })
     }
    }
    } catch (e) {
        trackError(e)
        console.log(e);
    }
}

export const getGroupByUser =(recommendGroups ,userid)=> {
if (!recommendGroups || !userid) { return; }

let recommendGroupsArray=recommendGroups.filter((item)=>{
    let filterGroupArray = item._team.users.filter(subItem =>{
        return(subItem._id == userid )
    })
    return(filterGroupArray.length >0 )
})
return recommendGroupsArray;
}

export const  checkUnlockAllParties =  (userTaskGroup) => {
    // Retrieve all tasks in the userTaskGroup
    // Retrieve all users in the userTaskGroup (in the _team object)
    // Retrieve the current story in the userTaskGroup
    // Check that all users have completed at least 1 task in the current story
    // If true - allow to sequence to the next story
    // If False - display a message to inform the logged in user that there�s a need to ensure all members need to complete their task. Allow a button to send a reminder
    const tasks = userTaskGroup._tasks;

    const pendingUsers = _.filter(userTaskGroup._team.users, u => {

          return !_.some(tasks, t => {

        if(t._userStory._id && t.userId === u._id && t._userStory._id === userTaskGroup._userStory._id && t.status === "complete") {
              return true;
            }
            return false;

        });
    });


    return pendingUsers;
}

/**
* Returns all stories in Realm within the same Group.
*/
export const getAllStoryInTaskGroup = (groupName) =>{
  let stories = getStories();
  return _.filter(stories, function(s){
//    console.log("STORYINTASKGROUP story matching groupname ", story.taskGroup.groupname)
    if(s && s.taskGroup)
    {
        return s.taskGroup.groupname === groupName;
    }
  });
}



export const checkUnlockNextSequence =  (userTaskGroup) => {
      let stories = getStories();

    const userStory = _.find(stories, s => s.name === userTaskGroup._userStory.name)
    if (!userStory || !userStory.taskGroup)
    {
        return;
    }

    const nextStory = _.find(stories, s => {
        if(s && s.taskGroup)
        {
            return s.taskGroup.groupname === userStory.taskGroup.groupname && s.name!=userStory.name && s.taskGroup.sequence == (parseInt(userStory.taskGroup.sequence) + 1)
        }
    })

    if (!nextStory){
        return;
    }

    if (nextStory.name==userStory.name) {
      return;
    }

    if (nextStory && nextStory.requirement ) {
        switch (nextStory.requirement) {
            case 'Achievement':
                break;
            case 'XP':
                break;
            case 'Date':
                if (nextStory.requirementValue && moment(nextStory.requirementValue).isBefore(moment())) {
                    return nextStory;
                }
            default:
                break;
        }
        return null;
    } else {
        console.log('Completed');
    }

}


export const UpdateUserTaskGroup = (Data) => {

    realm.write(() => {
        Data.forEach((group) => {
            try {
                realm.create(updateTaskGroup, group, Realm.UpdateMode.All)
            }
            catch (e) {
                trackError(e)
                console.log(e);
            }
        })
    })
}

export const getUserTaskGroupsById = (idsArray) => {
    /**
     * @param  {strings[]} idsArray
     */

     if (!idsArray || idsArray.length<1){
       return;
     }
    try {
        let realmResult = getUserTaskGroup().filtered(idsArray
            .map((_id) => "_id == " + `'${_id}'`).join(' OR '));
        return realmResultToObjArray(realmResult);
    } catch (e) {
      trackError(e);
    }
}

export const getAllSharesFromUserProfiles = (usersProfilesArray) => {
    if(usersProfilesArray != undefined) {
        try {
            let sharesResult = [];
            usersProfilesArray.map(obj => {
                sharesResult.push(obj.shares)
            });
            let sharesArray = realmResultToObjArray(sharesResult);
            let sharesList = [];
            sharesArray.forEach(element => {
                sharesList.push(realmResultToObjArray(element));
            });
            sharesList = sharesList.map((element, index) => {
                element = element.map(el => {
                    el = {
                        ...el,
                        pictureUrl: usersProfilesArray[index].profile.pictureUrl || getProfileImg (usersProfilesArray[index].profile),
                        userFirstName: usersProfilesArray[index].profile.firstName,
                        userLastName: usersProfilesArray[index].profile.lastName,
                        userProfile: usersProfilesArray[index]
                    }
                    return el;
                })
                return element;
            });
            let sharesMerge = [].concat.apply([], sharesList);
            return _.uniqBy(sharesMerge, "_id");
        } catch (e) {
          trackError(e);

        }
    }
    return null;
}

export const getAllUsersFromUserTaskGroupsTeam = (currentUserId, userTaskGroupArray) => {
   if(userTaskGroupArray != undefined) {
       try {
           let usersResult = [];
           userTaskGroupArray.map(obj => {
               if(obj._team) {
                   usersResult.push(obj._team.users)
               } else {
                   console.log("[getAllUsersFromUserTaskGroupsTeam] - This object has no _team: ", obj)
               }
           });
           let usersListArr = realmResultToObjArray(usersResult);
           let userList = [];
           usersListArr.forEach(element => {
               userList.push(realmResultToObjArray(element));
           });
           let userListMerge = [].concat.apply([], userList);
           let userListWithoutCurrent = userListMerge.filter(obj => obj._id != currentUserId)
           return _.uniqBy(userListWithoutCurrent, "_id");
       } catch (e) {
          trackError(e);

       }
   }
   return null;
}

export const getCurrentUserFromUserTaskGroupsTeam = (currentUserId, userTaskGroupArray) => {
    if(userTaskGroupArray != undefined) {
        try {
            let usersResult = [];
            userTaskGroupArray.map(obj => {
                if(obj._team) {
                    usersResult.push(obj._team.users)
                } else {
                    console.log("[getAllUsersFromUserTaskGroupsTeam] - This object has no _team: ", obj)
                }
            });
            let usersListArr = realmResultToObjArray(usersResult);
            let userList = [];
            usersListArr.forEach(element => {
                userList.push(realmResultToObjArray(element));
            });
            let userListMerge = [].concat.apply([], userList);
            let userListWithoutCurrent = userListMerge.filter(obj => obj._id == currentUserId)
            return _.uniqBy(userListWithoutCurrent, "_id");
        } catch (e) {
           trackError(e);

        }
    }
    return null;
 }

export const getUser = (group, userid) => {

  let user = group._team.users.map((user)=> {
     if (user._id == userid)
     { return user;}
   }
 );
}

const realmResultToObjArray = (realmObject) => {
    /**
     * @param  {Realm.Results<any>} realmObject
     */
    let arr = [];
    try {
        realmObject.map(obj => arr.push(obj));
        return arr;
    }
    catch (e) {
        trackError(e)

    }
}
