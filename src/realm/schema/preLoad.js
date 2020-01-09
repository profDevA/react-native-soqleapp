'use strict';
import Realm from 'realm';

export const PRELOAD_SCHEMA = 'Preload';

class Preload extends Realm.Object {}
Preload.schema = {
   name: PRELOAD_SCHEMA,

    properties: {
    
        title: {
            type: 'string',
            optional: true
        },
        content: {
            type: 'string',
            optional: true
        },
        author: {
            type: 'string',
            optional: true
        },
        date: {
            type: 'string',
            optional: true
        },

    }

};

export default Preload;
