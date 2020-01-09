import React, { Component } from "react";
import { View,  TouchableOpacity, Text } from "react-native";
import styles from '../stylesheets/chatViewStyles';
import {TASK_GROUP_TYPES, TASK_GROUP_OBJECTIVE, MAIN_COLOR} from '../constants';
const fontFamilyName = Platform.OS === 'ios' ? "SFUIDisplay-Regular" : "SF-UI-Display-Regular";


export default class ChatMembersView extends Component {
  render() {
    const {
        group,
        image1,
        image2,
        countExtraMember,
        user
    } = this.props;
    const story = group._userStory;

    const taskGroupType = group.type;

    return (
        <TouchableOpacity style={styles.faceButton}
                    onPress={() => this.props.navigation.navigate('UsersList', {taskGroupData: group, user: user})}>
        <View style={styles.viewShowMember}>
            {image1}
            {image2}
            {countExtraMember > 0 &&
            <View style={styles.plusMemberView}>
                <Text style={styles.plusTxt}>
                    +{countExtraMember}
                </Text>
            </View>
            }
        </View>
    </TouchableOpacity>    );
  }
}
