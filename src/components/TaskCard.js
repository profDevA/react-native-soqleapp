import React, { Component } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Dimensions
} from "react-native";
import FacePile from "react-native-face-pile";
import SwiperFlatList from "react-native-swiper-flatlist";
import { Body, CardItem, Icon, Left, Thumbnail, Button } from "native-base";
import {  deleteGroup } from "../realm/RealmHelper";
import _ from 'lodash';
import styles from "./../stylesheets/TaskCardStyles";
import moment from "moment";
import { TEAM_UPDATE_API, LEAVE_TEAM } from "../endpoints";
const { width, height } = Dimensions.get("window");
import NavigationService from '../navigator/NavigationService';

export default class TaskCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetails: false,
      deleteLoader: false,
      deleteModal: false,
      idToDelete: "",
      scoreView: false,
    };
  }

  // To LEAVE TEAM Function
  leaveGroupAPI = () => {
    let teamId = this.state.idToDelete;
    this.setState({ deleteLoader: true });
    let endpoint = LEAVE_TEAM.replace("{teamId}", teamId).replace(
      "{userId}",  this.props.user._id );
    let data = {"userId": this.props.user._id, "groupId": this.props.groupId};
    fetch(endpoint, {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
      .then(res => {

        const groupIdDeleted=this.props.groupId;
        deleteGroup(groupIdDeleted);
        _.remove(this.props.user.userTaskGroupIds, function(v) { return v === groupIdDeleted; });
        this.setState({ deleteLoader: false, deleteModal: false });

        this.props.userActions.fetchUserProfile(this.props.user._id); // need to refresh props with updated usertaskgroupid for profile
        this.props.refreshAfterDelete(this.props.groupId, teamId); //refresh the screen
        // this.props.array.splice(this.props.index, 1);
      })
      .catch(e => {
        console.log(e);
        this.setState({ deleteLoader: false, deleteModal: false });
      });
  };

  shouldComponentUpdate(nextProps, nextState)
  {

    return (
      !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
    );
  }

  // Show Leave Team Pop Up Function
  deleteModal = teamId => {

    this.setState({ deleteModal: true, idToDelete: teamId });
  };


  getListUser = users =>
    users.map(user => {
      let firstName = user.userDetails && user.userDetails.profile && user.userDetails.profile.firstName || "";
      let lastName = user.userDetails && user.userDetails.profile && user.userDetails.profile.lastName || "";
      let profilePicture =
      user.userDetails && user.userDetails.profile &&  user.userDetails.profile.pictureURL ||
        `https://ui-avatars.com/api/?name=${firstName || lastName}`;
      let title = user.userDetails && user.userDetails.profile && user.userDetails.profile.education || "";
      let _id = user.userDetails && user.userDetails._id;
      return { firstName, lastName, profilePicture, title, _id };
    });

  getFacePile = users =>
    users.map(user => ({ id: user._id, imageUrl: user.profilePicture }));

  render() {

    const {
      name,
      story,
      userStory,
      groupId,
      teamLength,
      team,
      index,
      user,
      updatedDateTime,
      createdDateTime,
      onChangeGroupType,
      isPrivate = false,
      secretCode = "",
      onChangeGroupKey,
      currentGroupId
    } = this.props;
    const users = this.getListUser(team);
    const facePile = this.getFacePile(users);
    const { isShowDetails } = this.state;
    const createdDateAt = moment(createdDateTime, "YYYYMMDD").fromNow();
    return (
      <View style={{ paddingHorizontal: 10, marginLeft: 10, marginRight: 10}}>
        <SwiperFlatList renderAll>
          <TouchableOpacity
            onPress={() =>

              this.props.navigation.navigate("Chat", {
                task_group_id: groupId,
                user: this.props.user,
                taskUpdated: false
              })
            }
          >
            <View style={[styles.swipeItem, styles.taskItem]}>
              <View style={styles.taskItemHeader}>
                <Text style={styles.taskItemName} numberOfLines={2}>
                  {name}
                  <Text style={styles.taskItemTime}> {createdDateAt}</Text>
                </Text>
                <Text style={styles.taskItemSize}>
                  {/* {task.quota ? `${teamLength}/${task.quota}` : ""} */}
                  {userStory.maxnum ? `${teamLength}/${userStory.maxnum}` : ""}
                </Text>
              </View>
              <Text style={styles.taskItemDescription}>{userStory.description}</Text>
              <View style={styles.taskItemFooter}>
                <Thumbnail style={styles.timeIconStyle} source={require('../images/purple_time.png')} />
                <Text style={styles.taskItemExpiry}>
                  {`Expire: ${story.expiry || ""}`}
                </Text>
                <Text style={styles.taskItemXP}>100 xp</Text>
              </View>
              {(this.state.scoreView) && (
                <View style={styles.taskItemScore}>
                  <Text style={styles.taskItemTextScore}>Score: </Text>

                  <Button transparent vertical>
                      <Image
                          style={{ height: 20, width: 24, }}
                          source={require('../images/icon_chat.png')}
                      />
                      <View style={{ backgroundColor: 'red', borderRadius: 10, zIndex: 2, top: -8, left: 10 }}>
                          <Text style={{ fontSize: 10, color: 'white', marginHorizontal: 2, }}>99+</Text>
                      </View>
                  </Button>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View style={[styles.swipeItem, styles.memberWrapper]}>
            <TouchableOpacity
              onPress={() => this.setState({ isShowDetails: !isShowDetails })}
            >
              <View style={styles.topWrapper}>
                <View style={styles.subItems}>
                  <Text style={styles.textWhite}>{team.length} Members </Text>
                  {!(
                    this.props.processing && currentGroupId === groupId
                  ) && (
                    <Icon
                      name={isPrivate ? "eye-slash" : "eye"}
                      type={"FontAwesome"}
                      style={[styles.textWhite, styles.eyeIcon]}
                      onPress={onChangeGroupType}
                    />
                  )}
                  {this.props.processing && currentGroupId === groupId && (
                    <ActivityIndicator
                      size={Platform.OS === "ios" ? "small" : 18}
                      style={{ paddingHorizontal: 10 }}
                      color="#ffffff"
                    />
                  )}
                </View>
                <View style={styles.subItems}>
                  {isPrivate && secretCode ? (
                    <TouchableOpacity onPress={onChangeGroupKey}>
                      <Text style={styles.keyText}>{secretCode}</Text>
                    </TouchableOpacity>
                  ) : null}
                  <Icon
                    onPress={() => this.deleteModal(this.props.teams)} // Show Leave Team Pop Up on click  ------->> Geeta Khati
                    // onPress={() =>
                    //   this.props.navigation.navigate("Chat", {
                    //     task_group_id: taskGroupId,
                    //     taskUpdated: false
                    //   })
                    // }
                    style={styles.textWhite}
                    name="sign-in"
                    type="FontAwesome"
                  />
                </View>
              </View>
              <FacePile
                imageStyle={{ borderWidth: 0 }}
                containerStyle={[
                  styles.facePile,
                  isShowDetails ? { borderBottomWidth: 1 } : null
                ]}
                numFaces={3}
                faces={facePile}
                hideOverflow
                overlap={0.2}
              />
            </TouchableOpacity>
            {isShowDetails && (
              <CardItem style={styles.memberWrapper}>
                {users.map(user => (
                  <Left transparent key={user._id} style={{ marginBottom: 10 }}>
                    <Thumbnail small source={{ uri: user.profilePicture }} />
                    <Body>
                      <Text
                        style={[
                          styles.textWhite,
                          {
                            fontSize: 17,
                            fontWeight: "500"
                          }
                        ]}
                      >
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text note style={{ color: "#ffffff", opacity: 0.7 }}>
                        {user.education}
                      </Text>
                    </Body>
                  </Left>
                ))}
              </CardItem>
            )}
          </View>
        </SwiperFlatList>

        {/* Leave Team Pop Up */}
        <Modal
          transparent={true}
          visible={this.state.deleteModal}
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(235,235,235,0.7)"
            }}
          >
            <View
              style={{
                width: width * 0.75,
                backgroundColor: "#1FBEB8",
                height: height * 0.45,
                borderRadius: 5,
                paddingVertical: 20,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <Image
                style={{
                  height: 40,
                  alignSelf: "center",
                  width: 40,
                  resizeMode: "contain"
                }}
                source={require("../images/logout.png")}
              />
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  color: "white",
                  textAlign: "center"
                }}
              >
                Do you want to leave the group ?
              </Text>
              <View
                style={{
                  width: "95%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  onPress={() => this.leaveGroupAPI()}
                  style={{ fontSize: 24, fontWeight: "600", color: "white" }}
                >
                  YES
                </Text>
                <Text
                  onPress={() => this.setState({ deleteModal: false })}
                  style={{ fontSize: 24, fontWeight: "600", color: "white" }}
                >
                  NO
                </Text>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}
