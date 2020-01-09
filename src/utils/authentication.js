import {AsyncStorage} from 'react-native';

const AUTHENTICATION_STORAGE_KEY = 'PepperoniState:Authentication';

export const getAuthenticationToken = () => AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);

export const setAuthenticationToken = async (token) => AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);

export const clearAuthenticationToken = async () => AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
