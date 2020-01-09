import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { Form, Input, Item, Text } from 'native-base';

import I18n from '../../utils/localize'
import styles from '../../stylesheets/login/step1Styles';


export default class Step1 extends Component {
  render() {
    const { email, onChange, onEmailSubmit } = this.props;

    return (
      <Form>
        <Item rounded style={styles.textInput}>
          {/*<Label style={styles.inputLabel}>Enter your email</Label>*/}
          <Input
            style={styles.textInput}
            value={email}
            placeholder={I18n.t("loginEnterEmail")}
            onChangeText={value => onChange('email', value)}
          />
        </Item>

        <View style={styles.margin10}>
          <ImageBackground style={{ width: '100%', height: 57 }} source={require('../../images/Rectangle.png')}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onEmailSubmit}
            >
              <Text style={styles.loginText}>{I18n.t("next")}</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Form>
    );
  }
}
/* <GoogleSigninButton
            style={{ width: 48, height: 48 }}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Dark}
            onPress={()=>{ gSignin()} }
            disabled={false} />*/
