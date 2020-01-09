import {Map} from 'immutable';

let configuration = Map();

export const setConfiguration = (name, value) => configuration = configuration.set(name, value);

export const setAll = properties => configuration = configuration.merge(properties);

export const unsetConfiguration = name => configuration = configuration.delete(name);

export const getConfiguration = key => {
    if (!configuration.has(key)) {
        throw new Error('Undefined configuration key: ' + key);
    }

    return configuration.get(key);
};
