/** @format */
import "react-native-gesture-handler";
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry, View } from 'react-native';
/***
 * APP ENTRY
 */
import AppContainer from './src/containers/AppContainer';
import PushHandler from './src/views/PushHandler'
import store from './src/redux/store';
import { name } from './app.json';
import MixPanel from 'react-native-mixpanel';
import { BUGSNAG_KEY, MIXPANEL_TOKEN, API_BASE_URL } from "./src/config";
//import {setLanguage} from "./src/utils/localize";
import codePush from "react-native-code-push";
import { Client, Configuration } from 'bugsnag-react-native';
import { pushNotifificationInit } from "./src/utils/pushnotification";
import { gInit } from "./src/controllers/google";
const config = new Configuration();
config.apiKey = BUGSNAG_KEY;
config.codeBundleId = "95"
config.appVersion = require('./package.json').version;
console.disableYellowBox = true;
import Reactotron from 'reactotron-react-native'
import NetworkInfo from './src/components/NetworkInfo'

import { AsyncStorage, Platform } from 'react-native';

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };


class SoqqleApp extends Component {

    componentDidMount(): void {
        pushNotifificationInit();
        gInit();
        //todo: uncomment this after successful integeration of mixpanel sdk
        console.log("language set ");
        //  setLanguage();
        Reactotron
            .configure()
            .useReactNative()
            .connect();
        MixPanel.sharedInstanceWithToken(MIXPANEL_TOKEN);
        //  setTimeout(() => {
        if ((!(__DEV__)) && (API_BASE_URL === 'https://betaapi.soqqle.com')) {   // only run in production

            codePush.sync({
                updateDialog: null,
                installMode: codePush.InstallMode.ON_NEXT_RESTART
            })
        }
        //  }, 7000)



        const bugsnag = new Client(config);

    }




    render() {
        return (
            <Provider store={store}>
                <NetworkInfo />
                <AppContainer />
            </Provider>
        );
    }
}
SoqqleApp = codePush(codePushOptions)(SoqqleApp);

AppRegistry.registerComponent(name, () => SoqqleApp);
