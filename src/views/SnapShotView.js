import React, {Component} from 'react';
import {Text, View, FlatList, ImageBackground, TouchableHighlight} from 'react-native';
import {Picker, Form} from 'native-base';

export default class SparkView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  navigateToChatView(){
    this.props.navigation.navigate('Chat');
  }

  render () {

    const uri = this.props.navigation.getParam('uri')
    return (
      <TouchableHighlight onPress={() => this.navigateToChatView()}>
      <View>
        <ImageBackground
          source={{ uri: uri ? uri : "" }}
          style={[
            { width: "100%", height: "100%" },
            { backgroundColor: uri ? "" : "black" }
          ]}
        >

        </ImageBackground>
      </View>
      </TouchableHighlight>
    )
  }
}
