import React from 'react';
import {Platform, Text, View} from 'react-native';

import styles from './../stylesheets/CardStyles';

const Card = props => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

export default Card;
