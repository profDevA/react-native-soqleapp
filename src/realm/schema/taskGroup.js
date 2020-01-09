'use strict';

import Realm from 'realm';
import {COMPANY_LIST_SCHEMA} from "./company";
import {TEAM_LIST_SCHEMA} from "./team";
export const TASK_GROUP_SCHEMA = 'TaskGroup';
export const TASK_GROUP_LIST_SCHEMA = 'TaskGroup[]';

class TaskGroup extends Realm.Object {}
TaskGroup.schema = {
    name: TASK_GROUP_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        groupname: {
            type: 'string',
            optional: true
        },
        sequence: {
            type: 'string',
            optional: true
        },
        description: {
            type: 'string',
            optional: true
        },
        category: {
            type: 'string',
            optional: true
        },
        name: {
            type: 'string',
            optional: true
        },
        unlocktime: {
            type: 'string',
            optional: true
        },
        skillname: {
            type: 'string',
            optional: true
        },
        unlockdate: {
            type: 'date',
            optional: true
        },
        requirement: {
            type: 'string',
            optional: true
        },
        requirementValue: {
            type: 'string',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },
        typename: {
            type: 'string',
            optional: true
        },
        /*_company: {
            type: COMPANY_LIST_SCHEMA,
            default: []
        },
        _teams: {
            type: TEAM_LIST_SCHEMA,
            default: []
        }*/
    }

};

export default TaskGroup;