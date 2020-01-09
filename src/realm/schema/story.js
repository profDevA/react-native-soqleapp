'use strict';

import Realm from 'realm';
import {TASK_GROUP_SCHEMA} from "./taskGroup";
import {COMPANY_SCHEMA} from "./company";
import {OBJECTIVE_SCHEMA} from "./objective";
import {REWARD_SCHEMA} from "./reward";
export const STORY_SCHEMA = 'Story';

class Story extends Realm.Object {}
Story.schema = {
    name: STORY_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        skill: {
            type: 'string',
            optional: true
        },
        name: {
            type: 'string',
            optional: true
        },
        description: {
            type: 'string',
            optional: true
        },
        _objective: {
            type: OBJECTIVE_SCHEMA,
            optional: true
        },
        objectiveValue: {
            type: 'string',
            optional: true
        },
        expiry: {
            type: 'int',
            optional: true
        },
        quota: {
            type: 'int',
            optional: true
        },
        bonusSparks: {
            type: 'int',
            optional: true
        },
        reducePerRefresh: {
            type: 'int',
            optional: true
        },
        abstract: {
            type: 'string',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },
        success: {
            type: 'string',
            optional: true
        },
        validation: {
            type: 'string',
            optional: true
        },
        _company: {
            type: 'Company',
            optional: true
        },
        taskGroup: {
            type: TASK_GROUP_SCHEMA,
            optional: true
        },
        nextteaser: {
            type: 'string',
            optional: true
        },
        public: {
            type: 'bool',
            optional: true
        },
        requirementValue: {
            type: 'string',
            optional: true
        },
        maxnum: {
            type: 'int',
            optional: true
        },
        requirement: {
            type: 'string',
            optional: true
        },
        insdt: {
            type: 'date',
            optional: true
        },
        refresh: {
            type: 'string',
            optional: true
        },
        environment: {
            type: 'string',
            optional: true
        },
        reward: {
            type: REWARD_SCHEMA,
            optional: true
        },
        category: {
            type: 'string',
            optional: true
        },
        subCategory: {
            type: 'string',
            optional: true
        },
        imagesUrl: {
            type: 'string[]',
            optional: true
        },
        codes: {
            type: 'string[]',
            optional: true
        },
        assets: {
            type: 'string[]',
            optional: true
        },
        deprecated:{ //old story
          type: 'bool',
          default: false
        }
    }

};

export default Story;
