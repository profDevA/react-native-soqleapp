import React from 'react';
import {Text, View, Image} from 'react-native';

import styles from './../stylesheets/ReceiverChatItemStyles';

export default ReceiverChatItem = props => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>Identity Verification</Text>
            <Image
                source={{uri: 'https://randomuser.me/api/portraits/women/74.jpg'}}
                resizeMode='cover'
                style={styles.itemImage}
            />
        </View>
    );
};