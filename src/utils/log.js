import Reactotron from 'reactotron-react-native';

export const log = (preview, msg) =>
  Reactotron.display({
    name: 'LOG',
    preview,
    value: msg,
  });

export const logWarn = (preview, msg) =>
  Reactotron.display({
    name: 'WARN',
    preview,
    value: msg,
  });

export const logError = (preview, msg) =>
  Reactotron.display({
    name: 'ERROR',
    preview,
    value: msg,
  });


export const bench = msg =>
  Reactotron.benchmark(msg);


