'use strict';
import Realm from 'realm';

export const EMAIL_SCHEMA = 'Email';
export const EMAIL_LIST_SCHEMA = 'Email[]';

class Email extends Realm.Object {}
Email.schema = {
   name: EMAIL_SCHEMA,
    properties: {
        accepted: {
            type: 'bool',
            optional: true
        },
        email: {
            type: 'string',
            optional: true
        }

    }

};

export default Email;
