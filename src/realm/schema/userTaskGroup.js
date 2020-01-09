'use strict';

import Realm from 'realm';
import { TEAM_SCHEMA} from "./team";
import { USER_PROFILE_SCHEMA} from "./userProfile";
import {TASK_GROUP_SCHEMA} from "./taskGroup";
import {STORY_SCHEMA} from "./story";
import {USERSTORY_SCHEMA} from "./userStory";
import {TASK_SCHEMA} from './task';
import  {MESSAGE_LIST_SCHEMA} from './message'

export const USER_TASK_GROUP_SCHEMA = 'UserTaskGroup';

class UserTaskGroup extends Realm.Object {}

UserTaskGroup.schema = {
    name: USER_TASK_GROUP_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        updatedAt: {
            type: 'date',
            optional: true
        },
        createdAt: {
            type: 'date',
            optional: true
        },
        _userStory: {
            type: USERSTORY_SCHEMA,
            optional: true
        },
        _user: {
            type: USER_PROFILE_SCHEMA,
            optional: true
        },
        _team: {
            type: TEAM_SCHEMA,
            optional: true
        },
        leftBonusSparks: {
            type: 'int',
            optional: true
        },
        lastBonusSparksRefreshed: {
            type: 'date',
            optional: true
        },
        isPrivate: {
            type: 'bool',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },
        secretCode: {
            type: 'string',
            optional: true
        },
        taskCounter: {
            type: 'int',
            optional: true
        },
        currentTask: {
            type: TASK_GROUP_SCHEMA,
            optional: true
        },
        email: {
            type: 'string[]',
            default: []
        },
        name: {
            type: 'string',
            optional: true
        },
        tasks: {
            type: 'Task[]',
            default: []
        },
        messages: {
            type: 'Message[]',
            default: []
        },
    }
};

export default UserTaskGroup;
