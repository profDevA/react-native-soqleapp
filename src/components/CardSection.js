import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';

import {Card} from './Card';
import styles from './../stylesheets/CardSectionStyles';

const CardSection = props => {
    return (
        <View style={[styles.viewContainer, props.style]}>
            {props.children}
        </View>
    );
};

export default CardSection;
