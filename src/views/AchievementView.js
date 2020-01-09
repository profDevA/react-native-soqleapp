import React, {Component} from 'react';
import {
    Text, View, ScrollView,
    TouchableWithoutFeedback, FlatList, Image
} from 'react-native';
import * as axios from 'axios';
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);

import {API_BASE_URL} from '../config';
import {USER_ACHIEVEMENT_LIST_PATH_API} from '../endpoints';
import {ACHIEVEMENT_IMAGE_BASE_URL} from '../constants';
import styles from '../stylesheets/achievementViewStyles';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

const generateAchievementGroups = data => {
    return data.map(item => {
        return {
            'id': item._id,
            'name': item.name,
            'scope': item.scope,
            'achievements': item._achievements
        };
    });
};

const getAchievementTags = conditions => {
    return conditions.filter(condition => ['Task', 'Action', 'Progression', 'Task and Progression', 'Level'].indexOf(condition.type) > -1);
};

let userId = null;

// TODO: Update this class to new Lifecycle methods
export default class AchievementView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            achievementGroups: [],
            userAchievements: [],
            selectedGroup: null,
            refreshing: false,
            user:this.props.navigation.state.params && this.props.navigation.state.params.user,
        };
        if (!this.state.user){
          this.state.user= this.props.user;
        }
        userId = this.state.user._id || null;
    }

    componentWillMount() {
        const {achievements} = this.props;
        this.fetchUserAchievements();
        if (achievements.length) {
            let achievementGroups = generateAchievementGroups(achievements);
            this.setState({
                achievementGroups,
                selectedGroup: achievementGroups[0].id
            });
        } else {
            this.props.achievementActions.getAchievementsRequest({initialLoad: true});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.achievements.length != this.props.achievements.length) {
            let achievementGroups = generateAchievementGroups(nextProps.achievements);
            this.setState({
                achievementGroups,
                selectedGroup: achievementGroups[0].id
            });
        }
    }

    fetchUserAchievements() {
        if (userId) {
            let endpoint = USER_ACHIEVEMENT_LIST_PATH_API.replace('{}', userId);
            instance.get(endpoint).then(response => {
                this.setState({userAchievements: response.data.achievements || []});
            }).catch(err => {
                bugsnag.notify(err)
            });
        }
    }

    _renderItem = ({item}) => {
        const tags = getAchievementTags(item.conditions);
        return (
            <View style={styles.achievementTile}>
                <View>
                    <Image
                        source={{uri: ACHIEVEMENT_IMAGE_BASE_URL.replace('{}', item._id)}}
                        style={styles.achievementImage}
                        resizeMode='cover'
                    />
                </View>
                <View>
                    <Text style={styles.achievementTitle}>{item.name}</Text>
                    <Text style={styles.achievementText}>{item.description}</Text>
                    <View style={styles.achievementTags}>
                        {tags.map((tag, index) => {
                            return (
                                <Text key={index} style={styles.achievementTag}>
                                    {`${tag.count} ${tag.taskType || tag.levelType || tag.type}`}
                                </Text>
                            );
                        })}
                        <View style={{alignItems:'center'}}>
                            <Text style={styles.achievementStatus}>{this.getAchievementStatus(item._id)}</Text>
                            {this.getAchievementCompletion(item._id) < 100 &&
                                <View style={styles.completionStatus}>
                                    <View style={{width:this.getAchievementCompletion(item._id), ...styles.progressBar}}></View>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    };



    getAchievementStatus(achievementId) {
        let item = this.state.userAchievements.filter(achievement => achievement.achievementId ===
            achievementId)[0] || {};
        return (item.status || 'In Progress').toUpperCase();
    }

    getAchievementCompletion(achievementId) {
        var count = 0;
        var counter = 0;
        let item = this.state.userAchievements.filter(achievement => achievement.achievementId ===
            achievementId)[0] || {};

        if(item.conditions)
        item.conditions.forEach(condition => {
            count += condition.count ? condition.count : 0;
            counter += condition.counter ? condition.counter : 0;
        })

        return count != 0 ? counter*100/count : 0;
    }

    setGroupId(groupId) {
        this.setState({selectedGroup: groupId});
    }

    getGroupAchievements() {
        let achievementGroup = this.state.achievementGroups.filter(group => group.id === this.state.selectedGroup)[0];
        return achievementGroup ? achievementGroup.achievements : [];
    }

    handleRefresh() {
        this.props.achievementActions.getAchievementsRequest();
    }

    render() {
        return (
            <View style={styles.contentView}>
                <View style={styles.groupTagsView}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {this.state.achievementGroups.map(group => {
                            let isSelected = group.id === this.state.selectedGroup;
                            return (
                                <TouchableWithoutFeedback
                                    key={group.id}
                                    onPress={() => this.setGroupId(group.id)}>
                                    <Text
                                        style={isSelected ? {
                                            ...styles.groupTag, ...{
                                                'color': '#FFFFFF',
                                                'backgroundColor': '#1FBEB8'
                                            }
                                        } : styles.groupTag}
                                    >{group.name}</Text>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={{flex: 1, padding: 10,}}>
                    <FlatList
                        data={this.getGroupAchievements()}
                        keyExtractor={(item) => item._id}
                        renderItem={this._renderItem}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                    />
                </View>
            </View>
        );
    }
}
