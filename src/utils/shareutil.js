
import {EVENT_BRAINDUMP_COMPLETE, EVENT_USERSTORY_PROGRESS} from '../../src/constants';
import { getSocket } from "../utils/socket";
import {  addNewMessage } from "../realm/RealmHelper";
import { API_BASE_URL } from '../config';
import {getuuid} from '../utils/common';
import * as axios from 'axios';
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});


export const broadcastMessage = async (message, user, group, event) => {
  let uuid=getuuid()
  try{
      await addNewMessage(group, message, user._id,group._team._id, event, uuid,null);
      getSocket().emit('client:message', {
        msgId: uuid, //special id to synch server and client ids
        sender: user._id,
        receiver: group._team._id,
        chatType: 'GROUP_MESSAGE',
        type: event,
        userProfile: user,
        time: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        message: message,
        groupId: group._id
      })
    } catch (e) {console.error(e)}
}

export const broadcastShare = (share, user, group, event) => {

  if (!share || !share.content || !user || !group._team)
  {
    return;
  }
  
  let uuid=getuuid()
  try{
      addNewMessage(group, share.content.content1, user._id,group._team._id, event, uuid, share.content.image);
      getSocket().emit('client:message', {
        msgId: uuid, //special id to synch server and client ids
        sender: user._id,
        receiver: group._team._id,
        chatType: 'GROUP_MESSAGE',
        type: event,
        image: share.content.image,
        userProfile: user,
        time: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        message: share.content.content1,
        groupId: group._id
      })
    } catch (e) {console.error(e)}
}
