import React, { Component } from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import I18n from '../utils/localize';
import {CountDownText} from 'react-native-countdown-timer-text';


export default class QuotaOver extends Component {
  render() {
    const {
        secondsUntilMidnight
    } = this.props;

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="timer" size={16} color="#ffffff"/>
            <CountDownText
                style={{color: '#ffffff', fontSize: 13}}
                countType='date'
                auto={true}
                afterEnd={() => {
                }}
                timeLeft={secondsUntilMidnight}
                step={-1}
                startText={I18n.t("startTask")}
                endText={I18n.t("startTask")}
                intervalText={(date, hour, min, sec) => hour + ':' + min + ':' + sec}
            />
        </View>
    );
  }
}
