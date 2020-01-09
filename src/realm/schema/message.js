'use strict';

import Realm from 'realm';
import {CONTENT_SCHEMA} from "./content";
export const MESSAGE_SCHEMA = 'Message';
export const MESSAGE_LIST_SCHEMA = 'Message[]';
class Message extends Realm.Object {}

Message.schema = {
    name: MESSAGE_SCHEMA,
    primaryKey: 'msgId',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        msgId: {
            type: 'string',
            optional: true
        },
        sender: {
            type: 'string',
            optional: true
        },
        message: {
            type: 'string',
            optional: true
        },
        conversationId: {
            type: 'string',
            optional: true
        },
        receiver: {
            type: 'string',
            optional: true
        },
        image: {
            type: 'string',
            optional: true
        },
        video: {
            type: 'string',
            optional: true
        },
        isJoining: {
            type: 'bool',
            optional: true
        },
        isReward: {
            type: 'bool',
            optional: true
        },
        time: {
            type: 'date',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },
        refId: {
            type: 'string',
            optional: true
        },




    }

};

export default Message;
