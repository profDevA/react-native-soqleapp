import { Map } from 'immutable'
import * as axios from 'axios'
import { Effects, loop } from 'redux-loop-symbol-ponyfill'


import { API_BASE_URL, BUGSNAG_KEY } from '../config'
import { USER_TASK_GROUP_LIST_PATH_API, GET_MESSAGE_LIST_API } from './../endpoints'
import * as SessionStateActions from '../session/SessionState'
import * as AppStateActions from './AppReducer'
import store from '../redux/store'
import * as snapshot from '../utils/snapshot'
import * as constants from '../constants'
import { getGroupUserDetails, trackMixpanelLogin, trackError } from '../utils/common'
import MixPanel from 'react-native-mixpanel'
import { Platform ,AsyncStorage,Alert} from 'react-native'
import { Client } from 'bugsnag-react-native'
import {createUserLogin, saveStories, saveWorld, getUserLastLoginInfo, updateUser} from "../realm/RealmHelper";
import Company from "../realm/schema/company";
import UserProfile from "../realm/schema/userProfile";
const bugsnag = new Client(BUGSNAG_KEY)
const REGISTER_REQUESTED = 'UserState/REGISTER_REQUESTED'
const REGISTER_COMPLETED = 'UserState/REGISTER_COMPLETED'
const REGISTER_FAILED = 'UserState/REGISTER_FAILED'

const CHECK_EMAIL_REQUESTED = 'UserState/CHECK_EMAIL_REQUESTED'
const CHECK_EMAIL_COMPLETED = 'UserState/CHECK_EMAIL_COMPLETED'
const CHECK_EMAIL_FAILED = 'UserState/CHECK_EMAIL_FAILED'

const LOGIN_REQUESTED = 'UserState/LOGIN_REQUESTED'
const FACEBOOK_LOGIN_REQUESTED = 'UserState/FACEBOOK_LOGIN_REQUESTED'
const FACEBOOK_LINK_REQUESTED = "UserState/FACEBOOK_LINK_REQUESTED"
const LINKEDIN_LOGIN_REQUESTED = 'UserState/LINKEDIN_LOGIN_REQUESTED'
const LOGIN_COMPLETED = 'UserState/LOGIN_COMPLETED'
 const LINK_COMPLETED = 'UserState/LINK_COMPLETED'
 const QUICK_LOGIN_REQUESTED = 'UserState/QUICK_LOGIN_REQUESTED'
 const QUICK_LOGIN_COMPLETED = 'UserState/QUICK_LOGIN_COMPLETED'
 const QUICK_LOGIN_FAILED = 'UserState/QUICK_LOGIN_FAILED'
const LOGIN_FAILED = 'UserState/LOGIN_FAILED'

const FORGOT_PASSWORD_REQUESTED = 'UserState/FORGOT_PASSWORD_REQUESTED'
const FORGOT_PASSWORD_COMPLETED = 'UserState/FORGOT_PASSWORD_COMPLETED'
const FORGOT_PASSWORD_FAILED = 'UserState/FORGOT_PASSWORD_FAILED'

const GET_COMPANIES_REQUESTED = 'UserState/GET_COMPANIES_REQUESTED'
const GET_COMPANIES_COMPLETED = 'UserState/GET_COMPANIES_COMPLETED'
const GET_COMPANIES_FAILED = 'UserState/GET_COMPANIES_FAILED'

const SAVE_PROFILE_REQUESTED = 'UserState/SAVE_PROFILE_REQUESTED'
const SAVE_PROFILE_COMPLETED = 'UserState/SAVE_PROFILE_COMPLETED'
const SAVE_PROFILE_FAILED = 'UserState/SAVE_PROFILE_FAILED'

const SHARE_CONTENT_REQUESTED = 'UserState/SHARE_CONTENT_REQUESTED'
const SHARE_CONTENT_COMPLETED = 'UserState/SHARE_CONTENT_COMPLETED'
const SHARE_CONTENT_FAILED = 'UserState/SHARE_CONTENT_FAILED'

const LOG_OUT = 'UserState/LOG_OUT'
const GET_USER_TASK_GROUPS_REQUESTED = 'UserState/GET_USER_TASK_GROUPS_REQUESTED'
const GET_USER_TASK_GROUPS_COMPLETED = 'UserState/GET_USER_TASK_GROUPS_COMPLETED'
const GET_USER_TASK_GROUPS_FAILED = 'UserState/GET_USER_TASK_GROUPS_FAILED'
const GET_USER_TASK_GROUPS_COMPLETED_WITH_MESSAGE = 'UserState/GET_USER_TASK_GROUPS_COMPLETED_WITH_MESSAGE'

const GET_MESSAGELIST_REQUESTED = 'UserState/GET_MESSAGELIST_REQUESTED'
const GET_MESSAGELIST_COMPLETED = 'UserState/GET_MESSAGELIST_COMPLETED'
const GET_MESSAGELIST_FAILED = 'UserState/GET_MESSAGELIST_FAILED'

const BLOCK_USER_REQUESTED = 'UserState/BLOCK_USER_REQUESTED'
const BLOCK_USER_COMPLETED = 'UserState/BLOCK_USER_COMPLETED'
const BLOCK_USER_FAILED = 'UserState/BLOCK_USER_FAILED'

const BLOCK_USER_LIST_REQUESTED = 'UserState/BLOCK_USER_LIST_REQUESTED'
const BLOCK_USER_LIST_COMPLETED = 'UserState/BLOCK_USER_LIST_COMPLETED'
const BLOCK_USER_LIST_FAILED = 'UserState/BLOCK_USER_LIST_FAILED'

const BLOCK_UNBLOCK_USER_COMPLETED = 'UserState/BLOCK_UNBLOCK_USER_COMPLETED'

const REPORT_USER_REQUESTED = 'UserState/REPORT_USER_REQUESTED'
const REPORT_USER_COMPLETED = 'UserState/REPORT_USER_COMPLETED'
const REPORT_USER_FAILED = 'UserState/REPORT_USER_FAILED'
const UPDATE_TASK_GROUP = 'UserState/UPDATE_TASK_GROUP'
const UPDATE_USER_DATA = "UserState/UPDATE_USER_DATA"
const FETCH_USER_PROFILE = "UserState/FETCH_USER_PROFILE"
const FETCH_USER_PROFILE_COMPLETED = "UserState/FETCH_USER_PROFILE_COMPLETED"
const FETCH_USER_PROFILE_FAILED = "UserState/FETCH_USER_PROFILE_FAILED"


const GET_USERPOSTS_REQUESTED = 'UserState/GET_USERPOSTS_REQUESTED'
const GET_USERPOSTS_COMPLETED = 'UserState/GET_USERPOSTS_COMPLETED'
const GET_USERPOSTS_FAILED = 'UserState/GET_USERPOSTS_FAILED'

const POST_USERCOMMENTS_REQUESTED = 'UserState/POST_USERCOMMENTS_REQUESTED'
const POST_USERCOMMENTS_COMPLETED = 'UserState/POST_USERCOMMENTS_COMPLETED'
const POST_USERCOMMENTS_FAILED = 'UserState/POST_USERCOMMENTS_FAILED'

const USERLIKE_REQUESTED = 'UserState/USERLIKE_REQUESTED'
const USERLIKE_COMPLETED = 'UserState/USERLIKE_COMPLETED'
const USERLIKE_FAILED = 'UserState/USERLIKE_FAILED'

const ADD_SHARE_OBJECT = 'UserState/ADD_SHARE_OBJECT'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
})

// Initial state
const initialState = Map({ isLoading: false, user: {}, error: {}, companies: [], task_groups: {}, share_content: {} })

export function loginRequest (data) {
  return {
    type: LOGIN_REQUESTED,
    payload: data
  }
}
export function quickLoginRequest (userId,cb) {
  return {
    type: QUICK_LOGIN_REQUESTED,
    payload: {userId,cb},
  }
}


export function facebookLoginRequest (facebookId) {
  return {
    type: FACEBOOK_LOGIN_REQUESTED,
    payload: facebookId
  }
}
  export function facebookLinkRequest (facebookId,facebookData) {
      return {
        type: FACEBOOK_LINK_REQUESTED,
        payload: { facebookId , facebookData},

      }
     }


export function linkedinLoginRequest (linkedinId) {
  return {
    type: LINKEDIN_LOGIN_REQUESTED,
    payload: linkedinId
  }
}

export function loginCompleted (data) {
  return {
    type: LOGIN_COMPLETED,
    payload: data
  }
}

export function quickLoginCompleted (data) {
  return {
    type: QUICK_LOGIN_COMPLETED,
    payload: data
  }
}

export function facebookLinkCompleted (data) {
      return {
        type: LINK_COMPLETED,
        payload: data
      }
   }
export function loginFailed (error) {
  return {
    type: LOGIN_FAILED,
    payload: error
  }
}
export function quickLoginFailed (error) {
  return {
    type: QUICK_LOGIN_FAILED,
    payload: error
  }
}

export function forgotpasswordRequested (data) {
  return {
    type: FORGOT_PASSWORD_REQUESTED,
    payload: data
  }
}

export function forgotpasswordCompleted (data) {
  return {
    type: FORGOT_PASSWORD_COMPLETED,
    payload: data
  }
}

export function forgotpasswordFailed (error) {
  return {
    type: FORGOT_PASSWORD_FAILED,
    payload: error
  }
}

export function saveProfileRequest (data) {
  return {
    type: SAVE_PROFILE_REQUESTED,
    payload: data
  }
}

export function saveProfileCompleted (data) {
  return {
    type: SAVE_PROFILE_COMPLETED,
    payload: data
  }
}

export function saveProfileFailed (error) {
  return {
    type: SAVE_PROFILE_FAILED,
    payload: error
  }
}

export function shareContentRequest (data) {
  return {
    type: SHARE_CONTENT_REQUESTED,
    payload: data
  }
}

export function shareContentCompleted (data) {
  return {
    type: SHARE_CONTENT_COMPLETED,
    payload: data
  }
}

export function shareContentFailed (error) {
  return {
    type: SHARE_CONTENT_FAILED,
    payload: error
  }
}

export function blockUserRequested (data) {
  return {
    type: BLOCK_USER_REQUESTED,
    payload: data
  }
}

export function blockUserCompleted (data) {
  return {
    type: BLOCK_USER_COMPLETED,
    payload: data
  }
}

export function blockUserFailed (error) {
  return {
    type: BLOCK_USER_FAILED,
    payload: error
  }
}
export function blockUnlockUserCompleted (data) {
  return {
    type: BLOCK_UNBLOCK_USER_COMPLETED,
    payload: data
  }
}
export function blockUserListRequested (data) {
  return {
    type: BLOCK_USER_LIST_REQUESTED,
    payload: data
  }
}

export function blockUserListCompleted (data) {
  return {
    type: BLOCK_USER_LIST_COMPLETED,
    payload: data
  }
}


export function blockUserListFailed (error) {
  return {
    type: BLOCK_USER_LIST_FAILED,
    payload: error
  }
}
export function FetchUserProfileCompleted (data) {
  return {
    type: FETCH_USER_PROFILE_COMPLETED,
    payload: data
  }
}
export function fetchUserProfileFailed (error) {
  return {
    type: FETCH_USER_PROFILE_FAILED,
    payload: error
  }
}
export async function getBlockUserList (data) {
  let postData = { 'blockUserIds': data }
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/getBlockedUsers', postData)
    store.dispatch(AppStateActions.stopLoading())
    return blockUserListCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return blockUserListFailed({ code: error.response.status, message: 'Please try again' })
    }
    return blockUserListFailed({ code: 500, message: 'Unexpected error!' })
  }
}
export async function fetchProfileUser (data) {
  let postData = { 'userId': data }
  try {
    //store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(`/fetchUserProfileById?id=${data}`)
    updateUser(response.data);
    //store.dispatch(AppStateActions.stopLoading())
     return FetchUserProfileCompleted(response.data)
  } catch (error) {
    trackError(error)
    //store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return fetchUserProfileFailed({ code: error.response.status, message: 'Please try again' })
    }
    return fetchUserProfileFailed({ code: 500, message: 'fetchProfileUser Unexpected error! code 500' })
  }
}





export async function saveProfile (data) {
  try {
  //  store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/mobile/user-profile', data)
  //  store.dispatch(AppStateActions.stopLoading())
    return saveProfileCompleted(response.data)
  } catch (error) {
    trackError(error)
//    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return saveProfileFailed({ code: error.response.status, message: 'Save failed ! Please try again' })
    }
    return saveProfileFailed({ code: 500, message: 'saveProfile Unexpected error! (Code: 500)' })
  }
}

export async function saveShareContent (data) {
  try {
  //  store.dispatch(AppStateActions.startLoading())
    const response =  await instance.post('/shareContent', data)
  //  store.dispatch(AppStateActions.stopLoading())
    return shareContentCompleted(response)
  } catch (error) {
    trackError(error)
//    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return shareContentFailed({ code: error.response.status, message: 'Save failed ! Please try again' })
    }
    return shareContentFailed({ code: 500, message: 'saveShareContent Unexpected error! (Code: 500)' })
  }
}

export async function forgotPassword (data) {
  let arrayParam = { 'email': data.email, 'password': data.newPassword }
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/auth/reset-password', arrayParam)
    store.dispatch(AppStateActions.stopLoading())
    return forgotpasswordCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return forgotpasswordFailed({
        code: error.response.status,
        message: 'Forgot password failed! Please check your email.'
      })
    }
    return forgotpasswordFailed({ code: 500, message: 'Unexpected error!' })
  }
}

export async function login (data) {
  try {
    store.dispatch(AppStateActions.startLoading())
    let currentLogin = new Date().toString();
    const response = await instance.post('/auth/sign-in', {...data, lastLogin: getUserLastLoginInfo().lastlogin , currentLogin: currentLogin})
    store.dispatch(AppStateActions.stopLoading())

    saveWorld(response.data.world, response.data.user); //save world object into Realm Database.

    store.dispatch(AppStateActions.loginSuccess(response.data.user))
    store.dispatch(AppStateActions.world(response.data.world));

    createUserLogin(response.data.user, currentLogin);

    return loginCompleted(response.data.user)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      let message = "Login failed";
      return loginFailed({ code: error.response.status, message: message })
    }
    return loginFailed({ code: 500, message: 'login Unexpected error! code: 500' })
  }
}
export async function quickLogin ({userId,cb}) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/auth/quick-sign-in', {userId })

    store.dispatch(AppStateActions.stopLoading())

    saveWorld(response.data.world, response.data.user); //save world object into Realm Database.

    store.dispatch(AppStateActions.loginSuccess(response.data.user))
    store.dispatch(AppStateActions.world(response.data.world));

      // createUserLogin(response.data.user, currentLogin);
      if(cb){
        cb();
      }
    return quickLoginCompleted(response.data.user)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    return quickLoginFailed({ code: 500, message: 'quickLogin Unexpected error! code: 500' })
  }
}

export async function facebookLogin (profile) {
  try {
    store.dispatch(AppStateActions.startLoading())
    let currentLogin = new Date().toString();
    const response = await instance.post('/mobile/facebook-login', profile)
    store.dispatch(AppStateActions.stopLoading())
    if (!response.data) {
      return loginFailed({ code: 404, message: 'No Soqqle account associated with your logged Facebook account' })
    }
    store.dispatch(AppStateActions.loginSuccess(response.data))
    store.dispatch(AppStateActions.world(response.data.world));

    saveWorld(response.data.world, response.data.user); //save world object into Realm Database.
    createUserLogin(response.data.user, currentLogin);

    return loginCompleted(response.data)
  } catch (error) {
    console.log(error)
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return loginFailed(error.response.data)
    }
    return loginFailed({ code: 500, message: 'facebookLogin Unexpected error! code: 500' })
  }
}

  export async function facebookLink (profile) {
      try {
        store.dispatch(AppStateActions.startLoading())
        const response = await instance.post('/mobile/facebook-link', profile)
        store.dispatch(AppStateActions.stopLoading())
        if (!response.data) {
          return loginFailed({ code: 404, message: 'No Soqqle account associated with your logged Facebook account' })
        }
        store.dispatch(AppStateActions.loginSuccess(response.data))
        return facebookLinkCompleted(response.data)
      } catch (error) {

        if(error && error.response && error.response.status){
          Alert.alert(
            'Alert',
            error.response.status == 401  ? 'Your Facebook id already linked to some another soqqle account' : 'Unexpected error' ,
            [
              {text: 'OK', onPress: () => {}},
            ],
            {cancelable: false},
          );
        }
        trackError(error)
        store.dispatch(AppStateActions.stopLoading())
        if (error.response && error.response.data) {
          return loginFailed(error.response.data)
        }
        return loginFailed({ code: 500, message: 'Unexpected error!' })
      }
    }
export async function facebookLoginWitthEmail (id) {
  try {
    const response = await instance.post('/auth/facebook/link?id='+id, {})
 } catch (error) {
   trackError(error)
    if (error.response && error.response.data) {
      return loginFailed(error.response.data)
    }
    return loginFailed({ code: 500, message: 'facebookLoginWitthEmail Unexpected error!' })
  }
}

export async function linkedinLogin (profile) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/mobile/linkedin-login', profile)
    store.dispatch(AppStateActions.stopLoading())
    if (!response.data) {
      return loginFailed({ code: 404, message: 'No Soqqle account associated with your logged LinkedIn account' })
    }
    store.dispatch(AppStateActions.loginSuccess(response.data))
    return loginCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return loginFailed(error.response.data)
    }
    return loginFailed({ code: 500, message: 'linkedinLogin Unexpected error! code: 500' })
  }
}

export function registerRequest (data) {
  return {
    type: REGISTER_REQUESTED,
    payload: data
  }
}

export function registerCompleted (data) {
  return {
    type: REGISTER_COMPLETED,
    payload: data
  }
}

export function registerFailed (error) {
  return {
    type: REGISTER_FAILED,
    payload: error
  }
}

export function checkEmailRequest (data) {
  return {
    type: CHECK_EMAIL_REQUESTED,
    payload: data
  }
}

export function checkEmailCompleted (data) {
  return {
    type: CHECK_EMAIL_COMPLETED,
    payload: data
  }
}

export function checkEmailFailed (error) {
  return {
    type: CHECK_EMAIL_FAILED,
    payload: error
  }
}

export async function checkEmail (email) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(`/mobile/profile-exist?email=${email}`)
    store.dispatch(AppStateActions.stopLoading())
    return checkEmailCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return checkEmailFailed(error.response.data)
    }
    return registerFailed({ code: 500, message: 'checkEmail Unexpected error! code: 500' })
  }
}

export async function register (data) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/user/register', data)
    store.dispatch(AppStateActions.stopLoading())
    store.dispatch(AppStateActions.loginSuccess(response.data))
    return registerCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return registerFailed(error.response.data)
    }
    return registerFailed({ code: 500, message: 'register Unexpected error! code: 500' })
  }
}

export function getCompaniesRequest (email) {
  return {
    type: GET_COMPANIES_REQUESTED,
    payload: email
  }
}

export function getCompaniesCompleted (data) {
  return {
    type: GET_COMPANIES_COMPLETED,
    payload: data
  }
}

export function getCompaniesFailed (error) {
  return {
    type: GET_COMPANIES_FAILED,
    payload: error
  }
}

export async function getCompanies (email) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(`/company?email=${email}`)
    store.dispatch(AppStateActions.stopLoading())
    return getCompaniesCompleted(response.data)
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading())
    trackError(error)
    if (error.response && error.response.data) {
      return getCompaniesFailed(error.response.data)
    }
    return getCompaniesFailed({ code: 500, message: 'getCompaniesFailed Unexpected error code: 500!' })
  }
}

/**
 * -----------------------
 * USER TASK GROUPS
 * -----------------------
 */

export const getUserTaskGroupsRequest = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_REQUESTED,
    payload: data
  }
}

export const updateUserTaskGroup = (data) => {
  return {
    type: UPDATE_TASK_GROUP,
    payload: data
  }
}

export const updateUserData = (data) => {
  return {
    type: UPDATE_USER_DATA,
    payload: data
  }
}

export const fetchUserProfile = (data) => {
  return {
    type: FETCH_USER_PROFILE,
    payload: data
  }
}

export const updateUserTaskGroupIds = (data) => {
  return {
    type: UPDATE_TASK_GROUP_IDS,
    payload: data
  }
};

export const getUserTaskGroupsCompleted = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_COMPLETED,
    payload: data
  }
}
export const getUserTaskGroupsCompletedWithMessage = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_COMPLETED_WITH_MESSAGE,
    payload: data
  }
}

export const getUserTaskGroupsFailed = (error) => {
  return {
    type: GET_USER_TASK_GROUPS_FAILED,
    payload: error
  }
}

export async function getUserTaskGroups (data) {
  let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace('{page}', data.page || 1)
  endpoint = endpoint.replace('{type}', '')

  if (data.user_email) {
    endpoint = endpoint.concat('&user_email=', data.user_email)
  }
  let taskGroups = data.previousData || []
  try {
    if (data.load) {
      store.dispatch(AppStateActions.startLoading())
    }
    const response = await instance.get(endpoint)
    store.dispatch(AppStateActions.stopLoading())
    if (data.reset) {
      taskGroups = []
    }
    if (response) {
      const responseData = getGroupUserDetails(response.data)
      const newUserTasks = [...taskGroups, ...responseData.latestUserTaskGroups]
      return getUserTaskGroupsCompleted({
        count: responseData.totalUserTaskGroups,
        taskGroups: newUserTasks,
        page: data.page
      })
    }
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return getUserTaskGroupsFailed(error.response.data)
    }
    return getUserTaskGroupsFailed({ code: 500, message: 'Unexpected error!' })
  }
}
export async function blockUser (data) {
  let arrayParam = { 'loginUserId': data.loginUserId, 'blockedUserId': data.blockedUserId, 'isBlocked': data.isBlocked }
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/blockUnblockUser', arrayParam)
    store.dispatch(AppStateActions.stopLoading())
    return blockUserCompleted(response.data)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return blockUserFailed({
        code: error.response.status,
        message: 'block user failed! Please check your user.'
      })
    }
    return blockUserFailed({ code: 500, message: 'Unexpected error!' })
  }
}
export async function logout () {
  await snapshot.clearSnapshot()
  store.dispatch(SessionStateActions.resetSessionStateFromSnapshot())
  return { type: LOG_OUT }
}

// MessageList
export function getMessageListRequest (teamId) {
  return {
    type: GET_MESSAGELIST_REQUESTED,
    payload: teamId
  }
}

export function getMessageListCompleted (data) {
  return {
    type: GET_MESSAGELIST_COMPLETED,
    payload: data
  }
}

export function getMessageListFailed (error) {
  return {
    type: GET_MESSAGELIST_FAILED,
    payload: error
  }
}

export async function getMessageList (teamId) {
  let endpoint = GET_MESSAGE_LIST_API.replace('{team_id}', ';' + teamId)
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(endpoint)
    store.dispatch(AppStateActions.stopLoading())
    return getMessageListCompleted(response.data)
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading())
    trackError(error)
    if (error.response && error.response.data) {
      return getMessageListFailed(error.response.data)
    }
    return getMessageListFailed({ code: 500, message: 'getMessageList Unexpected error! error 500' })
  }
}
export const reportUserRequested = (data) => {
  return {
    type: REPORT_USER_REQUESTED,
    payload: data
  }
}

export const reportUserCompleted = (data) => {
  return {
    type: REPORT_USER_COMPLETED,
    payload: data
  }
}

export const reportUserFailed = (error) => {
  return {
    type: REPORT_USER_FAILED,
    payload: error
  }
}
export async function reportUser (data) {
  try {
    const response = await instance.post('/ticket', data)
    store.dispatch(AppStateActions.stopLoading())
    return reportUserCompleted(response)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      return reportUserFailed({
        code: error.response.status,
        message: 'Report user failed! Please try again.'
      })
    }
    return reportUserFailed({ code: 500, message: 'reportUser Unexpected error! error 500' })
  }
}

/* Get user posts  */
export function getUserPostWithId (id) {
  return {
    type: GET_USERPOSTS_REQUESTED,
    payload: id
  }
}

export function getUserPostsCompleted (data) {
  return {
    type: GET_USERPOSTS_COMPLETED,
    payload: data
  }
}

export function getUserPostsFailed (error) {
  return {
    type: GET_USERPOSTS_FAILED,
    payload: error
  }
}
export async function getUserPosts (id) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(`${id}/posts`)
    store.dispatch(AppStateActions.stopLoading())
    return getUserPostsCompleted(response.data)
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading())
    trackError(error)
    if (error.response && error.response.data) {
      return getUserPostsFailed(error.response.data)
    }
    return getUserPostsFailed({ code: 500, message: 'Unexpected error! getUserPosts' })
  }
}

/*  Post user comment  */
// export function postCommentWithData(data) {
//   return {
//     type: POST_USERCOMMENTS_REQUESTED,
//     payload: data
//   };
// }

export function userCommentPostRequest (data) {
  return {
    type: POST_USERCOMMENTS_REQUESTED,
    payload: data
  }
}

export function postUserCommentsCompleted (data) {
  return {
    type: POST_USERCOMMENTS_COMPLETED,
    payload: data
  }
}

export function postUserCommentsFailed (error) {
  return {
    type: POST_USERCOMMENTS_FAILED,
    payload: error
  }
}
// Chandni
export async function postsUserComments (data) {
  let arrayParam = data
  let userId = arrayParam.userId
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post(`/${userId}/commentpost`, arrayParam)
    store.dispatch(AppStateActions.stopLoading())
    return postUserCommentsCompleted(response.data)
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading())
    trackError(error)
    if (error.response && error.response.data) {
      return postUserCommentsFailed(error.response.data)
    }
    return postUserCommentsFailed({ code: 500, message: 'postsUserComments Unexpected error! error 500' })
  }
}
/* user like */
/*  Post user comment  */
export function userLikeWithData (data) {
  return {
    type: USERLIKE_REQUESTED,
    payload: data
  }
}

export function userLikeCompleted (data) {
  return {
    type: USERLIKE_COMPLETED,
    payload: data
  }
}

export function userLikeFailed (error) {
  return {
    type: USERLIKE_FAILED,
    payload: error
  }
}

/* ADD_SHARE_OBJECT */

export function addShareObject (item) {
  return {
    type: ADD_SHARE_OBJECT,
    payload: item
  }
}

export async function apiForUserLike (data) {
  let arrayParam = data
  let userId = arrayParam.userId
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post(`/${userId}/likepost`, arrayParam)
    store.dispatch(AppStateActions.stopLoading())
    return userLikeCompleted(response.data)
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading())
    trackError(error)
    if (error.response && error.response.data) {
      return userLikeFailed(error.response.data)
    }
    return userLikeFailed({ code: 500, message: 'apiForUserLike Unexpected error! error 500' })
  }
}
export async function saveTicket (data, cb) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.post('/ticket', data)
    store.dispatch(AppStateActions.stopLoading())
    cb(response)
    // return saveProfileCompleted(response.data);
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response) {
      cb(error.response)
    }
  }
}
export async function getFaq (data, cb) {
  try {
    store.dispatch(AppStateActions.startLoading())
    const response = await instance.get(`/faq?search=${data.search}&page=${data.page}`)
    store.dispatch(AppStateActions.stopLoading())

    cb(response)
  } catch (error) {
    trackError(error)
    store.dispatch(AppStateActions.stopLoading())
    if (error.response && error.response.data) {
      cb(error.response)
    }
  }
}


 const deviceToken =  async ()=>{

   return await AsyncStorage.getItem('device_token');
 };

// Reducer
export default function UserStateReducer (state = initialState, action = {}) {
  switch (action.type) {
    case REGISTER_REQUESTED:
      return loop(
        state.set('error', null).set('registerSuccess', false).set('loginSuccess', false),
        Effects.promise(register, action.payload)
      )
    case REGISTER_COMPLETED:
      return state.set('user', action.payload).set('registerSuccess', true)
    case REGISTER_FAILED:
      return state.set('error', action.payload).set('registerSuccess', false)
    case CHECK_EMAIL_REQUESTED:
      return loop(
        state.set('error', null).set('checkEmailSuccess', false).set('checkEmailResult', null),
        Effects.promise(checkEmail, action.payload)
      )
    case CHECK_EMAIL_COMPLETED:
      return state.set('checkEmailSuccess', true).set('checkEmailResult', action.payload)
    case CHECK_EMAIL_FAILED:
      return state.set('error', action.payload).set('checkEmailSuccess', false).set('checkEmailResult', null)
    case FORGOT_PASSWORD_REQUESTED:
      return loop(
        state.set('error', null).set('forgotpasswordSuccess', false),
        Effects.promise(forgotPassword, action.payload)
      )
    case FORGOT_PASSWORD_COMPLETED:
      return state.set('user', action.payload).set('forgotpasswordSuccess', true)
    case FORGOT_PASSWORD_FAILED:
      return state.set('error', action.payload).set('forgotpasswordSuccess', false)
    case GET_COMPANIES_REQUESTED:
      return loop(
        state.set('error', null).set('getCompaniesSuccess', false),
        Effects.promise(getCompanies, action.payload)
      )
    case GET_COMPANIES_COMPLETED:
      return state.set('companies', action.payload).set('getCompaniesSuccess', true)
    case GET_COMPANIES_FAILED:
      return state.set('error', action.payload).set('getCompaniesSuccess', false)
    case GET_MESSAGELIST_REQUESTED:
      return loop(
        state.set('error', null).set('getMessageListSuccess', false),
        Effects.promise(getMessageList, action.payload)
      )
    case GET_MESSAGELIST_COMPLETED:
      return state.set('messages', action.payload).set('getMessageListSuccess', true)
    case GET_MESSAGELIST_FAILED:
      return state.set('error', action.payload).set('getMessageListSuccess', false)
    case LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(login, action.payload)
      )
    case QUICK_LOGIN_REQUESTED:
        return loop(
          state.set('error', null),
          Effects.promise(quickLogin, action.payload)
        )
    case FACEBOOK_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(facebookLogin, action.payload)
      )
      case FACEBOOK_LINK_REQUESTED:
              return loop(
                state.set('error', null),
                Effects.promise(facebookLink, action.payload)
              )
    case LINKEDIN_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(linkedinLogin, action.payload)
      )
    case LINK_COMPLETED:
            return state.set('user', action.payload);
    case QUICK_LOGIN_COMPLETED:
        return state.set('user', action.payload)
    case QUICK_LOGIN_FAILED:
          return state.set('error', action.payload)
    case LOGIN_COMPLETED:
      const { profile = {} } = action.payload
      const { email = '', character = {}, firstName = '', lastName = '' } = profile
      const { characterName = '' } = character || {}

      // todo: uncomment this after successful integeration of mixpanel sdk
      trackMixpanelLogin(profile);
      /*
      MixPanel.identify(email);
        AsyncStorage.getItem('device_token', (err, deviceToken) => {
             if(err){
               return
             }
            if(Platform.OS === 'ios'){
                MixPanel.set({

                    '$email': email,
                    'house': characterName,
                    'name': `${firstName} ${lastName}`,
                    'platform': Platform.OS,
                    'ios_devices': [`${deviceToken}`],
                    'distinct_id':`${email}`,
                    'token':`${deviceToken}`,
                    'ip':`0`

                });
                MixPanel.addPushDeviceToken(`${deviceToken}`);
            }
            else{
                MixPanel.set({

                    '$email': email,
                    'house': characterName,
                    'name': `${firstName} ${lastName}`,
                    'platform': Platform.OS,
                    'android_devices':[`${deviceToken}`],
                    'distinct_id':`${email}`,
                    'token':`${deviceToken}`,
                    'ip':`${email}`
                });
                MixPanel.setPushRegistrationId(`${deviceToken}`);
                MixPanel.initPushHandling("178636075101");


            }

        });


      MixPanel.track('Sign in', {
        '$email': email,
        '$last_login': new Date(),
        'house': characterName,
        'name': `${firstName} ${lastName}`
      });*/
      return state.set('user', action.payload).set('loginSuccess', true).set('task_groups', {}).set('getUserTaskGroups', false)
    case LOGIN_FAILED:
      return state.set('error', action.payload).set('loginSuccess', false)
    case SAVE_PROFILE_REQUESTED:
      const _id = state.getIn(['user', '_id'])
      return loop(
        state.set('error', null).set('saveProfileSuccess', false),
        Effects.promise(saveProfile, { ...action.payload, _id })
      )
    case SAVE_PROFILE_COMPLETED:
      return state.set('user', action.payload).set('saveProfileSuccess', true)
    case SAVE_PROFILE_FAILED:
      return state.set('saveProfileSuccess', false)


    case SHARE_CONTENT_REQUESTED:
      const user_id = state.getIn(['user', '_id'])
      return loop(
        state.set('error', null).set('shareContentSuccess', false),
        Effects.promise(saveShareContent, { ...action.payload, user_id })
      )
    case SHARE_CONTENT_COMPLETED:
      return state.set('share_content', action.payload).set('shareContentSuccess', true)
    case SHARE_CONTENT_FAILED:
      return state.set('shareContentSuccess', false)



    case LOG_OUT:
      return state.set('user', {}).set('companies', []).set('task_groups', {}).set('getUserTaskGroups', false)
    case GET_USER_TASK_GROUPS_REQUESTED:
      return loop(
        state.set('error', null).set('getUserTaskGroups', false),
        Effects.promise(getUserTaskGroups, action.payload)
      )
    case GET_USER_TASK_GROUPS_COMPLETED:
      return state.set('task_groups', action.payload).set('getUserTaskGroups', true)

    case GET_USER_TASK_GROUPS_COMPLETED_WITH_MESSAGE:
      return state.set('task_groups', action.payload).set('getUserTaskGroups', true)
    case GET_USER_TASK_GROUPS_FAILED:
      return state.set('error', action.payload).set('getUserTaskGroups', false)
    case BLOCK_USER_REQUESTED:
      return loop(
        state.set('error', null).set('blockUserSuccess', false),
        Effects.promise(blockUser, action.payload)
      )
    case BLOCK_USER_COMPLETED:
      return state.set('blockUserSuccess', true)
    case BLOCK_USER_FAILED:
      return state.set('error', action.payload).set('blockUserSuccess', false)
    case BLOCK_UNBLOCK_USER_COMPLETED:
      return state.set('user', action.payload)
    case BLOCK_USER_LIST_REQUESTED:
      return loop(
        state.set('error', null).set('blockUserListSuccess', false),
        Effects.promise(getBlockUserList, action.payload)
      )
    case BLOCK_USER_LIST_COMPLETED:
      return state.set('blockUserList', action.payload).set('blockUserListSuccess', true)
    case BLOCK_USER_LIST_FAILED:
      return state.set('error', action.payload).set('blockUserListSuccess', false)
    case REPORT_USER_REQUESTED:
      return loop(
        state.set('error', null).set('reportUserSuccess', false),
        Effects.promise(reportUser, action.payload)
      )
    case REPORT_USER_COMPLETED:
      return state.set('reportUserResponse', action.payload).set('reportUserSuccess', true)
    case REPORT_USER_FAILED:
      return state.set('error', action.payload).set('reportUserSuccess', false)
    case UPDATE_TASK_GROUP:
      return state.set('task_groups', action.payload).set('getUserTaskGroups', true)
    case  UPDATE_USER_DATA:
        return state.set('user',  action.payload)
    case FETCH_USER_PROFILE:
      return loop(
        state.set('error', null).set('fetchUserLoginSucess', false),
        Effects.promise(fetchProfileUser, action.payload)
      )
    case  FETCH_USER_PROFILE_COMPLETED:
    return state.set('user',  action.payload).set('fetchUserLoginSucess', true)
    case FETCH_USER_PROFILE_FAILED:
    return state.set('error', action.payload).set('fetchUserLoginSucess', false)

    case GET_USERPOSTS_REQUESTED:
      return loop(
        state.set('error', null).set('getUserPostsSuccess', false),
        Effects.promise(getUserPosts, action.payload)
      )
    case GET_USERPOSTS_COMPLETED:
      return state.set('userPosts', action.payload).set('getUserPostsSuccess', true)
    case GET_USERPOSTS_FAILED:
      return state.set('error', action.payload).set('getUserPostsSuccess', false)
    case POST_USERCOMMENTS_REQUESTED:
      return loop(
        state.set('error', null).set('postUserCommentsSuccess', false),
        Effects.promise(postsUserComments, action.payload)
      )
    case POST_USERCOMMENTS_COMPLETED:
      return state.set('commentsPost', action.payload).set('postUserCommentsSuccess', true)
    case POST_USERCOMMENTS_FAILED:
      return state.set('error', action.payload).set('postUserCommentsSuccess', false)
    case USERLIKE_REQUESTED:
      return loop(
        state.set('error', null).set('userLikeSuccess', false),
        Effects.promise(apiForUserLike, action.payload)
      )
    case USERLIKE_COMPLETED:
      return state.set('userLike', action.payload).set('userLikeSuccess', true)
    case USERLIKE_FAILED:
      return state.set('error', action.payload).set('userLikeSuccess', false)
    case ADD_SHARE_OBJECT:
      return state.set('user',  action.payload)
    default:
      return state
  }
}
