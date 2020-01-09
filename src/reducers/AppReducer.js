import {Map} from 'immutable';
import * as axios from 'axios/index';

import {API_BASE_URL} from './../config';

const START_LOADING = 'AppState/START_LOADING';
const STOP_LOADING = 'AppState/STOP_LOADING';
const LOGIN_SUCCESS = 'AppState/LOGIN_SUCCESS';
const LOGOUT = 'AppState/LOGOUT';
const WORLD = 'AppState/WORLD';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

// Initial state
const initialState = Map({loading: false, user: Map({}), error: Map({}), world: Map({})});

export function startLoading() {
    return {
        type: START_LOADING
    };
}

export function stopLoading() {
    return {
        type: STOP_LOADING
    };
}

export function loginSuccess(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: user
    };
}

export function world(data) {
    return {
        type: WORLD,
        payload: data
    };
}

export function logout() {
    return {
        type: LOGOUT
    };
}

// Reducer
export default function AppStateReducer(state = initialState, action = {}) {
    switch (action.type) {
    case START_LOADING:
        return state.set('loading', true);
    case STOP_LOADING:
        return state.set('loading', false);
    case LOGIN_SUCCESS:
        return state.set('user', action.payload);
    case LOGOUT:
        return state.set('user', {});
    case WORLD:
        return state.set('world', action.payload);
    default:
        return state;
    }
}
