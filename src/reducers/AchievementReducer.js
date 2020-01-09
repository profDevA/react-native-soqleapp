import {Map} from 'immutable';
import * as axios from 'axios';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';

import {API_BASE_URL} from './../config';
import {ACHIEVEMENT_LIST_PATH_API} from './../endpoints';
import * as AppStateActions from './AppReducer';
import store from './../redux/store';
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);

const GET_ACHIEVEMENTS_REQUESTED = 'AchievementState/GET_ACHIEVEMENTS_REQUESTED';
const GET_ACHIEVEMENTS_COMPLETED = 'AchievementState/GET_ACHIEVEMENTS_COMPLETED';
const GET_ACHIEVEMENTS_FAILED = 'AchievementState/GET_ACHIEVEMENTS_FAILED';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

// Initial state
const initialState = Map({isLoading: false, details: [], error: {}});


export function getAchievementsRequest(data) {
    return {
        type: GET_ACHIEVEMENTS_REQUESTED,
        payload: data
    };
}

export function getAchievementsCompleted(data) {
    return {
        type: GET_ACHIEVEMENTS_COMPLETED,
        payload: data
    };
}

export function getAchievementsFailed(error) {
    return {
        type: GET_ACHIEVEMENTS_FAILED,
        payload: error
    };
}

export async function getAchievements(data) {
    try {
        if (data.initialLoad) {
            store.dispatch(AppStateActions.startLoading());
        }
        const response = await instance.get(ACHIEVEMENT_LIST_PATH_API);
        store.dispatch(AppStateActions.stopLoading());
        return getAchievementsCompleted(response.data);
    } catch (error) {
        bugsnag.notify(error)
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return getAchievementsFailed(error.response.data);
        }
        return getAchievementsFailed({code: 500, message: 'Unexpected error!'});
    }
}

// Reducer
export default function AchievementStateReducer(state = initialState, action = {}) {
    switch (action.type) {
    case GET_ACHIEVEMENTS_REQUESTED:
        return loop(
            state.set('error', null).set('getAchievementsSuccess', false),
            Effects.promise(getAchievements, action.payload)
        );
    case GET_ACHIEVEMENTS_COMPLETED:
        return state.set('details', action.payload).set('getAchievementsSuccess', true);
    case GET_ACHIEVEMENTS_FAILED:
        return state.set('error', action.payload).set('getAchievementsSuccess', false);
    default:
        return state;
    }
}
