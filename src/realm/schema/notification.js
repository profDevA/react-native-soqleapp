'use strict';
import Realm from 'realm';
export const NOTIFICATION_SCHEMA = 'Notification';

class Notification extends Realm.Object {}
Notification.schema = {
   name: NOTIFICATION_SCHEMA,
   primaryKey: '_id',
   properties: {
        _id: {
          type: 'string',
        },
        _userId: {
            type: 'string',
            optional: true,
        },
        type: {
            type: 'string',
            optional: true,
        },
        message: {
            type: 'string',
            optional: true,
        },
        sent: {
            type: 'date',
            optional: true,
        },
        received: {
            type: 'date',
            optional: true,
        },
        read: {
            type: 'date',
            optional: true,
        },

    }
};

export default Notification;
