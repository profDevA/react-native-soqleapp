'use strict';

import Realm from 'realm';
export const PROFILE_SCHEMA = 'Profile';
class Profile extends Realm.Object {}
Profile.schema = {
    name: PROFILE_SCHEMA,
    properties: {
        firstName: { type: 'string', optional: true },
        lastName: { type: 'string', optional: true },
        education: { type: 'string', optional: true },
        title: { type: 'string', optional: true },
        bio: { type: 'string', optional: true },
        experience: { type: 'string', optional: true },
        interests: { type: 'string', optional: true },
        skills: { type: 'string', optional: true },
        level: { type: 'int', optional: true},
        currentLevelXP: { type: 'int', optional: true },
        totalXP: { type: 'int', optional: true },
        balance: { type: 'int', optional: true },
        numTokens: { type: 'int', optional: true },
        rating: { type: 'int', optional: true },
        pictureURL: { type: 'string', optional: true },
        coverBackgroundURL: { type: 'string', optional: true },
        email: { type: 'string', optional: true },
    }

};

export default Profile;