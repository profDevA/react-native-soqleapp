import {Map} from 'immutable';
import * as axios from 'axios';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);

import {API_BASE_URL} from './../config';
import * as AppStateActions from './AppReducer';
import store from './../redux/store';

const GET_COMPANY_DETAILS_REQUESTED = 'CompanyState/GET_COMPANY_DETAILS_REQUESTED';
const GET_COMPANY_DETAILS_COMPLETED = 'CompanyState/GET_COMPANY_DETAILS_COMPLETED';
const GET_COMPANY_DETAILS_FAILED = 'CompanyState/GET_COMPANY_DETAILS_FAILED';

const SAVE_COMPANY_DETAILS_REQUESTED = 'CompanyState/SAVE_COMPANY_DETAILS_REQUESTED';
const SAVE_COMPANY_DETAILS_COMPLETED = 'CompanyState/SAVE_COMPANY_DETAILS_COMPLETED';
const SAVE_COMPANY_DETAILS_FAILED = 'CompanyState/SAVE_COMPANY_DETAILS_FAILED';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

// Initial state
const initialState = Map({isLoading: false, details: {}, error: {}});

export function saveCompanyRequest(data) {
    return {
        type: SAVE_COMPANY_DETAILS_REQUESTED,
        payload: data
    };
}

export function saveCompanyCompleted(data) {
    return {
        type: SAVE_COMPANY_DETAILS_COMPLETED,
        payload: data
    };
}

export function saveCompanyFailed(error) {
    return {
        type: SAVE_COMPANY_DETAILS_FAILED,
        payload: error
    };
}

export async function saveCompany(data) {
    try {
        store.dispatch(AppStateActions.startLoading());
        const response = await instance.put(`/company/${data._id}`, data);
        store.dispatch(AppStateActions.stopLoading());
        return saveCompanyCompleted(data);
    } catch (error) {
        bugsnag.notify(error)
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return saveCompanyFailed({code: error.response.status, message:  'Save failed ! Please try again'});
        }
        return saveCompanyFailed({code: 500, message: 'Unexpected error!'});
    }
}

export function getCompanyDetailsRequest(data) {
    return {
        type: GET_COMPANY_DETAILS_REQUESTED,
        payload: data
    };
}

export function getCompanyDetailsCompleted(data) {
    return {
        type: GET_COMPANY_DETAILS_COMPLETED,
        payload: data
    };
}

export function getCompanyDetailsFailed(error) {
    return {
        type: GET_COMPANY_DETAILS_FAILED,
        payload: error
    };
}

export async function getCompanyDetails(data) {
    try {
        store.dispatch(AppStateActions.startLoading());
        const response = await instance.post('/user/register', data);
        store.dispatch(AppStateActions.stopLoading());
        store.dispatch(AppStateActions.loginSuccess(response.data));
        return getCompanyDetailsCompleted(response.data);
    } catch (error) {
        bugsnag.notify(error)
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return getCompanyDetailsFailed(error.response.data);
        }
        return getCompanyDetailsFailed({code: 500, message: 'Unexpected error!'});
    }
}

// Reducer
export default function CompanyStateReducer(state = initialState, action = {}) {
    switch (action.type) {
    case GET_COMPANY_DETAILS_REQUESTED:
        return loop(
            state.set('error', null).set('getCompanyDetailsSuccess', false),
            Effects.promise(getCompanyDetails, action.payload)
        );
    case GET_COMPANY_DETAILS_COMPLETED:
        return state.set('details', action.payload).set('getCompanyDetailsSuccess', true);
    case GET_COMPANY_DETAILS_FAILED:
        return state.set('error', action.payload).set('getCompanyDetailsSuccess', false);
    case SAVE_COMPANY_DETAILS_REQUESTED:
        return loop(
            state.set('error', null).set('saveCompanySuccess', false),
            Effects.promise(saveCompany, action.payload)
        );
    case SAVE_COMPANY_DETAILS_COMPLETED:
        return state.set('details', action.payload).set('saveCompanySuccess', true);
    case SAVE_COMPANY_DETAILS_FAILED:
        return state.set('saveCompanySuccess', false);
    default:
        return state;
    }
}
