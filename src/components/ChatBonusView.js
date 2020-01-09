import React, { Component } from "react";
import { View,  TouchableOpacity, Text } from "react-native";
import I18n from '../utils/localize';
import QuotaOver from "./QuotaOver";
import styles from '../stylesheets/chatViewStyles';
import {TASK_GROUP_TYPES, TASK_GROUP_OBJECTIVE, MAIN_COLOR} from '../constants';
const fontFamilyName = Platform.OS === 'ios' ? "SFUIDisplay-Regular" : "SF-UI-Display-Regular";

export default class ChatBonusView extends Component {
    
  render() {
    // const {group, keyboardShow} = this.props;

    // const isRepeating = this.props.isTaskRepeating();
    // const isQuotaOver = this.props.isTaskQuotaOver();
    //const isCompleted = this.isTaskCompleted();
    // const uri = getProfileImg (this.props.user.profile);
    // const user = {
    //     _id: this.props.user._id,
    //     name: this.props.user.profile.firstName ? this.props.user.profile.firstName : '' + ' ' + this.props.user.profile.lastName ? this.props.user.profile.lastName : '',
    //     avatar: uri,
    // };
    
    const {
        secondsUntilMidnight,
        group,
        isRepeating,
        isQuotaOver,
        processing
    } = this.props;
    const story = group._userStory;

    const taskGroupType = group.type;

    return (
        <View>
        <View style={{
            backgroundColor: '#3c1464',
            alignContent: 'center',
            justifyContent: 'center',
            padding: 10
        }}>
            <Text style={styles.storyDetailTagTitle}>You Gain.</Text>
            <View style={styles.storyDetailTags}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.storyDetailTag}>50 xp</Text>
                    {story.reward && (
                        taskGroupType === TASK_GROUP_TYPES.CHALLENGE ? (
                            <Text style={styles.storyDetailTag}>
                                {`${story.rewardValue || ''} ${story.reward} `}
                            </Text>
                        ) : (
                            <Text style={styles.storyDetailTag}>
                                {`${story.reward.value || ''} ${story.reward.type} `}
                            </Text>
                        )
                    )}
                    {group.leftBonusSparks ? (
                        <View style={styles.storyBonusSparkTag}>
                            <Text
                                style={styles.storyBonusSparkTagText}>Bonus: {group.leftBonusSparks < 1 ? 0 : group.leftBonusSparks} sparks</Text>
                            {story.reducePerRefresh && (
                                <Text
                                    style={styles.storyBonusSparkTagTextHighlight}>-{story.reducePerRefresh}</Text>
                            )}
                        </View>
                    ) : null}

                    <TouchableOpacity
                        onPress={() => this.props.goToTask(story)}
                        disabled={isQuotaOver}>
                        <View style={
                            {
                                ...styles.storyDetailActionTag,
                                backgroundColor: isQuotaOver ? '#0000004D' : '#1FBEB8',
                            }
                        }>
                            {processing ? (
                                <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 18}
                                                   style={{paddingHorizontal: 14}} color="#ffffff"/>
                            ) : (isQuotaOver ? (
                                <QuotaOver secondsUntilMidnight={secondsUntilMidnight} >
                                </QuotaOver>
                                    )
                                    : (
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 13,
                                            fontFamily: fontFamilyName
                                        }}>

                                            {isRepeating ? I18n.t("startTask") + (group.taskCounter + 1) + '/' + group._userStory.quota
                                                : I18n.t("startTask")}

                                        </Text>
                                    )
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
        <View style={{backgroundColor: '#9600A1', height: 5, width: '100%'}}/>
    </View>
    );
  }
}
