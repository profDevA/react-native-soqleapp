'use strict';
import Realm from 'realm';
export const REWARD_SCHEMA = 'Reward';

class Reward extends Realm.Object {}
Reward.schema = {
   name: REWARD_SCHEMA,
   properties: {
        type: { type: 'string', optional: true },
        value: { type: 'int', optional: true }
    }
};

export default Reward;
