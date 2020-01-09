import React, {Component} from 'react';
import SocketIOClient from 'socket.io-client';
import * as axios from 'axios';
import {CHAT_SOCKET_URL} from '../endpoints';
import {API_BASE_URL, BUGSNAG_KEY} from '../config';
import {isUpdateGroupEvent} from '../utils/EventUtil';
import {getGroupUserDetails} from '../utils/common';
import {UpdateUserTaskGroup, getUserTaskGroupsById} from '../utils/grouputil';
import {createUpdateGroup} from '../realm/RealmHelper';
import {Client} from 'bugsnag-react-native';
const bugsnag = new Client(BUGSNAG_KEY);
import { initSocket,getSocket } from "../utils/socket";
import { AppState } from 'react-native';
import { trackError } from '../utils/common'


const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'},
});

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
  }

  componentDidMount() {
    let user = this.props.user;
    AppState.addEventListener('change', this._handleAppStateChange);

    let query = `userID=${user._id}&username=${user._id}&firstName=${
      user.profile.firstName ? user.profile.firstName : ''
    }&lastName=${
      user.profile.lastName ? user.profile.lastName : ''
    }&userType=test`;
    initSocket(query);
    //ws.send("hi this is a test socket");
    //ws.onmessage = ev => { console.log(ev.data) };
    getSocket().on('server:message', this.onReceivedMessage);

    /*let user = this.props.user;
        let query = `userID=${user._id}&username=${user._id}&firstName=${user.profile.firstName ? user.profile.firstName : ''}&lastName=${user.profile.lastName ? user.profile.lastName : ''}&userType=test`;
        socket= initSocket(query);
        socket.on('server:message', this.onReceivedMessage);*/
  }

  _handleAppStateChange = nextAppState => {
    console.log('APPSTATECHG nextAppState ', nextAppState);
    console.log('APPSTATECHGcurrent appstate ', this.state.appState);
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('APPSTATECHG App has come to the foreground!');
      this.refreshAppFromBackground();
    }

    this.setState({appState: nextAppState});
  };

  refreshAppFromBackground() {
    //update the app with components needed after coming alive.
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _fetchMessages(email) {
    const data = {
      email: email,
    };

    this.props.messageActions.getMessages(data); //messageActions is undefind because its not bound with BaseComponent
  }

  onReceivedMessage(message) {
    // alert('some message');
    if (isUpdateGroupEvent(message.type) && message.groupId) {
      this.refreshUserTask(message.groupId);
    }
  }

  refreshUserTask = groupId => {
    instance
      .get(`${API_BASE_URL}/getGroupWithMessage?_id=${groupId}`)
      .then(response => {
        let group = response.data;
        createUpdateGroup(group);
        this.setState({group: group});
      })
      .catch(error => {
        console.log(error);
        bugsnag.notify(error);
      });
  };

  //save message in redux.
  _storeMessages(messages) {}
}
