import React from 'react';
import {Text, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './../stylesheets/HeaderStyles';

export default RewardModalHeader = props => {
    return (
        <View style={{...styles.header, ...props.headerStyle, backgroundColor: '#9600A1'}}>
            <TouchableOpacity onPress={props.onLeft} style={styles.headerLeft}>
                <Icon
                    name='close'
                    style={{...styles.headerBackIcon, ...props.headerIconStyle}}
                />
            </TouchableOpacity>
            <Text style={{...styles.headerTitle, ...props.headerTitleStyle}}>{props.title}</Text>
            <TouchableOpacity
                disabled={!props.rightText}
                style={styles.headerRight}
                activeOpacity={0.8}
                onPress={props.onRight}
            >
                <Text style={{...styles.headerRightText, ...props.headerRightTextStyle}}>{props.rightText}</Text>
            </TouchableOpacity>
        </View>
    );
};
