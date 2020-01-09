'use strict';
//import Realm from 'realm';
import realm from '../RealmHelper';

export const COMPANY_SCHEMA = 'Company';
export const COMPANY_LIST_SCHEMA = 'Company[]';

class Company extends Realm.Object {
  static getAllCompanies () {
    return realm.objects(COMPANY_SCHEMA)
  }

  static schema = {
      name: COMPANY_SCHEMA,
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
          emails: {
              type: 'string[]',
              default: []
          },
          google: {
              type: 'bool',
              optional: true
          },

      }

  };
}
// Company.schema = {
//     name: COMPANY_SCHEMA,
//     primaryKey: '_id',
//     properties: {
//         _id: {
//             type: 'string',
//             optional: true
//         },
//         name: {
//             type: 'string',
//             optional: true
//         },
//         email: {
//             type: 'string[]',
//             default: []
//         },
//
//     }
//
// };

export default Company;
