'use strict';

import Realm from 'realm';

export const USER_LOGIN_SCHEMA = 'UserLogin';

class UserLogin extends Realm.Object { }
UserLogin.schema = {
    name: USER_LOGIN_SCHEMA,
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        lastlogin: {
            type: 'string',
            optional: true
        },
        sessionid: {
            type: 'string',
            default: ''
        },
        environment: {
            type: 'string',
            default: ''
        },

    }

};

export default UserLogin;
