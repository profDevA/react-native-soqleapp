'use strict';

//import Realm from 'realm';
import realm from '../RealmHelper';
import {PROFILE_SCHEMA} from './profile';
import {TEAM_LIST_SCHEMA} from './team'
import {SHARE_LIST_SCHEMA} from "./share";
export const USER_PROFILE_SCHEMA = 'UserProfile';
export const USER_PROFILE_LIST_SCHEMA = 'UserProfile[]';

class UserProfile extends Realm.Object {


  static getUser (id) {
    let user;
    realm.write(() => {
      try {
        user = realm.objects(USER_PROFILE_SCHEMA).filtered("_id == " + `'${id}'`);
        if (user){
          return user[0];
        }

      } catch (e) {
        trackError(e)
        console.log(e);

      }
    })
    return user[0];
  }

   isAdmin () {
    let adminCompany;
      let companies = this.company;
      companies.forEach(company=>{
        if (company.emails.length>0){
          company.emails.forEach(email=>{
              if (email.trim() == this.profile.email.trim()){
                adminCompany= company;
              }
          })
        }
      });
        return adminCompany;
  }


    static schema = {
        name: USER_PROFILE_SCHEMA,
        primaryKey: '_id',
        properties: {
            _id: {
                type: 'string',
                optional: true
            },
            profile: {
                type: PROFILE_SCHEMA,
                optional: true
            },
            facebookID: {
                type: 'string',
                optional: true
            },
            linkedInID: {
                type: 'string',
                optional: true
            },
            roadmaps: {
                type: 'string[]',
                optional: true
            },
            // _teams: {
            //     type: 'Team[]',
            //     default: []
            // },
            userTaskGroupIds: {
                type: 'string[]',
                default: []
            },
            shares: {
                type: SHARE_LIST_SCHEMA,
                default: []
            },
            company: {
                type: 'Company[]',
                default: []
            }
        }
      }
}



export default UserProfile;
