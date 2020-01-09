import store from './../redux/store';
import {List, Map} from "immutable";
import {Effects, loop} from "redux-loop-symbol-ponyfill";
import * as AppStateActions from "./AppReducer";
import * as axios from "axios";
import {API_BASE_URL, BUGSNAG_KEY} from "../config";
import {Client} from "bugsnag-react-native";
const bugsnag = new Client(BUGSNAG_KEY);


const ADD_MESSAGE = 'ADD_MESSAGE';
const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
const MESSAGE_LIST = 'MESSAGE_LIST';
const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
const GET_MESSAGES_FAILED = 'GET_MESSAGES_FAILED';
const GET_MESSAGES_COMPLETED = 'GET_MESSAGES_COMPLETED';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

export function getMessagesRequest(body) {

    return {
        type: GET_MESSAGES_REQUEST,
        payload: body
    };
}

export function getMessagesCompleted(data) {
    return {
        type: GET_MESSAGES_COMPLETED,
        payload: data
    };
}

export function getMessagesFailed(error) {
    return {
        type: GET_MESSAGES_FAILED,
        payload: error
    };
}

export async function getMessages(data) {
    try {
        store.dispatch(AppStateActions.startLoading());
        const response = await instance.get(`${API_BASE_URL}/userTaskGroupWithMessage?user_email=${data.email}`);
        store.dispatch(AppStateActions.stopLoading());
        return getMessagesCompleted(response.data);
    } catch (error) {
        bugsnag.notify(error);
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return getMessagesFailed({ code: error.response.status, message: 'Can not get questions!' });
        }
        return getMessagesFailed({ code: 500, message: 'Unexpected error!' });
    }
}

// Initial state
const initialState = Map({messages: List([]), error: Map({}), getMessagesSuccess: false});

// Reducer
export default function MessagesReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_MESSAGES_REQUEST:
            return loop(
                state.set('error', {}).set('getMessagesSuccess', false),
                Effects.promise(getMessages, action.payload)
            );
        case GET_MESSAGES_COMPLETED:
            return state.set('messages', action.payload).set('getMessagesSuccess', true);
        case GET_MESSAGES_FAILED:
            return state.set('messages', []).set('getMessagesSuccess', false);
        default:
            return state;
    }
}