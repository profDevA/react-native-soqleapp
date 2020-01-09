'use strict';

import Realm from 'realm';
export const CONVERSATION_SCHEMA = 'Conversation';
export const CONVERSATION_LIST_SCHEMA = 'Conversation[]';

import {MESSAGE_SCHEMA} from "./message";

class Conversation extends Realm.Object {}
Conversation.schema = {
    name: CONVERSATION_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        participants: {
            type: 'string[]',
            optional: true
        },
        messages: {
            type: 'Message[]',
            default: []
        },


    }

};

export default Conversation;
