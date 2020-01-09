'use strict';

import Realm from 'realm';
import {USER_PROFILE_LIST_SCHEMA} from "./userProfile";
import {COMPANY_SCHEMA} from "./company";
import {CONVERSATION_SCHEMA} from './conversation';
export const TEAM_SCHEMA = 'Team';
export const TEAM_LIST_SCHEMA = 'Team[]';

class Team extends Realm.Object {}
Team.schema = {
    name: TEAM_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        name: {
            type: 'string',
            optional: true
        },
        date: {
            type: 'string',
            optional: true
        },
        users: {
            type: 'UserProfile[]',
            default: []
        },
        _company: {
            type: 'Company[]',
            default: []
        },
        leftBonusSparks: {
            type: 'int',
            optional: true
        },
        lastBonusSparksRefreshed: {
            type: 'date',
            optional: true
        },
        taskCounter: {
            type: 'int',
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
        conversation: {
            type: 'Conversation',
            optional:true
        },

    }

};

export default Team;
