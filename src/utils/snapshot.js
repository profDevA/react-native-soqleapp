import {AsyncStorage} from 'react-native';
import {fromJS} from 'immutable';

const STATE_STORAGE_KEY = 'PepperoniAppTemplateAppState:Latest';

export const resetSnapshot = async () => {
    const state = await rehydrate();
    if (state) {
        return fromJS(state);
    }

    return null;
};

export const saveSnapshot = async state => await persist(state.toJS());

export const clearSnapshot = async () => await clear();

/**
 * Saves provided state object to async storage
 *
 * @returns {Promise}
 */
const persist = async (state) => {
    try {
        await AsyncStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Error persisting application state', e);
    }
};

/**
 * Reads state object from async storage
 *
 * @returns {Promise}
 */
const rehydrate = async () => {
    try {
        const state = await AsyncStorage.getItem(STATE_STORAGE_KEY);
        return state
            ? JSON.parse(state)
            : null;
    } catch (e) {
        console.error('Error reading persisted application state', e);
        return null;
    }
};

const clear = async () => {
    try {
        await AsyncStorage.removeItem(STATE_STORAGE_KEY);
    } catch (e) {
        console.error('Error clearing peristed application state', e);
    }
};
