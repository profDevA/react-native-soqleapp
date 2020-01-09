'use strict';

import Realm from 'realm';
import {CONTENT_SCHEMA} from "./content";
export const TASK_SCHEMA = 'Task';

class Task extends Realm.Object {}

Task.schema = {
    name: TASK_SCHEMA,
    primaryKey: '_taskId',
    properties: {
        _taskId: {
            type: 'string',
            optional: true
        },
        _id: {
            type: 'string',
            optional: true
        },
        content: {
            type: 'Content[]',
            default: [],
        },
        status: {
            type: 'string',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },

    }

};

export default Task;
