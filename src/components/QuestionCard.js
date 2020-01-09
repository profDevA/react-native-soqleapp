import React from 'react';
import {Platform, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './../stylesheets/QuestionCardStyle';

const QuestionCard = props => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.header} >
            	<Text numberOfLines={5} ellipsizeMode="tail" style={styles.headerText}>{props.header}</Text>
            	<View style={styles.headerIcon}>
            		<Icon name="heart" size={20} color="#56478c" />
            	</View>
            </View>
            <View style={styles.content} >
            	<Text numberOfLines={5} ellipsizeMode="tail" style={styles.contentText}>{props.content}</Text>
            </View>
        </View>
    );
};

export default QuestionCard;
