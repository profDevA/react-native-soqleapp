'use strict';

import Realm from 'realm';
import {USER_PROFILE_LIST_SCHEMA} from "./userProfile";
import {COMPANY_SCHEMA} from "./company";
export const OBJECTIVE_SCHEMA = 'Objective';
export const OBJECTIVE_LIST_SCHEMA = 'Objective[]';

class Objective extends Realm.Object {}
Objective.schema = {
    name: OBJECTIVE_SCHEMA,
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
        type: {
            type: 'string',
            optional: true
        },
        value: {
            type: 'string',
            optional: true
        },
        group: {
            type: 'string',
            optional: true
        },
        method: {
            type: 'string',
            optional: true
        },
        site: {
            type: 'string',
            optional: true
        },
        updatedAt: {
            type: 'date',
            optional: true
        }

    }

};

export default Objective;