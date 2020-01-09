import React from 'react';
import {Text, View, Image} from 'react-native';

import styles from './../stylesheets/SenderChatItemStyles';

export default SenderChatItem = props => {
    return (
        <View style={styles.item}>
            <Image
                source={{uri: 'https://randomuser.me/api/portraits/women/74.jpg'}}
                resizeMode='cover'
                style={styles.itemImage}
            />
            <Text style={styles.itemText}>Hello Matt! I am ready to help you! What topic do you have a question?</Text>
        </View>
    );
};
