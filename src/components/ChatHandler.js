import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
  Platform,
  Dimensions,
  Animated,
  Modal,
  FlatList,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard,
  ImageBackground,
} from 'react-native';
import * as axios from 'axios';
import {Thumbnail, Fab, Card, CardItem, Body} from 'native-base';
import {SystemMessage} from 'react-native-gifted-chat';
import Bubble from '../giftedChat/Bubble';
import Video from 'react-native-gifted-chat/node_modules/react-native-video';
import {showMessage} from 'react-native-flash-message';
import {
  EVENT_BRAINDUMP_COMPLETE,
  EVENT_TASK_COMPLETE,
  EVENT_CHAT_MESSAGE,
  EVENT_GROUP_NAME_CHANGE,
  EVENT_LEAVE_GROUP,
} from '../constants';
import {isSystemEvent, isUserEvent, setText} from '../utils/EventUtil';
// When we keyboard appears and rest of screen componenets disappear it messes up calculation for MessageContainer in default gifted chat.
// To compensate that we are using o  ur customized GiftedChat so MessageContainer takes flex:1 size instead dynamic caluclation.
import {GiftedChat} from '../giftedChat/GiftedChat';
import InputToolbar from '../giftedChat/InputToolbar';
import {BUGSNAG_KEY, API_BASE_URL} from '../config';
import {
  getMessages,
  getuuid,
  flashMessage,
  getProfileImg,
  trackMixpanel,
  trackError,
} from '../utils/common';

import {
  addMessage,
  updateConversation,
  createUpdateGroup,
} from '../realm/RealmHelper';
import {getSocket} from '../utils/socket';
let {height, width} = Dimensions.get('window');

import {submitScreenShot} from '../utils/braindump';
import _ from 'lodash';
import BaseComponent from '../views/BaseComponent';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'},
});
const deviceWidth = Dimensions.get('window').width;

export default class ChatHandler extends BaseComponent {
  //static flashMessage = message => showMessage({message, type: MAIN_COLOR});

  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      messages: props.messages,
    };
    console.log("user!" , props.user);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    if (this.props.setMessageReceiveListener) {
      this.props.setMessageReceiveListener(this.onReceivedMessage);
    }
    if (this.props.setOnSend) {
      this.props.setOnSend(this.onSend);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    return (
     !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state)
    );
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //    !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
  //   );
  // }

  _keyboardDidShow = () => {
    this.setState({keyboardShow: true});
  };

  _keyboardDidHide = () => {
    this.setState({keyboardShow: false});
  };

  setMessagesWithOrder(msgs) {
    msgs.sort((x, y) => {
      return x.time - y.time;
    });
    msgs.reverse();
    this.setState({messages: msgs});
  }

  onReceivedMessage(message) {
    console.log("MSGTEST received message")
    let group = this.state.group;
    // reject messages intended for other groups
    if (message.receiver !== group._team._id) {
      return;
    }
    super.onReceivedMessage(message); //calls the parent received message which will update the task object if the event is suitable
    let setId = message._id;
    let setMsgId = message.msgId;
    if (!setId) {
      setId = getuuid();
    }
    if (!setMsgId) {
      setMsgId = getuuid();
    }
    let uri;

    let messageReceived = [],
      messageProperty = {
        // _id: Math.random(),
        sender: message.sender,
        receiver: message.receiver,
        _id: setId,
        msgId: setMsgId,
        createdAt: new Date(),
        text: setText(group, message),
        time: message.time,
      };
      if (message.sender && message.type != 'server:message') {

        console.log("MSGTEST sender is found", message.sender)
        console.log("group users ", this.state.group._team.users)
        let senderProfile;

        this.state.group._team.users.forEach(teamMember=>{ //searches the group for matching sender id
          if (teamMember._id.toString() == message.sender.toString()){
            senderProfile = teamMember;
          }
        });

        uri = getProfileImg(senderProfile.profile); // derives the avatar

        if (senderProfile){
          messageProperty = {
            ...messageProperty,
            user: {
              _id: message.sender,
              name: senderProfile.profile.firstName
              ? senderProfile.profile.firstName
              : '' + ' ' + senderProfile.profile.lastName
              ? senderProfile.profile.lastName
              : '',
              avatar: uri,
            },
          };
        }

        // if (message.userProfile && message.userProfile.name && message.userProfile.avatar){
        //   messageProperty = {
        //     ...messageProperty,
        //     user: message.userProfile,
        //   };
        // }
      }

    //let messageProperty= mapMessageProperty(group, this.props.user, message);

    // reject messages from myself where size of the group is > 1. This is because right now when there is multi users somehow theres a spam broadcast msg.
    // if (
    //   message.userProfile &&
    //   message.userProfile._id === this.props.user._id &&
    //   group._team.users.length > 1 &&
    //   message.fromMe
    // ) {
    //   return;
    // }

    // let isUnBlocked = true,
    //   blockUserIds = this.props.user.blockUserIds;
    // if (
    //   message.user &&
    //   blockUserIds.length > 0 &&
    //   blockUserIds.indexOf(message.user._id) !== -1
    // ) {
    //   isUnBlocked = false;
    // }

    if (
      message.type == EVENT_LEAVE_GROUP &&
      message.refId == this.props.user._id
    ) {
      alert('You have been kicked!');
      this.props.navigation.navigate({
        routeName: 'UserTaskGroup',
        user: this.props.user,
      });
    }

    if (isSystemEvent(message.type)) {
      messageProperty = {...messageProperty, system: true};
    }

    if (message.image) {
      messageProperty = {...messageProperty, image: message.image};
    }

    if (message.isJoining) {
      messageProperty = {...messageProperty, isJoining: true};
    }

    if (message.isReward) {
      messageProperty = {...messageProperty, isReward: message.isReward};
    }

    messageReceived.push(messageProperty);
    this._storeMessages(messageReceived, message.msgId);

  }

  onSend(messages = [], contentMsg, mediaType = '', mediaDataURI = '') {

    let generateduuid = getuuid();
    let group = this.state.group;
    const user = this.props.user;
    let userDetails= {
      _id: user._id,
      name: user.profile.firstName,
      avatar: `https://ui-avatars.com/api/?name=${user.profile.firstName}+${user.profile.lastName}`,
    };

    if (contentMsg) { //message with content


      messages[0]._id = generateduuid;
      messages[0].createdAt = new Date();
      messages[0].time = new Date();
      messages[0].text = contentMsg.text;
      messages[0].user = userDetails;
      if(mediaType == "video"){
          messages[0].video = mediaDataURI
              // messages[0].image = contentMsg.image
      }else if(mediaType == "audio"){
          messages[0].audio = mediaDataURI
      }else{

          messages[0].image = contentMsg.image
      }


      // messages[0].image = contentMsg.image
      messages[0].status = 'loading';
      // this.setState(previousState => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, messages),
      //   };
      // });

      if (this.state.group._team && this.state.group._team.conversation) {
        this.state.group._team.conversation.messages.push[messages[0]];
      }

      submitScreenShot(
        contentMsg.taskId,
        contentMsg.text,
        contentMsg.content,
        contentMsg.group,
        user,
        this.props.userActions,
        mediaDataURI != '' ? mediaDataURI : contentMsg.image,
        mediaType,
      )
        .then(() => {
        //  flashMessage('SUCCESS');
          console.log("success! "  )
          var msgs = this.state.messages;
          this.setState({messages: []});
          var i = msgs.indexOf(messages[0]);
          messages[0].status = 'success';
          msgs[i] = messages[0];

          this.setMessagesWithOrder(msgs);
        })
        .catch(error => {
          console.log("error ", error)
      //    flashMessage('FAILED!');

          var msgs = this.state.messages;
          this.setState({messages: []});
          var i = msgs.indexOf(messages[0]);
          messages[0].status = 'failed';
          msgs[i] = messages[0];

          this.setMessagesWithOrder(msgs);
        });
    } else { //simple message
      messages[0].sender = this.props.user._id;
      messages[0].receiver = group._team._id;
      messages[0].chatType = 'GROUP_MESSAGE';
//      messages[0].userProfile = this.props.user;
      messages[0].time = new Date().toISOString();
      messages[0].groupId = group._id;
      messages[0].type = EVENT_CHAT_MESSAGE;
      messages[0].user = userDetails;

      let convoid;
      if (group._team && group._team.conversation) {
        convoid = group._team.conversation._id;
      }

      getSocket().emit('client:message', {
        msgId: generateduuid, //special id to synch server and client ids
        sender: messages[0].sender,
        receiver: messages[0].receiver,
        chatType: messages[0].chatType,
        type: messages[0].type,
        conversationId: convoid,
//        userProfile: messages[0].userProfile,
        time: messages[0].time,
        groupId: messages[0].groupId,
        message:
          messages && messages[0] && messages[0]['text']
            ? messages[0]['text']
            : '',
      });
      const {taskGroups: {taskGroups = []} = {}} = this.props;
      const id = this.props.navigation.state.params.task_group_id;
      //what is the below for?!?! god knows
      let index = id && taskGroups.findIndex(t => t._id === id);
      if (index > -1) {
        let oldMessages = [];
        if (
          taskGroups &&
          taskGroups[index] &&
          taskGroups[index]._team &&
          taskGroups[index]._team.conversation &&
          taskGroups[index]._team.conversation.messages
        ) {
          oldMessages = [...taskGroups[index]._team.conversation.messages];
        }
        oldMessages.unshift({
          createdAt: new Date(),
          time: new Date().toISOString(), //new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),//new Date(),
          sender: this.props.user._id,
          receiver: this.state.group._team._id,
          chatType: 'GROUP_MESSAGE',
          type: EVENT_CHAT_MESSAGE,
//          userProfile: this.props.user,
          _id: new Date(),
          message:
            messages && messages[0] && messages[0]['text']
              ? messages[0]['text']
              : '',
        });
        taskGroups[index]['messages'] = oldMessages;
        this.props.userActions.getUserTaskGroupsCompletedWithMessage({
          taskGroups,
        });
      }


    }

      this._storeMessages(messages, generateduuid);
  }

  _storeMessages(messages, generateduuid) {
    var newMsg = [...messages];
    const parseISOString = s => {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    };

    /**
    Any messagse without time would break the order of messages.
    So, the time argument is added to the message.
    And to parse parseISOString is for the case that message with iso string "2019-10-05T10:00:00:000Z" is inserted.
    */

    if (
      typeof newMsg[0].time === 'string' &&
      newMsg[0].time.indexOf('-') >= 0
    ) {
      newMsg[0].time = parseISOString(newMsg[0].time);
    } else if (!newMsg[0].time) {
      newMsg[0].time = new Date();
      messages[0].time = new Date();
    }

    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, newMsg),
      };
    });

    if (this.state.group._team && this.state.group._team.conversation) {
      this.state.group._team.conversation.messages.push[newMsg[0]];
    }

    addMessage(this.state.group, this.props.user, messages[0], generateduuid); //the current message is the first message
  }

  render() {
    const {user} = this.props;

    return (
      <View style={[{flex: 1}]}>
        <GiftedChat
          keyboardShouldPersistTaps={'never'}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          extraData={this.props.extraData}
          user={user}
          showUserAvatar={true}
          renderMessageVideo={props => this.renderMessageVideo(props)}
          renderInputToolbar={this._renderGiftedToolBar}
          showAvatarForEveryMessage={true}
          onLongPress={(context, message) => this.reportConfirmation(message)}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
        />
      </View>
    );
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            borderBottomRightRadius: 0,
            backgroundColor: '#4FBFBA',
          },
          left: {
            borderBottomLeftRadius: 0,
            backgroundColor: '#56478C',
          },
        }}
        textProps={{style: {color: 'white'}}}
      />
    );
  }

  renderMessageVideo(props) {
    return (
      //   <Video  source={{uri: props.currentMessage.video}}   {...props}
      //    style={{
      //    height: 100,
      //    width: 200
      //   } }
      //   />

      <TouchableOpacity
        onPress={() => {
          this.setState(
            {renderModalVideo: true, videoModalUri: props.currentMessage.video},
            () => {},
          );
        }}
        style={{}}>
        <Video
          {...props}
          paused={true}
          ref={r => {
            this.player = r;
          }}
          source={{uri: props.currentMessage.video}}
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          resizeMode="cover"
          onLoad={onLoad => {
            this.player.seek(onLoad.duration);
          }}
          paused={false}
          repeat={false}
          muted={true}
        />
      </TouchableOpacity>
    );
  }

  renderSystemMessage(props) {
    if (props.currentMessage.isReward || props.currentMessage.isJoining) {
      return (
        <SystemMessage
          {...props}
          wrapperStyle={{
            backgroundColor: 'white',
            width: deviceWidth,
          }}
          textStyle={{
            textAlign: 'center',
            color: 'grey',
          }}
        />
      );
    } else {
      return (
        <SystemMessage
          {...props}
          wrapperStyle={{
            backgroundColor: '#dd79c9',
            width: deviceWidth,
          }}
          textStyle={{
            textAlign: 'center',
            color: 'white',
          }}
        />
      );
    }
  }

  reportConfirmation(message) {
    if (message.user._id != this.props.user._id) {
      var alertTitle = 'Report?',
        alertMessage = 'Are you sure to report this chat?';
      Alert.alert(alertTitle, alertMessage, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => this.callApiToReportUser(message)},
      ]);
    }
  }

  callApiToReportUser(message) {
    let username = '';
    if (message.username) {
      username = message.username;
    }
    let arrayParam = {
      title: 'Reported User from Chat',
      description: `The user ${message.user._id} ${message.user.name} has been reported by ${this.props.user.profile.lastName} ${this.props.user.profile.lastName} in the usergroup chat ${this.state.group._id}`,
      reporter: `${this.props.user._id}`,
      status: 'Open',
      priority: 3,
      history: [],
      comments: [message.text],
    };
    const {userActions} = this.props;
    userActions.reportUserRequested(arrayParam);
    this.setState({isReport: true});
  }

  _renderGiftedToolBar = inputToolbarProps => {
    // we customized the gifted chat and input toolbar because of bugs with either the bar missing or a big space when entering text.
    // refer to https://github.com/FaridSafi/react-native-gifted-chat/issues/1102
    // using our customized InputToolbar with textInput position as relative instead of absolute
    // with position relative it always move up when keyboard appears instead of disappering behind it.
    return <InputToolbar {...inputToolbarProps} />;
  };
}
