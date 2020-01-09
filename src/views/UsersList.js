import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  Alert
} from "react-native";
import DialogInput from "../components/DialogInput";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import CardSection from "../components/CardSection";
import { Thumbnail } from "native-base";
import styles from "./../stylesheets/userListViewStyles";
import { createUpdateGroup, deleteGroup , createUpdateTeam, addManualMessage, getGroup} from "../realm/RealmHelper";
import { EVENT_GROUP_SIZE_CHANGE,EVENT_LEAVE_GROUP } from "../constants";
import { getSocket } from "../utils/socket";
import { BUGSNAG_KEY, API_BASE_URL } from "../config";
import * as axios from "axios";
import { TEAM_UPDATE_API, LEAVE_TEAM } from "../endpoints";
import ConfirmPoppup from "../components/ConfirmPopup";
import BaseComponent from "./BaseComponent";
import { showMessage } from 'react-native-flash-message';
import {MAIN_COLOR} from '../constants';
import { trackMixpanel, trackError, getProfileImg, getuuid  } from '../utils/common';
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { "Content-type": "application/json" }
});

export default class UsersList extends Component {


    static flashMessage = message => showMessage({ message, type: MAIN_COLOR });

  constructor(props) {
    super(props);
    this.state = {
      dataUser: [],
      modalVisible: false,
      maxnum: 0,
      teamLength: 0,
      groupObj: null,
      showConfirmPopup: false,
      isUserOwnerOfGroup: false,
      selectedUser: null
    };

    this.onShowAlertOfRemoveMemberOfGroup = this.onShowAlertOfRemoveMemberOfGroup.bind(
      this
    );
    this.onRemoveUser = this.onRemoveUser.bind(this);
    this.onCloseConfirmPopup = this.onCloseConfirmPopup.bind(this);
    this.onPressConfirmNoButton = this.onPressConfirmNoButton.bind(this);
    this.onPressConfirmYesButton = this.onPressConfirmYesButton.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params.taskGroupData) {
      let group = this.props.navigation.state.params.taskGroupData;
      const isLoggedUserIsOwnerOfGroup =
        this.props.user._id == group._user._id ? true : false;

      this.setState({
        groupObj: group,
        isUserOwnerOfGroup: isLoggedUserIsOwnerOfGroup
      });
      if (group._team) {
        this.setState({ dataUser: group._team.users });
        //this.setState({ dataUser: group._team.emails });
        if (group._team.users) {
          this.setState({ teamLength: group._team.users.length });
        }
      }
      if (group._userStory) {
        this.setState({ maxnum: group._userStory.maxnum });
      }
    }

    if (this.props.navigation.state.params.blockUserList) {
      this.setState({
        dataUser: this.props.navigation.state.params.blockUserList
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error.message) {
      alert(nextProps.error.message);
    }
    if (
      nextProps.blockUserSuccess &&
      nextProps.blockUserSuccess !== this.props.blockUserSuccess
    ) {
    }
  }

  handleBackAction = () => {
    this.props.navigation.goBack();
  }

  editMemberCount() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  updateMaxMember(inputText) {
    if (!inputText) {
      UsersList.flashMessage("You did not key in a value!");
      return;
    }

    var newSize = Number.parseInt(inputText);
    const data = {
      newTeamSize: newSize,
      _id: this.state.groupObj._id
    };

    instance
      .post(`${API_BASE_URL}/saveTaskGroup`, data)
      .then(response => {
        if (response) {
          savedGroup = response.data;
          getSocket().emit("client:message", {
            msgId: getuuid(),
            sender: this.props.user._id,
            receiver: savedGroup._team._id,
            chatType: "GROUP_MESSAGE",
            type: EVENT_GROUP_SIZE_CHANGE,
            groupId: savedGroup._id,
            message: "The group size limit has changed to " + newSize,
            isJoining: true,
            time: new Date().toISOString(),
            userProfile: this.props.user
          });
          this.setState({ groupObj: savedGroup });
          this.setState({ maxnum: newSize });
          createUpdateGroup(response.data);
          //  this.refreshUserTask()
        }
      })
      .catch(error => {
        trackError(error);
      });
  }

  /*blockUnblockConfirmation(userId, isBlocked) {
        var alertTitle = '', alertMessage = ''
        if (isBlocked == 0) {
            alertTitle = 'Unblock?';
            alertMessage = 'Are you sure to unblock this user?';
        } else {
            alertTitle = 'Block?';
            alertMessage = 'Are you sure to block this user?';
        }
        Alert.alert(
            alertTitle,
            alertMessage,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Ok', onPress: () => this.callApiToBlockUnblock(userId, isBlocked) },
            ]
        )
    }
    callApiToBlockUnblock(userId, isBlocked) {
        const { userActions } = this.props;
        var loginUserId = this.props.user._id;
        let arrayParam = { 'loginUserId': loginUserId, 'blockedUserId': userId, 'isBlocked': isBlocked };
        userActions.blockUserRequested(arrayParam);
        let profile = { ...this.props.user };
        let blockUserIds = [...this.props.user.blockUserIds];
        if (isBlocked) {
            blockUserIds.push(userId);
            profile.blockUserIds = blockUserIds;
            userActions.blockUnlockUserCompleted(profile);
        } else {
            let blockedUserArray = blockUserIds.filter(e => e != userId)
            profile.blockUserIds = blockedUserArray;
            userActions.blockUnlockUserCompleted(profile);
        }
        this.setState({ dataUser: this.state.dataUser });
    }*/

  onCloseConfirmPopup() {
    this.setState({ showConfirmPopup: false });
  }

  onRemoveUser() {}

  onShowAlertOfRemoveMemberOfGroup = (item) => {
    this.setState({ selectedUser: item, showConfirmPopup: true });
  }

  onPressConfirmYesButton() {
    this.setState({ showConfirmPopup: false });

    if (!this.state.selectedUser || !this.state.groupObj){
      UsersList.flashMessage("User or Group is Missing!");
    }

    const idToRemove = this.state.selectedUser.item._id
    const nameRemoved= this.state.selectedUser.item.profile.firstName;
    const teamId = this.state.groupObj._team._id;

    let endpoint = LEAVE_TEAM.replace("{teamId}", teamId).replace(
      "{userId}",  idToRemove );
    let data = {"userId": idToRemove, "groupId": this.state.groupObj._id};

    fetch(endpoint, {
      method: "DELETE",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then( res => res.json())
      .then( res => {

        let generateduuid= getuuid();
        let time=new Date().toISOString();
        let message = nameRemoved + ' left the group.';
        getSocket().emit('client:message', {
            msgId: generateduuid, //special id to synch server and client ids
            sender: this.props.user._id,
            receiver: teamId,
            chatType: 'GROUP_MESSAGE',
            type: EVENT_LEAVE_GROUP,
            userProfile: this.props.user,
            time: time,
            groupId: this.state.groupObj._id,
            refId: idToRemove,
            message: message
        });


        addManualMessage(this.state.groupObj,
           generateduuid,
           this.props.user._id,
           teamId, EVENT_LEAVE_GROUP,
           this.props.user,
           time,
           idToRemove,
           message
         );

        createUpdateGroup(res.data);
        const latestGroup = getGroup(this.state.groupObj._id);

        this.setState({ dataUser: res.data._team.users });
        this.setState({ groupObj: res.data })

      })
    .catch(e => {
      console.log(e);
    });

  }

  onPressConfirmNoButton() {
    this.setState({ showConfirmPopup: false });
  }

  renderItem = (item, index) => {
    let profile = item.item.profile;
    let arrayBlockedUser = this.props.user.blockUserIds,
      btnBlockConfirmation = "";
    let name = "name",
      designation = "superhero",
      imgEyes,
      userId = 0,
      isBlocked = 1;
    let imgUser;
    imgEyes = <Image source={require("../../assets/images/eyeOpen.png")} />;
    let dictUserDetail;

    let group = this.props.navigation.state.params.taskGroupData;
    let isUserNotOwner = false;

    //don't know why there is double item.item
    if (item && profile) {
      if (profile.firstName) {
        name = profile.firstName;
      }
      if (profile.lastName) {
        name = name + " " + profile.lastName;
      }
      if (profile.title) {
        designation = profile.title;
      }
      if (item.item._id) {
        userId = profile._id;
      }

      isUserNotOwner = item.item._id != this.props.user._id ? true : false;

      const uri = getProfileImg(profile);
      imgUser = <Thumbnail style={styles.imageUser} source={{ uri: uri }} />;

      /*if (this.props.navigation.state.params.blockUserList) {
                dictUserDetail = item.item
            } else {
                dictUserDetail = item.item.userDetails;
            }*/

      /*var index = -1;
            if (arrayBlockedUser && arrayBlockedUser.length > 0) {
                index = arrayBlockedUser.indexOf(userId);
            }

            if (index >= 0) {
                isBlocked = 0;
                btnBlockConfirmation = <TouchableOpacity style={styles.eyeBtn} onPress={() => this.blockUnblockConfirmation(userId, isBlocked)}>
                    <Image style={styles.eyeWithCross} source={require('../../assets/images/eyeCross.png')} />
                </TouchableOpacity>

            } else {
                isBlocked = 1;
                btnBlockConfirmation = <TouchableOpacity style={styles.eyeBtn} onPress={() => this.blockUnblockConfirmation(userId, isBlocked)}>
                    <Image source={require('../../assets/images/eyeOpen.png')} />
                </TouchableOpacity>
            }
            if (userId === this.props.user._id) {
                btnBlockConfirmation = <TouchableOpacity style={styles.eyeBtn} />
            }*/
    }
    return (
      <CardSection>
        <TouchableOpacity>
          <View style={styles.viewMain}>
            {imgUser}
            <View>
              <Text style={styles.txtName}> {name} </Text>
              <Text style={styles.txtDesignation}> {designation} </Text>
            </View>
            {this.state.isUserOwnerOfGroup && isUserNotOwner && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20
                }}
                onPress={() => this.onShowAlertOfRemoveMemberOfGroup(item)}
              >
                <Icon
                  name={"close"}
                  size={20}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </CardSection>
    );
  };

  render() {
    let countMbr = 0;
    let mbrTitle = "Members";

    if (this.state.dataUser.users) {
      countMbr = this.state.dataUser.users.length;
      if (countMbr == 1) {
        mbrTitle = "Member";
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.handleBackAction()}
            style={styles.headerBackView}
          >
            <View>
              <Icon name="chevron-left" style={styles.headerBackIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.viewSearchMemCount}>
          <Text style={styles.txtMemberCount}>
            {this.state.teamLength}/{this.state.maxnum} {mbrTitle}
          </Text>
          <TouchableOpacity onPress={() => this.editMemberCount()}>
            <View>
              <Icon name="pencil" style={styles.memberEditIcon} size={40} />
            </View>
          </TouchableOpacity>
          <DialogInput
            isDialogVisible={this.state.modalVisible}
            title={"UPDATE"}
            textInputProps={{ keyboardType: "numeric" }}
            hintInput={"Update max member"}
            submitText={"Upate"}
            initValueTextInput={this.state.maxnum}
            submitInput={inputText => {
              this.setState({ modalVisible: false });
              this.updateMaxMember(inputText);
            }}
            closeDialog={() => {
              this.setState({ modalVisible: false });
            }}
          />
          <Image
            style={styles.imgSearchIcon}
            source={require("../../assets/images/Search.png")}
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.listStyle}
            data={this.state.dataUser}
            extraData={this.props.user}
            scrollEnabled={true}
            marginBottom={50}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
          />
        </View>
        <ConfirmPoppup
          modalVisible={this.state.showConfirmPopup}
          onRequestClose={this.onCloseConfirmPopup}
          onYesSubmit={this.onPressConfirmYesButton}
          onNoSubmit={this.onPressConfirmNoButton}
          message={"Are you sure you want to remove member from group?"}
        />
      </SafeAreaView>
    );
  }
}
