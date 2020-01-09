'use strict';

import Realm from 'realm';
export const CREATOR_SCHEMA = 'Creator';

class Creator extends Realm.Object {}
Creator.schema = {
    name: CREATOR_SCHEMA,
    primaryKey: '_id',
    properties: {
      _id: {
            type: 'string',
            optional: true
        },
        firstName:
        {
          type: 'string' ,
          optional: true
        },
        lastName:
        {
          type: 'string' ,
          optional: true
        },
        pictureURL: {
            type: 'string' ,
            optional: true
        },
        coverBackgroundURL: {
            type: 'string' ,
            optional: true
        },
        refUserId: {
          type: 'string' ,
          optional: true
        }

    }

};

export default Creator;
