import * as Constants from '../constants';
import _ from 'lodash';

export const isUpdateGroupEvent = (eventType) => {
    switch (eventType) {
        case Constants.EVENT_BONUS_SPARK_REDUCED:
            return true;
        case Constants.EVENT_TASK_COMPLETE:
            return true;
        case Constants.EVENT_TEAM_JOIN:
            return true;
        case Constants.EVENT_BRAINDUMP_COMPLETE:
            return true;            
        case Constants.EVENT_ILLUMINATE_COMPLETE:
            return true;
        case Constants.EVENT_LEAVE_GROUP:
            return true;
        case Constants.EVENT_GROUP_NAME_CHANGE:
            return true;
        case Constants.EVENT_GROUP_SIZE_CHANGE:
            return true;
        case Constants.EVENT_USERSTORY_PROGRESS:
            return true;
        default:
            return false;
    }
};

export const isSystemEvent = (eventType) => {
    switch (eventType) {
        case Constants.EVENT_BONUS_SPARK_REDUCED:
            return true;
        case Constants.EVENT_TASK_COMPLETE:
            return true;
        case Constants.EVENT_TEAM_JOIN:
            return true;
        case Constants.EVENT_LEAVE_GROUP:
            return true;
        case Constants.EVENT_GROUP_NAME_CHANGE:
            return true;
        case Constants.EVENT_GROUP_SIZE_CHANGE:
            return true;
        case Constants.EVENT_USERSTORY_PROGRESS:
            return true;
        default:
            return false;
    }
};

export const isUserEvent = (eventType) => {
    switch (eventType) {
        case Constants.EVENT_CHAT_MESSAGE:
            return true;
        case Constants.EVENT_BRAINDUMP_COMPLETE:
            return true;
        default:
            return false;
    }
};

export const setText = (group, message) => {


  if (message.type == Constants.EVENT_TASK_COMPLETE && !group){
    const firstName = message.user.profile.firstName;
    const storyName = group ? _.get(group, '_tasks[0].name', 'Task') : 'Task';
    const sparks = group ? _.get(group, 'leftBonusSparks', 0) : 0;
    return  `${firstName} finishes ${storyName}. (${sparks} sparks)`
  }else {
    return message.message;
  }
};
