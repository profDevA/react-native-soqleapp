import React, { Component } from "react";
import UserProfile, {USER_PROFILE_SCHEMA} from '../realm/schema/userProfile';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
    Image,
    SafeAreaView,
    Text,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Animated,
    FlatList,
    Platform,
    ScrollView,
    StatusBar,
    Alert,
    TextInput
} from 'react-native';
import { Thumbnail, Input, Item } from 'native-base';
import {post} from "../controllers/http"
//import Video from 'react-native-video';
import * as axios from 'axios';
import { widthPercentageToDP as wp, widthPercentageToDP, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import _ from 'lodash';
import TextImage from './TextImage';
import LinearGradient from 'react-native-linear-gradient';
import * as grouputil from "../utils/grouputil";
import MixPanel from 'react-native-mixpanel';
import { NavigationActions, StackActions } from "react-navigation";
import Modal from 'react-native-modal';
import * as Constants from '../constants';
import {
    CHALLENGE_IMAGE_BASE_URL,
    STORY_IMAGE_BASE_URL,
    STORY_VIDEO_BASE_URL,
    TASK_GROUP_TYPES
} from "../constants";
import { API_BASE_URL, LOGO2 } from "../config";
import {
    SAVE_USER_TASK_GROUP_API,
    TEAM_UPDATE_API,
    USER_ACHIEVEMENT_LIST_PATH_API,
    USER_TASK_GROUP_LIST_PATH_API,
    CHAT_SOCKET_URL,
    CREATE_TEAM_GROUP_API
} from "../endpoints";
import styles from "../stylesheets/storyViewStyles";
import CustomText from "../components/CustomText";
import { Client } from "bugsnag-react-native";
import { BUGSNAG_KEY } from "../config";
import { patchUserStory, patchFeid, patchQuestions, patchPushToken } from "../utils/patchutil";
import { getGroupUserDetails, getuuid, getProfileImg, trackMixpanel, trackError, patchConversation, timeDifference } from "../utils/common";
import BaseComponent from "./BaseComponent";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import codePush from "react-native-code-push";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
const bugsnag = new Client(BUGSNAG_KEY);
const fontFamilyName = Platform.OS === 'ios' ? "SFUIDisplay-Regular" : "SF-UI-Display-Regular";
import { getSocket } from "../utils/socket";
import QRScanModal from "../components/QRScanModal";
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get('window').height // full width
import FastImage from 'react-native-fast-image';
import Loader from '../components/Loader';
import {
    Placeholder, PlaceholderLine,
    Fade,
    Shine,
    PlaceholderMedia
} from "rn-placeholder";
let scan = false;
let userTaskGroupsArray = [];

import I18n from '../utils/localize'

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: { "Content-type": "application/json" }
});

let selectedItemId = null;
let selectedItemType = null;
let selectedItemBonusSparks = null;
let path = 3;
let tem = [1, 2, 3];

import { filterStories } from "../utils/WorldUtil";
import { getUserLastLoginInfo, getUserById} from "../realm/RealmHelper";
import { getStories, createUpdateGroup, updateUser, createUpdateStories } from "../realm/RealmHelper";
import { getUserTaskGroupsById } from "../utils/grouputil";
import NavigationService from '../navigator/NavigationService';

import MysteryCard from '../components/MysteryCard';
import reactotron from "reactotron-react-native";
import SideMenu from "react-native-side-menu";
import SideBarMenu from "../components/SideBarMenu";
import UnlockStory from "../components/UnlockStory";
import UnlockStoryConfirmation from "../components/UnlockStoryConfirmation";
import JoinModal from "../components/JoinModal";
import IsDuplicateModal from "../components/IsDuplicateModal";
import StoryDetailModal from "../components/StoryDetailModal";
// import console = require("console");

// TODO: Update this class to new Lifecycle methods
// TODO: Split this render component into smaller one
class StoryView extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            challengesFetching: true,
            challengesAndStories: [],
            myGroups: [],
            currentSlideIndex: 0,
            modalVisible: false,
            processing: false,
            tasksFetching: false,
            userTaskGroups: [],
            numberOfLines: 2,
            imageBaseUrl: '',
            callPlaceholder: true,
            item: {},
            joinModal: false,
            count: {},
            storyItemTextStyle: styles.storyItemImage,
            animatedStyle: [],
            animatedHeight: new Animated.Value(styles.storyItemImage.height),
            isStoryLocked: false,
            currentGroupPageNumber: 1,
            totalUserTaskGroups: 0,
            firstY: 0,
            showQRScanModal: false,
            qrCodeScanned: '',
            isDuplicate: false,
            isSidebarOpen: false,
            showUnlock: false,
            isStoryUnlocked: false,
            code:"",
            isDiscoverUnlocked: false,
            unlockedStories:null,
            isAdmin:null,
        };
        this.loadStoriesAndRefreshTask = this.loadStoriesAndRefreshTask.bind(this);
        this.onCloseQRScanModal = this.onCloseQRScanModal.bind(this);
        this.onDetectQRcodeData = this.onDetectQRcodeData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.stories &&
            !_.isEqual(nextProps.stories, this.state.challengesAndStories)
        ) {

            this._loadStories();
        }
    }

     componentDidMount() {

        super.componentDidMount();

        let filteredStories = filterStories(this.props.user);

        let loggedInUser = UserProfile.getUser(this.props.user._id);
        let adminCompany;
        if (loggedInUser){
          adminCompany = loggedInUser.isAdmin();
        }
          let heights = new Array(filteredStories.length);
          heights.fill(new Animated.Value(styles.storyItemImage.height), 0);
          this.setState({
              challengesAndStories: filteredStories,
              animatedStyle: heights,
              isAdmin:adminCompany,
          });

    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
        );
    }

    goToDashboardScreen = () =>
        this.props.navigation.navigate({ routeName: "Dashboard" });
    goToProfileScreen = () =>
        this.props.navigation.navigate({ routeName: "FeedView" });
    goToUserTasksScreen = () =>
        this.props.navigation.navigate({ routeName: "UserTaskGroup" });


    itemPressed = (id, type, bonusSparks, maxnum) => {
        userTaskGroupsArray = [];
        if (this.state.isStoryLocked) {
            return //if stories are locked then just bypass the onPress.
        }
        this.setModalVisible(
            !this.state.modalVisible,
            id,
            type,
            bonusSparks,
            maxnum
        );
    }

    itemCategoryCartPressed = (id, type, bonusSparks, maxnum) => {
        this.itemPressed(id, type, bonusSparks, maxnum);
    }

    onMorePressed = () => {
        if (this.state.morePressed) {
            this.setState({ morePressed: false })
        } else {
            this.setState({ morePressed: true })
        }
    }



    onCloseQRScanModal() {
        this.setState({ showQRScanModal: false });
    }
    onShowQRScanModal = () => {
        scan = false
        this.setState({ showQRModal: true, showQRScanModal: true });
    }

    onDetectQRcodeData(QRCodeData) {
        if (scan == false) {
            this.setState({ showQRModal: false, showQRScanModal: false })
            this.setState({ qrCodeScanned: QRCodeData }, () => {
                this.setState({ joinModal: true })
                this.onCloseQRScanModal();
                scan = true
            });
        }

    }

    refreshAppFromBackground() {
        //update the app with components needed after coming alive.
        //console.log("APPSTATECHG storyview refreshAppFromBackground")
    }

    /*Loads stories from REALMDB through the helper.
    The stories are additionally filtered via the filterStories method, a worldutil method.*/
    _loadStories = () => {
      let filteredStories = filterStories(this.props.user);

        let heights = new Array(filteredStories.length);
        heights.fill(new Animated.Value(styles.storyItemImage.height), 0);
        this.setState({
            challengesAndStories: filteredStories,
            animatedStyle: heights
        });

    };

    // patchGroups = () => {
    //     if (!this.props.user.userTaskGroupIds) { return }
    //
    //     if (this.props.user.userTaskGroupIds && this.props.user.userTaskGroupIds.length == 0) {
    //         return
    //     }
    //
    //     let getGroupByUserData = grouputil.getUserTaskGroupsById(this.props.user.userTaskGroupIds);
    //     if (getGroupByUserData) {
    //         getGroupByUserData.forEach(async group => {
    //             if (!group._userStory) {
    //                 await patchUserStory(group._id);
    //             }
    //
    //             if (group._userStory && !group._userStory._feid) { //the feid represents the front end ID and could be empty because it was only added at a later version
    //                 await patchFeid(group._id);
    //             }
    //         })
    //     }
    //
    // }

    refreshUser = () => {
        this.props.userActions.fetchUserProfile(this.props.user._id);
    }

    loadStoriesAndRefreshTask() {
        this._loadStories(); //will load from realmdb via the utility

    }

    setModalVisible(visible, itemId, itemType, itemBonusSparks, maxnum = 0) {
        this.setState({
            modalVisible: visible,
            tasksFetching: !!itemId,
            userTaskGroups: [{addnew:true}]
        });
        selectedItemId = itemId;
        selectedItemType = itemType;
        selectedItemBonusSparks = itemBonusSparks;
        if (itemId) {
            // alert('9')
            this.setState({ callPlaceholder: true })
            this.fetchUserTaskGroupsBasedOnStory(itemId, maxnum);
        }
    }

    _onMomentumScrollBegin = () => this.setState({ onEndReachedCalledDuringMomentum: false });

    render_FlatList_footer = () => {
        var footer_View = [1, 2, 3, 4, 5];
        let displayView = footer_View.map((s) => {
            return (
                <View >
                    <Placeholder
                        Animation={Shine}
                    >
                        <PlaceholderMedia
                            style={{
                                borderRadius: 10,
                                marginRight: hp('2%'),
                                height: height * 15 / 100,
                                width: width * 25 / 100,
                            }} />

                    </Placeholder>
                </View>
            )
        })

        return (
            <View style={{ flexDirection: 'row' }}>
                {displayView}
            </View>
        );

    };



    handleGroupPageIncrement() {
        if (!this.state.onEndReachedCalledDuringMomentum) {
            this.setState({
                onEndReachedCalledDuringMomentum: true, callPlaceholder: true, currentGroupPageNumber: this.state.currentGroupPageNumber + 1,
            }, () => {
                this.fetchUserTaskGroupsBasedOnStory(selectedItemId, 0);
            });
        }

    }

    handleGroupPageDecrement() {
        if (this.state.currentGroupPageNumber <= 1) {
            return;
        }
        this.setState({
            currentGroupPageNumber: this.state.currentGroupPageNumber - 1,
        }, () => {
            this.fetchUserTaskGroupsBasedOnStory(selectedItemId, 0);
        });
    }

    // TODO: We should define this outside view
    fetchUserTaskGroupsBasedOnStory(storyId, maxnum) {
        let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace("{page}", this.state.currentGroupPageNumber);
        endpoint = endpoint.replace("{type}", selectedItemType);
        endpoint = endpoint.concat("&page_size=", 6);
        endpoint = endpoint.concat("&type_id=", storyId);
        endpoint = endpoint.concat("&user_email=", this.props.user.profile.email);
        endpoint = endpoint.concat("&filter_user=", true);
        //a user can be in multiple teams and the filter for company will be in effect for all teams
        // endpoint = endpoint.concat('&_teams=', this.props.user._teams.map((team) => {
        //     return team._id
        // }).join(','));
        // endpoint = endpoint.concat('&filter_company=', true);
        instance
            .get(endpoint)
            .then(response => {
                if (response) {
                    let groupsize = response.data.length;
                    if (userTaskGroupsArray.length > 0) {
                        let newData = response.data;
                        userTaskGroupsArray = userTaskGroupsArray.concat(newData);
                    } else {
                        userTaskGroupsArray = response.data;
                    }
                    if (userTaskGroupsArray[0] && !userTaskGroupsArray[0].addnew) {
                        let AddNew = {
                            addnew: true,
                        }
                        userTaskGroupsArray.unshift(AddNew);
                    }
                    this.setState({
                        userTaskGroups: userTaskGroupsArray,
                        tasksFetching: false,
                        totalUserTaskGroups: groupsize,
                        callPlaceholder: false
                    });

                }
            })
            .catch(error => {
                trackError(error);
                this.setState({ tasksFetching: false, callPlaceholder: false });


            });
    }

    addUserToTeam = (teamId, taskGroupId) => {
        if (!this.state.processing) {
            this.setState({ processing: true });
            let data = {
                email: this.props.user.profile.email,
                taskGroupId,
                users: this.props.user._id,
                BonusSparks: selectedItemBonusSparks
            };
            this.setState({ joinModal: false });

            trackMixpanel('Joined a team');
            fetch(TEAM_UPDATE_API.replace('{}', teamId), { //Routes.put('/team/:id', TeamsController.update_team);
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(response => {

                    this.setState({ modalVisible: false, processing: false, joinModal: false });
                    let _userTaskGroups = this.state.userTaskGroups;
                    // Added 1% to bonus spark while new user join
                    if (_userTaskGroups) {
                        response.leftBonusSparks = (selectedItemBonusSparks + selectedItemBonusSparks * 0.01 * response._team.users.length).toFixed(2);
                    }

                    if (!response._team.conversation) { //may happen to deprecated groups
                        patchConversation(response);
                    }

                    if (this.props.user && response && response._team) {
                        getSocket().emit('client:message', {
                            msgId: getuuid(),
                            sender: this.props.user._id,
                            receiver: response._team._id,
                            chatType: 'GROUP_MESSAGE',
                            type: Constants.EVENT_TEAM_JOIN,
                            conversationId: response._team.conversation._id,
                            groupId: response._id,
                            time: new Date().toISOString(),
                            message: this.props.user.profile.firstName + ' joined the group',
                            isJoining: true,
                            userProfile: this.props.user
                        });
                    }
                    createUpdateGroup(response);
                    this.props.navigation.navigate("Chat", {
                        task_group_id: taskGroupId, //response._id,
                        taskUpdated: false,
                        taskGroup: response,
                        userTaskGroups: this.state.userTaskGroups // fetched from userTaskGroupWithMessages
                    });


                    //this.props.userActions.fetchUserProfile(this.props.user._id);
                    this.refreshUser()

                })
                .catch(error => {
                    this.setState({ processing: false, joinModal: false });
                    trackError(error);
                });
        }
    }

    createGroup() {

        if (this.state.isDuplicate) {
            this.setState({ isDuplicate: false });
        }

        if (!this.state.processing) {
            this.setState({ processing: true });
            const { profile } = this.props.user;
            let groupData = {
                type: selectedItemType,
                _typeObject: selectedItemId,
                _user: this.props.user._id,
                ...(selectedItemBonusSparks
                    ? {
                        leftBonusSparks: selectedItemBonusSparks,
                        lastBonusSparksRefreshed: new Date()
                    }
                    : {})
            };

            let data = {
                name: `${profile.firstName} - team`,
                emails: {
                    'accepted': true,
                    'email': profile.email
                },
                users: this.props.user._id,
                groupData: groupData
            };

            trackMixpanel('Create a new Team')
            instance.post(CREATE_TEAM_GROUP_API.replace('{}/', ''), data).then(response => {
                this.setState({ processing: false, modalVisible: false });
                selectedItemId = null;
                selectedItemType = null;


                createUpdateGroup(response.data);

                this.refreshUser()
                this.props.navigation.navigate("Chat", {
                    task_group_id: response.data._id,
                    taskUpdated: false,
                    taskGroup: response.data
                });
            }).catch((error) => {
                this.setState({ processing: false })
                trackError(error)
            });
        }
    }

    //create new team with group
    initiateNewGroup() {
        let ownedGroup;
        const myGroups = getUserTaskGroupsById(
            this.props.user.userTaskGroupIds
        );
        if (myGroups) {
            myGroups.forEach(group => {
                if (group._user && (group._user._id === this.props.user._id) && (group._userStory.name === this.state.item.name)) {
                    ownedGroup = group;
                    this.setState({
                        isDuplicate: true,
                    })
                }
            });
        }

        if (!ownedGroup) {
            this.createGroup();
        }
    }

    onPressGoToGroup() {
        const myGroups = getUserTaskGroupsById(
            this.props.user.userTaskGroupIds
        );
        let ownedGroup;
        if (myGroups) {
            myGroups.forEach(group => {
                if (group._user && (group._user._id === this.props.user._id) && (group._userStory.name === this.state.item.name)) {
                    ownedGroup = group;
                    this.setState({
                        isDuplicate: true,
                    })
                }
            });
        }
        this.setModalVisible(!this.state.modalVisible);
        this.setState({
            isDuplicate: false,
        })
        let dataSent = {
            task_group_id: ownedGroup._id,
            taskUpdated: false
        }
        NavigationService.navigate('Chat', { params: dataSent });
    }

    onRequestCloseModal() {
        this.setModalVisible(!this.state.modalVisible);
        this.setState({
            currentGroupPageNumber: 1,
            totalUserTaskGroups: 0,
        });
    }
    // sidebar blocked user
    goUserListView = () => {
        const { userActions } = this.props;
        userActions.blockUserListRequested(this.props.user.blockUserIds);
    };

    //sidebar logout
    logout = () => {
        this.props.userActions.logout();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Login" })]
        });
        this.props.navigation.dispatch(resetAction);
    };

    //sidebar got to export view
    goExportView() {
        NavigationService.navigate('ExportView');
    }

    openSidebar() {
        this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
    }



    errorImg = (index) => {
        let count = { ...this.state.count };
        count[index] = count[index] || 0;
        count[index] = false;
        this.setState({ count });
    }

    imgLoaded = (index) => {
        let count = { ...this.state.count };
        count[index] = count[index] || 0;
        count[index] = true;
        this.setState({ count });
    }

    renderAbstractOrDescription = (item) => {
        if (this.state.morePressed) {
            return item.description
        } else {
            if (item.abstract) {
                return item.abstract.substring(0, 240)
            } else {
                return item.description.substring(0, 240)
            }
        }
    }

    calculateDateConstraints(startDate, expNo) {
        // returns everything in time primitives (milliseconds)
        let now = new Date().getTime();
        let unlock = new Date(startDate).getTime();
        let expiry = new Date(startDate).getTime() + expNo * 24 * 60 * 60 * 1000;
        return { now, unlock, expiry };
    }

    _onHandlerStateChange = (event) => {
        if (this.state.firstY = 0) {
            this.setState({ firstY: event.nativeEvent.translationY })
        }
        if (event.nativeEvent.oldState === State.ACTIVE) {
            if (event.nativeEvent.translationY > this.state.firstY) {
                this.onRequestCloseModal()
            }
        }

    }

    ListEmpty = () => {
        return (
            //View to show when list is empty
            <View style={{ flexDirection: 'row' }} >
                <TouchableOpacity onPress={() => this.initiateNewGroup()}>
                    <View style={{
                        height: height * 15 / 100,
                        width: width * 25 / 100,
                        backgroundColor: '#0DE6CF',
                        paddingVertical: hp('1%'),
                        marginRight: hp('2%'),
                        borderRadius: 10,

                    }}>
                        <FastImage
                            style={{ height: height * 2.2 / 100, width: width * 7.2 / 100, flex: 0 }}
                            resizeMode={FastImage.resizeMode.contain}
                            source={require('../images/add.png')}
                        />
                        <View style={{ justifyContent: 'center', flex: 1 }} >
                            <Text style={{
                                textAlign: 'center',
                                fontSize: hp('1.78%'),
                                color: 'white',
                                fontFamily: 'Gilroy-Bold',
                                alignSelf: 'center'
                            }}>
                                {'New Group'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9}>
                    <View style={{
                        height: height * 15 / 100,
                        width: width * 25 / 100,
                        backgroundColor: '#3C1464',
                        paddingVertical: hp('1%'),
                        // paddingHorizontal: hp('1%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: hp('2%'),
                        borderRadius: 10,
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: hp('1.78%'), color: 'white', fontFamily: 'Gilroy-Bold' }}>No groups available</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };



    modalSetCode(code){ //keystroke for unlocking code modal
      this.setState({code});
    }

    async unlockCode(){ //when user clicks on button to unlock story with code
      try{

        this.setState({ showUnlock: false });
        let data = {
          userId:this.props.user._id,
          code:this.state.code,
        }

        this.setState({ processing: true });
        const response = await instance.post('/unlockCode', data);
        this.setState({ processing: false });

          if (response){
          let unlockedStories = response.data.stories;
          let updatedUser = response.data.user;
          createUpdateStories (unlockedStories);
          this._loadStories();
          this.refreshUser();

          this.setState({ unlockedStories: unlockedStories })
          this.setState({ isStoryUnlocked: true });
        }
      } catch (error){
        console.log('unlockCode response',error)
        this.setState({ processing: false });

      }
    }

    closeUnlockView() {

      this.setState({ showUnlock: false, })
    }

    render() {
        //const isMysterious = this.state.item.category == 'The Mysterious  Artifact' ? true : false;

        console.log("loadingerr starting to render")
        if (!this.props.user){
          console.log("USER IS MISSING in PROPS render")
        }
            //const isMysterious = this.state.item.category == 'The Mysterious  Artifact' ? true : false;

          const { challengesAndStories, isDuplicate } = this.state;
          const radius =
              Math.round(Dimensions.get('window').width + Dimensions.get('window').height) /
              2;
          const menu = (
              <SideBarMenu
                  goUserListView={this.goUserListView}
                  logout={this.logout}
                  goExportView={this.goExportView}
                  goUnlockView={() => this.setState({ isSidebarOpen: false, showUnlock: true })}
                  onPressClose={() => this.setState({ isSidebarOpen: false })}
              />
          );
          return (
              <SideMenu
                  menu={this.state.isSidebarOpen ? menu : null}
                  menuPosition="right"
                  disableGestures={true}
                  isOpen={this.state.isSidebarOpen}
                  onChange={(isOpen) => isOpen ? null : this.setState({ isSidebarOpen: false })}
              >
                  <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} >

                  <View style={{ flexDirection: 'row', width: '90%', alignSelf: "center", alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                      <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'space-between', alignItems: 'flex-end', alignSelf: "flex-end" }}>
                          <FastImage
                              source={{ uri: LOGO2 }}
                              style={{ height: width / 4.5 / 3.4, width: width / 4.5 }}
                              resizeMode={FastImage.resizeMode.contain}
                          />
                          <FastImage
                              source={require('../images/Avatar.png')}
                              style={{ height: height * 3.8 / 100, width: width * 9.4 / 100, }}
                              resizeMode={FastImage.resizeMode.contain}
                          />
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity style={{ height: 25, width: 30, right: 45, alignItems: "center" }} onPress={() => this.onShowQRScanModal()}>
                              <FastImage
                                  source={require('../images/scan.png')}
                                  style={{ height: 17, width: 17 }}
                                  resizeMode={FastImage.resizeMode.contain}

                              />
                          </TouchableOpacity>
                          <TouchableOpacity style={{ right: 15}} onPress={() => this.openSidebar()}>
                              <FastImage
                                  source={require('../images/menu.png')}
                                  style={{ height: 17, width: 17}}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={{ alignSelf: "center", width: '90%', marginTop: 35, flexDirection: "row" }}>
                      <Text style={{ fontFamily: 'Gilroy-Medium', alignSelf: 'flex-start', fontSize: hp('3%'), color: '#4F4F4F' }}>
                          {'Discover' + ' '}
                      </Text>
                      <Text style={{ fontFamily: 'Gilroy-Light', alignSelf: 'flex-start', fontSize: hp('3%'), color: '#4F4F4F' }}>
                          new adventures
                      </Text>
                  </View>
                  { challengesAndStories.length > 1 &&
                  <View style={{ alignSelf: "center", width: '90%', marginTop: 8 }}>
                      <Text style={{ fontFamily: 'Gilroy-Light', alignSelf: 'flex-start', fontSize: hp('1.9%'), color: '#9A9A9A' }}>
                          Join a group or create one.
                      </Text>
                  </View>}

                  { challengesAndStories.length <= 0 &&
                  <View
                          style={{

                              flex: 1,
                              // justifyContent: 'flex-start',
                              alignSelf:"center",
                              alignContent: 'center',
                              width: '100%',
                              backgroundColor: '#FFFFFF'
                          }}>



                          <Text
                              style={{
                                  marginHorizontal:hp('2.7%'),
                                  marginBottom: hp('2.5%'),
                                  fontSize: hp('1.7%'),
                                  color: '#9A9A9A',
                                  alignSelf: 'flex-start',
                                  fontFamily: 'Gilroy-Light'
                              }}>
                               Looks like you don’t have any stories yet. To unlock a story enter a key code provided by your teacher
                                      </Text>
                          <View
                              style={{
                                  borderColor: '#BDBDBD',
                                  paddingLeft:  hp('1%'),
                                  borderWidth: 0.5,
                                  marginHorizontal:  hp('3%'),
                                  height: 40,
                                  borderRadius: 50,
                                  justifyContent: 'center',
                                  alignContent: 'center'
                              }}>
                              <Input
                                  placeholder={'Enter Your Code Here'}
                                  value={this.state.code}
                                  autoCapitalize = 'none'
                                  onChangeText={this.modalSetCode.bind(this)}
                              />
                          </View>
                          <TouchableOpacity
                             // onPress={this.unlockCode.bind(this)}
                             onPress={this.unlockCode.bind(this)}
                              style={{
                                  paddingTop:  hp('0.50'),
                                  marginTop: hp('2%'),
                                  backgroundColor: '#3C1464',
                                  alignItems: 'center',
                                  borderWidth: 0.5,
                                  marginHorizontal: hp('3%'),
                                  height: 40,
                                  borderRadius: 50,
                                  justifyContent: 'center',
                                  alignContent: 'center'
                              }}>
                              <Text
                                  style={{
                                      fontFamily: 'Gilroy-Bold',
                                      color: '#FFFFFF',
                                      fontSize: 14
                                  }}>
                                  UNLOCK NOW
                                       </Text>
                          </TouchableOpacity>




                              </View> }

                  <FlatList
                      style={{ marginTop: hp('1%') }}
                      scrollEnabled={challengesAndStories.length > 1 ? true : false}
                      extraData={this.state.count && this.state.count}
                      data={challengesAndStories}
                      keyExtractor={item => item.id}
                      renderItem={({ item, index }) => {
                          let image = item.imagesUrl[0];

                          return (
                              <TouchableOpacity onPress={() => { this.itemPressed(item._id, item.type, item.bonusSparks, item.maxnum || 0), this.setState({ item: item, image: image }) }}>
                                  <View key={index} style={{
                                      alignSelf: "center", alignItems: 'center', width: '94%', height: challengesAndStories.length > 1 ? hp('28%') : hp('68%'), borderRadius: 20, marginBottom: index == challengesAndStories.length - 1 ? hp('10%') : 0, marginTop: hp('2.5%'), shadowOffset: { width: 0, height: 5, },
                                      shadowColor: 'rgba(0, 0, 0, 0.1)',
                                      shadowOpacity: 0.5,
                                      elevation: 10
                                  }}>
                                      <FastImage
                                          borderRadius={20}
                                          onLoad={() => this.imgLoaded(item._id)}
                                          onError={() => this.errorImg(item._id)}
                                          source={
                                              image ? { uri: image }
                                                  : require("../images/image.png")
                                          }

                                          style={{ width: '100%', height: challengesAndStories.length > 1 ? hp('28%') : hp('68%') }}
                                          resizeMode={FastImage.resizeMode.cover}
                                          priority={FastImage.priority.high}
                                      >
                                          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: hp('7.4'), alignSelf: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '85%', backgroundColor: '#fff', bottom: 0 }}>
                                              <Text style={{ fontFamily: 'Gilroy-Bold', marginTop: hp('1.4%'), fontSize: hp('2.8%'), color: '#3C1464' }}>
                                                  {item.name}
                                              </Text>
                                          </View>
                                      </FastImage>
                                  </View>
                              </TouchableOpacity>
                          )
                      }
                      }
                  />
                  <View style={{
                      height: hp('7%'),
                      flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'space-evenly',
                      position: 'absolute', width: '100%',
                      shadowOffset: { width: 0, height: -4, },
                      shadowColor: 'rgba(0, 0, 0, 0.25)',
                      shadowOpacity: 0.8,
                      elevation: 15,
                      backgroundColor: '#FFF', bottom: 0
                  }}>
                      <TouchableOpacity onPress={() => this.goToProfileScreen()}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <FastImage
                                  source={require('../images/Group.png')}
                                  style={{ height: 17, width: 17 }}
                                  resizeMode={FastImage.resizeMode.contain}

                              />
                              <Text style={{ fontFamily: 'Gilroy-Regular', marginTop: hp('0.5%'), fontSize: hp('2%'), color: '#3C1464', marginLeft: hp('1.5%') }}>
                                  Dashboard
                          </Text>
                          </View>
                      </TouchableOpacity>
                      {this.props.user.userTaskGroupIds.length > 0 && <FastImage
                          source={require('../images/Vector.png')}
                          resizeMode={FastImage.resizeMode.contain}
                          style={{
                              height: 30, width: 25,
                          }}
                      />}
                      {this.props.user.userTaskGroupIds.length > 0 && <TouchableOpacity onPress={() => this.goToUserTasksScreen()}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: "center" }}>
                              <FastImage
                                  source={require('../images/Group13.png')}
                                  resizeMode={FastImage.resizeMode.contain}
                                  style={{ height: 20, width: 20 }}

                              />
                              <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: hp('2%'), marginTop: hp('0.5%'), color: '#3C1464', marginLeft: hp('1.5%') }}>
                                  Groups
                          </Text>
                          </View>
                      </TouchableOpacity>}
                  </View>
                  {console.log('this is the processing state',this.state.processing)}
                  <StoryDetailModal
                    visibleValue={this.state.modalVisible}
                    onRequestCloseValue={this.onRequestCloseModal.bind(this)}
                    onBackdropPressValue={this.onRequestCloseModal.bind(this)}
                    onSwipeCompleteValue={this.onRequestCloseModal.bind(this)}
                    //IsDuplicateModal
                    modalVisibleValue={isDuplicate}
                    closeIsDuplicateModalValue={() => this.setState({ isDuplicate: false })}
                    onPressGoToGroupValue={this.onPressGoToGroup.bind(this)}
                    createGroupValue={this.createGroup.bind(this)}
                    radiusValue1={radius}
                    //
                    item={this.state.item}
                    image={this.state.image}
                    storyItemTextStyle={this.state.storyItemTextStyle}
                    onRequestCloseModal={this.onRequestCloseModal.bind(this)}
                    storyContent={this.state.storyContent}
                    morePressed={this.state.morePressed}
                    renderAbstractOrDescription={this.renderAbstractOrDescription}
                    onMorePressed={() => this.onMorePressed()}
                    processing={this.state.processing}
                    //FlatList
                    onMomentumScrollBeginValue={() => this._onMomentumScrollBegin()}
                    ListFooterComponentValue={this.state.callPlaceholder ? this.render_FlatList_footer : ''}
                    ListEmptyComponentValue={!this.state.callPlaceholder ? this.ListEmpty : ''}
                    dataValue={this.state.userTaskGroups}
                    onEndReachedValue={() => this.handleGroupPageIncrement()}
                    addUserToTeam={ this.addUserToTeam }
                    initiateNewGroup={() => { this.initiateNewGroup() }}
                    path1={path}
                    //
                  />
                  <JoinModal
                    modalVisible={this.state.joinModal}
                    transparentValue={true}
                    closeJoinModal={() => this.setState({ joinModal: false })}
                    qrCodeScanned={this.state.qrCodeScanned}
                    addUserToTeam={this.addUserToTeam}
                  />

                  <QRScanModal
                  modalVisible={this.state.showQRScanModal}
                  onRequestClose={this.onCloseQRScanModal}
                  onQRcodeDetect={this.onDetectQRcodeData} />

                  <UnlockStory
                  showUnlock={this.state.showUnlock}
                  closeUnlockView={() => this.closeUnlockView()}
                  code={this.state.code}
                  modalSetCode={this.modalSetCode.bind(this)}
                  unlockCode={() => this.unlockCode()}
                  user={this.props.user}
                  goToUserTasksScreen={() => { this.goToUserTasksScreen(), this.setState({ showUnlock: false }) }}
                  goToProfileScreen={() => { this.goToProfileScreen(), this.setState({ showUnlock: false }) }}
                  />

                  <UnlockStoryConfirmation
                  isStoryUnlocked={this.state.isStoryUnlocked}
                  unlockedStories={this.state.unlockedStories}
                  onPressClose={() => this.setState({ isStoryUnlocked: false })}
                  />

                  {this.state.processing && (
                      <Loader />
                  ) }

  </SafeAreaView>
              </SideMenu>
          );
      }
}

// export default codePush(codePushOptions)(StoryView)
export default StoryView;
