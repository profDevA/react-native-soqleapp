import React, {Component} from "react";
import {
    FlatList,
    SafeAreaView,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ImageBackground,
    Text,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard, PanResponder
} from "react-native";
import {Client, Report} from "bugsnag-react-native";
import {BUGSNAG_KEY} from "../config";

const bugsnag = new Client(BUGSNAG_KEY);

import Header from "../components/Header";
import {PAGE_SIZE, DEFAULT_SHARE} from "../constants";
import TaskCard from "../components/TaskCard";
import styles from "../stylesheets/userTaskGroupStyles";
import PincodePopup from "../components/PincodePopup";
import BaseComponent from "./BaseComponent";
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import {EVENT_LEAVE_GROUP} from '../constants'
import {getuuid, trackMixpanel, trackError} from '../utils/common';
import {
    MAKE_GROUP_PUBLIC_API,
    MAKE_GROUP_PRIVATE_API,
    JOIN_BY_SECRET_CODE
} from "../endpoints";
import * as axios from "axios";
import {API_BASE_URL} from "../config";
import {
    getGroupByUser,
    getUserTaskGroupsById,
    getAllUsersFromUserTaskGroupsTeam,
    getAllSharesFromUserProfiles
} from "../utils/grouputil";
import {Content} from "native-base";
import {getSocket} from "../utils/socket";
import ShareDetailPage from './ShareDetailPage';
import Modal from 'react-native-modal'
import I18n from '../utils/localize'
import Video from "react-native-gifted-chat/node_modules/react-native-video";

let pageNum = 0;
let totalCount = 0;
let pageSize = PAGE_SIZE;
let userEmail = null;

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {"Content-type": "application/json"}
});
const borderSharedContaint = 10;
// TODO: Update this class to new Lifecycle methods
export default class UserTaskGroupView extends BaseComponent {
    _renderItem = ({item, index}) => {
        const data = item._userStory;

        let teamLength = 0;
        if (item._team && item._team.users) {
            teamLength = item._team.users.length;
        }

        let name = item.name;
        if (!name && data) {
            name = data.name;
        } //takes the default name from story if its not available from userstory.


        const groupId = item._id;
        const updatedAt = item.updatedAt;
        const createdAt = item.createdAt;
        if (!item._team) {
            return
        }
        const teams = item._team._id; // Stores selected team id
        let indexes = index; // Stores selected team index
        let array = this.state.userTasks; // Stores array of user tasks
        let refreshAfterDelete = this.handleRefresh; // Binding Refresh list function
        if (!data) return null;
        return (
            <TaskCard
                {...this.props}
                array={array}
                refreshAfterDelete={this.userLeftTaskGroup.bind(this)}
                index={indexes}
                teams={teams}
                userStory={item._userStory}
                story={data} //although this is named task, this is actually a story (refer to line 34, _userstory - which is a story type
                teamLength={teamLength}
                groupId={groupId}
                currentGroupId={this.state.currentGroupId}
                team={item._team.emails || []}
                updatedDateTime={updatedAt}
                createdDateTime={createdAt}
                processing={this.state.processing}
                isPrivate={item.isPrivate}
                name={name}
                onChangeGroupType={() =>
                    this.onChangeGroupType(item._id, item.isPrivate)
                }
                secretCode={item.secretCode}
                onChangeGroupKey={() => this.onChangeGroupKey(item._id)}
            />
        );
    };

    constructor(props) {
        super(props);
        this.state = {
            shares: [],
            userTasks: [],
            initialLoading: true,
            loading: false,
            totalCount: null,
            refreshing: false,
            showKeyInput: false,
            showCreateKey: false,
            showChangeKey: false,
            groupId: false,
            processing: false,
            currentGroupId: null,
            sharesThumbModal: false,
            shareComment: "",
            shareObj: {},
            modalVisible: false,
            selectedShare: null
        };
        userEmail =
            (this.props.user &&
                this.props.user.profile &&
                this.props.user.profile.email) ||
            null;
        this.onRequestCloseModal = this.onRequestCloseModal.bind(this);


        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        });
    }

    componentWillMount() {
        const response = this.props.taskGroups;
        const params = this.props.navigation.state.params;
        const isReset = (params && params.reset) || false;
    }

componentDidMount() {

  super.componentDidMount();

  this.props.navigation.addListener("didFocus", () => {
      if (userEmail) {
          this.findSharesAndUserTaskFromRealm();
      }
  });
}


    shouldComponentUpdate(nextProps, nextState) {
      return (
          !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
      );
    }

    findSharesAndUserTaskFromRealm() {
      if (!this.props.user.userTaskGroupIds || (this.props.user.userTaskGroupIds && this.props.user.userTaskGroupIds.length==0)) {
        this.setState({
          ...this.state,
          userTasks: [] // NEED TO FIX THE EMAIL PROBLEM, DATA FROM REALM DIFFERS FROM THE API
        });
        return;
      }

    let usersFromTeamsInGroups = getAllUsersFromUserTaskGroupsTeam(this.props.user._id, userTaskGroups);
    let sharesFromUsers = getAllSharesFromUserProfiles(usersFromTeamsInGroups);
    let shortedSharesFromUsers = this.shortedSharesFromUsers(sharesFromUsers);

    this.setState({
      ...this.state,
      shares: shortedSharesFromUsers,
      userTasks: userTaskGroups // NEED TO FIX THE EMAIL PROBLEM, DATA FROM REALM DIFFERS FROM THE API
    });
  }

    findSharesAndUserTaskFromRealm() {

        if (!this.props.user.userTaskGroupIds) {
            return
        }

        if (this.props.user.userTaskGroupIds && this.props.user.userTaskGroupIds.length == 0) {
            return
        }

        let userTaskGroups = getUserTaskGroupsById(this.props.user.userTaskGroupIds);

        let usersFromTeamsInGroups = getAllUsersFromUserTaskGroupsTeam(this.props.user._id, userTaskGroups);
        let sharesFromUsers = getAllSharesFromUserProfiles(usersFromTeamsInGroups);
        let shortedSharesFromUsers = this.shortedSharesFromUsers(sharesFromUsers);
        this.setState({
            ...this.state,
            shares: shortedSharesFromUsers,
            userTasks: userTaskGroups // NEED TO FIX THE EMAIL PROBLEM, DATA FROM REALM DIFFERS FROM THE API
        });
    }
shortedSharesFromUsers(sharesFromUsers) {
    if (!sharesFromUsers)
        return sharesFromUsers;

    return _.sortBy(sharesFromUsers, 'date').reverse();
}

componentWillReceiveProps(nextProps) {

    if (nextProps.userTaskGroupsSuccess != this.props.userTaskGroupsSuccess) {
        let response = nextProps.taskGroups;
        if (Object.keys(response).length && nextProps.userTaskGroupsSuccess) {
            totalCount = response.count;
            pageNum = response.page;
            this.setState({
                userTasks: response.taskGroups,
                loading: false,
                refreshing: false
            });
        }
        if (
            !nextProps.userTaskGroupsSuccess &&
            nextProps.error &&
            Object.keys(nextProps.error).length
        ) {
            this.setState({
                loading: false,
                refreshing: false
            });
        }
    }
  }

  handleBackAction() {
    this.props.navigation.navigate({ routeName: "Story" });
  }

  handleRefresh() {/*
    if (userEmail) {
      this.setState({ refreshing: true });
      this.props.userActions.getUserTaskGroupsRequest({
        page: 1,
        user_email: userEmail
      });
    }*/
  }

  //this is initiated from the taskCard leave group (leaveGroupAPI)
  userLeftTaskGroup = (groupId, teamId) => {
    this.findSharesAndUserTaskFromRealm();

    let generateduuid= getuuid();
    getSocket().emit('client:message', {
        msgId: generateduuid, //special id to synch server and client ids
        sender: this.props.user._id,
        receiver: teamId,
        chatType: 'GROUP_MESSAGE',
        type: EVENT_LEAVE_GROUP,
        userProfile: this.props.user,
        time: new Date().toISOString(),
        groupId: groupId,
        message: this.props.user.profile.firstName + ' leaves the group.'
    });
    /*let userTaskGroups = [...this.props.taskGroups.taskGroups].filter(g => g._team._id != teamId)

    this.props.userActions.getUserTaskGroupsCompleted({
      ...this.props.taskGroups,
      taskGroups: userTaskGroups
    })
    this.setState({
      userTasks: userTaskGroups
    })*/
  }

  handleScroll() {
    /*
    if (pageNum * pageSize < totalCount && !this.state.loading && userEmail) {
      this.setState({ loading: true });
      this.props.userActions.getUserTaskGroupsRequest({
        page: pageNum + 1,
        previousData: this.state.userTasks,
        user_email: userEmail
      });
    }*/
  }

  // Join by secret code. This is to allow users to join their own favourite groups or friends using a special key ---> geeta
  onJoin = ({ code }) => {
    if (!!code) {
      // JOIN Private Team API Call
      let endpoint = JOIN_BY_SECRET_CODE.replace("{s_code}", code).replace(
        "{email}",
        this.props.user.profile.email
      );
      fetch(endpoint, {
        method: "GET"
      })
        .then(res => res.json())
        .then(res => {
          alert(res.response);
          this.handleRefresh()
        })
        .catch(e => {
          trackError(e)
        });
    } else {
      this.setState({ showKeyInput: true });
    }
  }


    makeGroupPublicAPICall = groupId => {
        let {userTasks = []} = this.state;
        instance
            .put(MAKE_GROUP_PUBLIC_API.replace("{}", groupId))
            .then(response => {
                userTasks = userTasks.map(task => {
                    if (task._id === groupId) {
                        delete task.secret_code;
                        task.isPrivate = false;
                    }
                    return task;
                });
                this.props.userActions.updateUserTaskGroup(userTasks);

                this.setState({
                    processing: false,
                    userTasks,
                    currentGroupId: null
                });
            })
            .catch(error => {
                trackError(error);
                this.setState({
                    processing: false,
                    currentGroupId: null
                });
            });
    };

    makeGroupPrivateAPICall = (groupId, secretCode) => {
        let {userTasks = []} = this.state;
        instance
            .put(MAKE_GROUP_PRIVATE_API.replace("{}", groupId), {secretCode})
            .then(response => {
                userTasks = userTasks.map(task => {
                    if (task._id === groupId) {
                        task.secretCode = response.data.code;
                        task.isPrivate = true;
                    }
                    return task;
                });
                this.props.userActions.updateUserTaskGroup(userTasks);
                this.setState({
                    processing: false,
                    userTasks,
                    currentGroupId: null
                });
            })
            .catch(error => {
                trackError(error);
                this.setState({
                    processing: false,
                    currentGroupId: null
                });
            });
    };

    onChangeGroupType = (groupId, isPrivate) => {
        if (isPrivate) {
            this.setState({
                processing: true,
                currentGroupId: groupId
            });
            this.makeGroupPublicAPICall(groupId);
        } else {
            this.setState({
                processing: true,
                currentGroupId: groupId
            });
            this.makeGroupPrivateAPICall(groupId);
        }
    };

    onChangeGroupKey = groupId => {
        this.setState({showChangeKey: true, groupId});
    };

    onGroupKeyManipulate = ({code}) => {
        const {showChangeKey, showCreateKey, groupId} = this.state;
        if (!code || code.length < 5) {

            return;
        }
        if ((showChangeKey || showCreateKey) && groupId) {
            this.setState({
                showCreateKey: false,
                showChangeKey: false,
                groupId: null,
                processing: true,
                currentGroupId: groupId
            });
            this.makeGroupPrivateAPICall(groupId, code);
        }
    };

    onRequestCloseModal() {
        this.setState({sharesThumbModal: false})
    }

    sharesThumb() {
        let shares = this.state.shares;

        if (shares && shares.length > 0) {
            return (
                <ScrollView
                    style={{maxHeight: 147, marginTop: 10}}
                    horizontal={true}>
                    {shares.map((share, index) =>{
                        return(<TouchableOpacity
                            key={index}
                            onPress={() => {
                            // this.props.navigation.navigate("ShareDetailPage",{ shareObj: share});
                            this.setState({modalVisible: true, selectedShare: share})
                        }}>
                            <Content key={share._id} style={{
                                backgroundColor: '#401C64',
                                padding: 0,
                                marginHorizontal: 5,
                                marginBottom: 10,
                                marginTop: 10,
                                height: 127,
                                width: 91,
                                borderRadius: borderSharedContaint
                            }}>
                        { share.content.video ?<Video
                                paused={true}
                                ref={r => {
                                    this.player = r;
                                }} source={{uri: share.content.video}} style={{
                                    height: 127,
                                    width: 91,
                                    margin: 0,
                                    padding: 0,
                                    borderRadius: borderSharedContaint
                                }} resizeMode='cover'
                                onLoad={(onLoad)=>{
                                    this.player.seek(onLoad.duration);
                                }}
                                paused={false}
                                repeat={false}
                                muted={true}

                                /> :
                                 <FastImage
                                    //style={styles.image},
                                    style={{
                                        height: 127,
                                        width: 91,
                                        margin: 0,
                                        padding: 0,
                                        borderRadius: borderSharedContaint
                                    }}
                                    //headers={{ Authorization: 'someAuthToken' }},
                                    //priority= FastImage.priority.normal,
                                    resizeMode={FastImage.resizeMode.cover}
                                    //FIND A BETTER PICTURE TO USE WHEN THE SHARE HAS NO IMAGE
                                    source={{uri: share.content.image || DEFAULT_SHARE}}
                    /> }
                                <View style={{
                                    flexDirection: 'row', alignItems: 'flex-end',
                                    marginTop: 5,
                                    justifyContent: 'flex-start',
                                    marginLeft: 5,
                                    position: 'absolute',
                                }}>
                                    <FastImage
                                        style={{
                                            height: 30,
                                            width: 30,
                                            borderRadius: 15,
                                            borderWidth: 2,
                                            borderColor: '#9601a1'
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                        source={{uri: share.pictureUrl}}
                                        blurRadius={0}
                                    />
                                </View>
                            </Content>
                        </TouchableOpacity>)
                    }
                    )
                    }
                </ScrollView>
            )
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.container}>
                <Modal
                    {
                        ...this._panResponder.panHandlers
                    }
                    swipeToClose={false}
                    propagateSwipe={false}
                    avoidKeyboard={true}
                    useNativeDriver={true}
                    animationInTiming={1000}
                    animationType={"slide"}
                    transparent={true}
                    swipeDirection="down"
                    visible={this.state.modalVisible}
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        padding: 0,
                        margin: 0,
                        // flex: 1
                    }}
                    onRequestClose={() => this.setState({modalVisible: false})}
                    onBackdropPress={() => this.setState({modalVisible: false})}
                    onSwipeComplete={() => this.setState({modalVisible: false})}
                >
                    <ShareDetailPage userObj={this.props.user} shares={this.state.shares} shareObj={this.state.selectedShare}
                                     handleCloseModal={() => this.setState({modalVisible: false})}/>
                </Modal>
                <Header
                    title={I18n.t("groups")}
                    headerIconStyle={{color: '#9600A1'}}
                    headerStyle={{backgroundColor: '#ffffff'}}
                    headerRightTextStyle={{color: '#9600A1'}}
                    navigation={this.props.navigation}
                    rightText={I18n.t("secret")}
                    fontStyle={{fontSize: 20, color: '#3C1364', fontWeight: 'bold'}}
                    titleViewStyle={{flex: 2, alignItems: 'center', position: "absolute", left: 100, right: 100}}
                    onRight={this.onJoin}
                />

                {this.sharesThumb()}

                <View style={{flex: 1, marginTop: 5}}>
                    <FlatList
                        data={this.state.userTasks}
                        keyExtractor={item => item._id}
                        renderItem={this._renderItem}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        //onScrollEndDrag={() => this.handleScroll()}
                    />
                </View>
                <PincodePopup
                    modalVisible={this.state.showKeyInput}
                    onRequestClose={() => this.setState({showKeyInput: false})}
                    onSubmit={this.onJoin}
                    emptyErr={"Please enter key to join group"}
                />
                {/*<PincodePopup
          modalVisible={this.state.showCreateKey}
          onRequestClose={() => this.setState({ showCreateKey: false })}
          onSubmit={this.onGroupKeyManipulate}
          emptyErr={"Please enter key to join group"}
        />*/}
                <PincodePopup
                    modalVisible={this.state.showChangeKey}
                    onRequestClose={() => this.setState({showChangeKey: false})}
                    onSubmit={this.onGroupKeyManipulate}
                    emptyErr={"Please enter key to join group"}
                />
            </SafeAreaView>
        );
    }
}
