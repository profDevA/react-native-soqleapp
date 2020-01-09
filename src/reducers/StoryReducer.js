import {Map, List} from 'immutable';
import * as axios from 'axios/index';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';

import {API_BASE_URL} from './../config';
import store from './../redux/store';
import * as AppStateActions from './AppReducer';
import {STORY_CHALLENGES_LIST_API_PATH} from '../endpoints'
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);
const GET_STORIES_REQUESTED = 'StoriesState/GET_STORIES_REQUESTED';
const GET_STORIES_COMPLETED = 'StoryState/GET_STORIES_COMPLETED';
const GET_STORIES_FAILED = 'TaskState/GET_STORIES_FAILED';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

// Initial state
const initialState = Map({stories: List([]), error: Map({}), getStoriesSuccess: false});

export function getStoriesRequest(body) {

    return {
        type: GET_STORIES_REQUESTED,
        payload: body
    };
}

export function getStoriesCompleted(data) {
    return {
        type: GET_STORIES_COMPLETED,
        payload: data
    };
}

export function getStoriesFailed(error) {
    return {
        type: GET_STORIES_FAILED,
        payload: error
    };
}

export async function getStories(data) {
    try {
        store.dispatch(AppStateActions.startLoading());
        const response = await instance.post(STORY_CHALLENGES_LIST_API_PATH, data);
        store.dispatch(AppStateActions.stopLoading());
        return getStoriesCompleted(response.data);
    } catch (error) {
        bugsnag.notify(error)
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return getStoriesFailed({ code: error.response.status, message: 'Can not get questions!' });
        }
        return getStoriesFailed({ code: 500, message: 'Unexpected error!' });
    }
}

// Reducer
export default function StoryReducer(state = initialState, action = {}) {
    switch (action.type) {
    case GET_STORIES_REQUESTED:
        return loop(
            state.set('error', {}).set('getStoriesSuccess', false),
            Effects.promise(getStories, action.payload)
        );
    case GET_STORIES_COMPLETED:
        return state.set('stories', action.payload).set('getStoriesSuccess', true);
    case GET_STORIES_FAILED:
        return state.set('stories', []).set('getStoriesSuccess', false);
    default:
        return state;
    }
}
