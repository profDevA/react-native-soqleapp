import React from 'react';
import {Text, View, ScrollView, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { Client } from 'bugsnag-react-native';
import MixPanel from "react-native-mixpanel";
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);

import * as axios from 'axios';
import { API_BASE_URL } from '../config';
import { USER_ACHIEVEMENT_LIST_PATH_API, SAVE_USER_REWARD_API_PATH } from '../endpoints';
import styles from '../stylesheets/rewardsViewStyles';

const SECTIONS = [
    {
        id: 0,
        title: 'Company',
        content: ['Company 1', 'Company 2', 'Company 3']
    },
    {
        id: 1,
        title: 'Sparks',
        content: ['Spark 1', 'Spark 2', 'Spark 3']
    },
    {
        id: 2,
        title: 'Category',
        content: ['Category 1', 'Category 2', 'Category 3']
    },
];

const rewardsImg = require('../../assets/images/rewardsImg.png');

const screenWidth = Dimensions.get('window').width;

const _ = require('lodash');

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: { 'Content-type': 'application/json' }
});

let userId = null;

function generateAchievementGroups(data) {
    return data.map(item => {
        return {
            'id': item._id,
            'name': item.name,
            'scope': item.scope,
            'achievements': item._achievements
        };
    });
}

// TODO: Update this class to new Lifecycle methods
export default class RewardsView extends React.Component {
    constructor(props) {
        super(props);

        this.sortByText = React.createRef();
        this.state = {
            activeSections: [],
            sortByClicked: false,
            sortBy: '',
            rewardsListData: [ ],
            sorter: '_id',
            userAchievements: [],
            achievements: [],
            processing: false,
            userRewards: _.get(this.props, 'user.userRewards', [])
        };
        userId = this.props.user._id || null;
    }

    async fetchUserAchievements() {
        if (userId) {

            let endpoint = USER_ACHIEVEMENT_LIST_PATH_API.replace('{}', userId);
            await instance.get(endpoint).then(response => {
                this.setState({ userAchievements: response.data.achievements || [] });
            }).catch(err => {
                bugsnag.notify(err)
            });

        }
    }

  _renderHeader = section => {
      const isActive = this.state.activeSections[0] === section.id;
      return (
          <View style={styles.header}>
              <Text style={{...styles.headerText, color: !isActive ? '#FFFFFF' : '#1FBEB8'}}>{section.title}</Text>
              <Text style={styles.headerTriangle}>{isActive ? '▲' : '▼'}</Text>
          </View>
      );
  };

  _renderSectionContentItem = ({item}) => {
      return (
          <View style={styles.sectionContentItemWrapper}>
              <TouchableOpacity onPress={() => this.onPressSectionContentItem(item)}>
                  <Text style={styles.sectionContentItemText}>{item}</Text>
              </TouchableOpacity>
          </View>
      );
  };

  onPressSectionContentItem = item => {
      this.setState({
          sortBy: item,
          sortByClicked: false
      });
  };

  _renderContent = section => {
      return (
          <View style={styles.content}>
              <FlatList style={styles.sectionContentList}
                  data={section.content}
                  renderItem={this._renderSectionContentItem}
              />
          </View>
      );
  };

  _updateSections = activeSections => this.setState({ activeSections });

  renderRewardsItem = ({item}) => {
      return (
          <View style={styles.rewardsWrapper}>
              <Image style={styles.rewardsImg} source={rewardsImg} />
              <View style={styles.rewardsInfo}>
                  <View style={styles.rewardsHeader}>
                      <Text style={styles.rewardsName}>{item.name}</Text>
                      <Text style={styles.rewardsSparks}>{_.get(item, 'sparks', 'No') + ' Sparks'}</Text>
                  </View>
                  <Text style={styles.rewardsDescription}>{item.description}</Text>
                  {item.state === 'Complete' ? (
                        item.processing ? (
                            <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 18} style={{ marginLeft: screenWidth - 125 }} color="#1FBEB8" />
                        )
                        : <TouchableOpacity style={{width: 70, marginLeft: screenWidth - 125}} onPress={()=> this.buyReward(item._id)}>
                         <Text style={styles.buyReward}>Buy</Text></TouchableOpacity>
                    )
                    : <Text style={styles.rewardsState}>{item.state}</Text>
                  }
              </View>
          </View>
      );
  };

  buyReward(upgradeId) {
      if(upgradeId && userId && !this.state.processing) {
        const data = {
            "status": "Not Started",
            "currentCounter": 0,
            "_upgrade": upgradeId,
            "user_id": userId
        }
        let { rewardsListData } = this.state;
        const index = _.findIndex(rewardsListData, { '_id': upgradeId });
        if(index > -1) {
            rewardsListData[index]['processing'] = true;
        }
        this.setState({ processing: true, rewardsListData: [...rewardsListData] });
        instance.post(SAVE_USER_REWARD_API_PATH, data).then(response => {
            this.props.user.userRewards.push({reward: response.data});
            this.props.userActions.saveProfileCompleted(this.props.user);
            if(index > -1) {
                rewardsListData[index]['processing'] = false;
                rewardsListData[index]['state'] = 'Bought';
                Mixpanel.trackWithProperties('Buy reward', data);
            }
            this.setState({ processing: false, rewardsListData });
        }).catch(err => {
            bugsnag.notify(err)
            this.setState({ processing: false });
        });
      }
  }

  onPressSortBy = () => {
      this.setState({sortByClicked: !this.state.sortByClicked});
  };

  componentWillMount() {
      this.props.rewardsActions.getRewardsRequest({ initialLoad: true, userId: userId });
  }

  componentWillReceiveProps(nextProps) {
      const nextRewards = _.get(nextProps, 'rewards.rewards', []);
      const prevRewards = _.get(this, 'state.rewardsListData', []);
      if(nextRewards.length == prevRewards.length) {
          return;
      }

      let rewards = nextRewards.map(item => {

        let state = 'Pending';
        if(_.findIndex(this.state.userRewards, (o)=> {

            return o?.reward?._upgrade?._id === item._id
        }) > -1 ) {
            state = 'Bought';
        }
        else if(item.requirement === 'Achievement') {

            const achievement = nextProps.rewards.achievements
                .find(ac => ac.achievementId === item.requirementValue);

            state = _.get(achievement, "status", "Pending");

        } else if (item.requirement === 'Story') {

            const story = nextProps.rewards.stories.find(ac => ac._id === item.requirementValue);

            if (story) {
                if (story._achievements.length === 0) {
                    state = 'No Achievement';
                } else {
                    const achievement = nextProps.rewards.achievements
                        .find(ac => ac.achievementId === story._achievements[0]._id);

                    state = _.get(achievement, "status", "Pending");
                }
            }
        }
        const reward = {
            name: item.name,
            description: item.description,
            sparks: item.sparks,
            _id: item._id,
            state: state
        };

        return reward;
    });

    this.setState({
        rewardsListData: rewards
    });
  }

  render = () => {
      const bottomRadius = this.state.sortByClicked ? 0 : 5;
      const sortButtonBorder = {
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius
      };
      const accordionBorder = {
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: bottomRadius,
          borderTopRightRadius: bottomRadius
      };
      return (
          <View style={styles.container}>
              <ScrollView style={styles.rewardsScrollView}>
                  <TouchableOpacity style={{...styles.sortByButton, ...sortButtonBorder}} onPress={this.onPressSortBy}>
                      <View style={styles.sortByWrapper}>
                          <View style={styles.sortByTextWrapper}>
                              <Text style={styles.sortByText}>Sort By</Text>
                              <Text style={styles.sortBy}>{'  ' + this.state.sortBy}</Text>
                          </View>
                          <Text style={styles.triangle}>{this.state.sortByClicked ? '▲' : '▼' }</Text>
                      </View>
                  </TouchableOpacity>

                  {this.state.sortByClicked &&
            <Accordion
                sections={SECTIONS}
                activeSections={this.state.activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
                style={{...styles.accordion, ...accordionBorder}}
            />
                  }
                  <FlatList style={styles.rewardsList}
                      data={this.state.rewardsListData}
                      renderItem={this.renderRewardsItem}
                  />
              </ScrollView>
          </View>
      );
  }
}
