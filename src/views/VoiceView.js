import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  TouchableOpacity
} from "react-native";

import { RNVoiceRecorder } from 'react-native-voice-recorder'
import { addNewMessage, createTask, createUpdateGroup, createUpdateUserStory, getGroup } from "../realm/RealmHelper";
let recordingPath;
let group;
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    group = this.props.navigation.getParam('group',null);
  console.log('props ',group);
    this.state = {
      visible: false
    }
  }

  _onRecord() {
   let task_id = createTask();
   console.log('task id -------',task_id);
    RNVoiceRecorder.Record({
      format: 'wav',
      onDone: (path) => {
        let Npath = `file://${path}`
        console.log('record done: ' + Npath)
        recordingPath = Npath;
        this.props.navigation.navigate("Chat", {
          task_group_id: group._id,
          taskGroup: group,
          mediaType: 'audio',
          mediaDataURI: recordingPath,
          msgContent: {
            text: 'voicetest',
            //image: null,
            content: 'voicetest',
            group: group,
            taskId: task_id._taskId,
          }
        });
      },
      onCancel: () => {
        console.log('on cancel')
      }
    });
  }

  _onPlay() {
    RNVoiceRecorder.Play({
      path: recordingPath,
      format: "wav",
      onDone: path => {
        console.log("play done: " + path);
      },
      onCancel: () => {
        console.log("play cancelled");
      }
    });
  }

  render() {
    return <View style={styles.mainContainer}>

      <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat')} style={{ flexDirection: 'row-reverse', margin: 20, }}>
        <Text style={{ fontSize: 20}}>X</Text>
      </TouchableOpacity>

      <View style={{  flex: 1,flexDirection: "column", justifyContent: 'center',alignItems: "center" }}>
        <Button onPress={() => {
          this._onRecord()

          // this.setState({ visible: true });
        }} title={'Record'}>
        </Button>

        <Button onPress={() => {
          this._onPlay()

          // this.setState({ visible: true });
        }} title={'Play'}>
        </Button>
      </View>

    </View>;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  }
});