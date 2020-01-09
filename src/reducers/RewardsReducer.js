import {Map} from 'immutable';
import * as axios from 'axios';
import {API_BASE_URL, BUGSNAG_KEY} from '../config';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';
import {STORIES_LIST_API, USER_ACHIEVEMENT_LIST_PATH_API} from '../endpoints';
import { Client } from 'bugsnag-react-native';
const bugsnag = new Client(BUGSNAG_KEY);
const GET_REWARDS_REQUESTED = 'RewardsState/GET_REWARDS_REQUESTED';
const GET_REWARDS_COMPLETED = 'RewardsState/GET_REWARDS_COMPLETED';
const GET_REWARDS_FAILED = 'RewardsState/GET_REWARDS_FAILED';

const _ = require('lodash')

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'}
});
// Initial state
const initialState = Map({isLoading: false, details: {}, error: {}});

export function getRewardsRequest(data) {
  return {
    type: GET_REWARDS_REQUESTED,
    payload: data
  };
}

export function getRewardsCompleted(data) {
  return {
    type: GET_REWARDS_COMPLETED,
    payload: data
  };
}

export function getRewardsFailed(error) {
  return {
    type: GET_REWARDS_FAILED,
    payload: error
  };
}

export async function getRewards(data) {
  try {
    store.dispatch(AppStateActions.startLoading());

    const response = await instance.get('/upgrades', data);

    let endpoint = USER_ACHIEVEMENT_LIST_PATH_API.replace('{}', data.userId);
    let achievements = await instance.get(endpoint);

    let stories = await instance.get(STORIES_LIST_API);

    store.dispatch(AppStateActions.stopLoading());
    return getRewardsCompleted({
      rewards: _.get(response, 'data.list', []),
      achievements: _.get(achievements, 'data.achievements', []),
      stories: _.get(stories, 'data', [])
    });
  } catch (error) {
      bugsnag.notify(error)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return getRewardsFailed(error.response.data);
    }
  }
}

// Reducer
export default function RewardsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_REWARDS_REQUESTED:
      return loop(
        state.set('error', null).set('getRewardsRequested', false),
        Effects.promise(getRewards, action.payload)
      );
    case GET_REWARDS_COMPLETED:
      return state.set('details', action.payload).set('getRewardsSuccess', true);
    case GET_REWARDS_FAILED:
      return state.set('error', action.payload).set('getRewardsSuccess', false);
    default:
      return state;
  }
}
