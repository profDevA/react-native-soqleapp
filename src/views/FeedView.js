import React, {Component} from "react";
import { resizeImg, trackMixpanel } from '../utils/common';
import {
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
    FlatList,
    Animated,
    Dimensions
} from "react-native";
import {
    Container,
    Content,
    Body,
    Text,
    Icon,
    Left,
    Right,
    Button,
    Thumbnail,
    ListItem,
    View,
    Tab,
    Tabs
} from "native-base";
import styles from "../stylesheets/NewsFeedStyle";
import Modal from 'react-native-modal'
import SideMenu from "react-native-side-menu";

import SideBarMenu from "../components/SideBarMenu";
import {NavigationActions, StackActions} from "react-navigation";
import ImagePicker from "react-native-image-picker";
import {Client} from "bugsnag-react-native";
import {API_BASE_URL, BUGSNAG_KEY} from "../config";
import {
    getUserTaskGroupsById,
    getAllSharesFromUserProfiles,
    getAllUsersFromUserTaskGroupsTeam
} from "../utils/grouputil";
import {getFeedDuration, trackError} from "../utils/common";
import ShareDetailPage from "./ShareDetailPage";
import I18n from '../utils/localize';
import FeedViewCard from "../components/FeedViewCard";

const bugsnag = new Client(BUGSNAG_KEY);

const {width} = Dimensions.get("window");

export default class FeedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false,
            index: 1,
            skip: true,
            loading: true,
            isSidebarOpen: false,
            arrayHorizontalContentShare: [],
            arrayVerticalContentShare: [],
            scrollY: new Animated.Value(0),
            currentTabIndex: 0,
            isShowDetailsPage: false,
            selectedShare: null,
            selectedUser: null,
            user:this.props.navigation.state.params.user,
        };
        if (!this.state.user){

          this.state.user= this.state.user;
        }

        this.goBack = this.goBack.bind(this);
        this.uploadUserProfileImage = this.uploadUserProfileImage.bind(this);
        this.goExportView = this.goExportView.bind(this);
        this.goUserNotificationView = this.goUserNotificationView.bind(this);
        this.renderContentView = this.renderContentView.bind(this);
    }


    setSharesOnPage(shares) {
        const arrayTmpHorizontal = [];
        const arrayTmpVertical = [];

        if (shares) {
            for (let i = 0; i < shares.length; i++) {
                const objFeed = shares[i];
                const objContent = objFeed["content"];
                const content1 = objContent["content1"];

                //if the subject of the share ends with a ? we show it like instagram stories. THis will help users who want to participate in a mini quora setup.
                if (content1 != undefined && content1.indexOf("?") !== -1) {
                    arrayTmpHorizontal.push(objFeed);
                } else {
                    arrayTmpVertical.push(objFeed);
                }
            }

            const arraySortVertical = this.sortArray(arrayTmpVertical);
            const arraySortHorizontal = this.sortArray(arrayTmpHorizontal);

            this.setState({
                arrayHorizontalContentShare: arraySortHorizontal,
                arrayVerticalContentShare: arraySortVertical
            });
        }
    }

    componentDidMount() {

        if (!this.state.user.userTaskGroupIds) {
            return
        }
        if (this.state.user.userTaskGroupIds && this.state.user.userTaskGroupIds.length == 0) {
            return
        }

        const userTaskGroups = getUserTaskGroupsById(
            this.state.user.userTaskGroupIds
        );
        const usersFromTeamsInGroups = getAllUsersFromUserTaskGroupsTeam(
            this.state.user._id,
            userTaskGroups
        );
        const sharesFromUsers = getAllSharesFromUserProfiles(usersFromTeamsInGroups);
        this.setSharesOnPage(sharesFromUsers);

    }

    sortArray(array) {
        const arraySortFeeds = array.sort(function (feedFirst, feedSecond) {
            const objContentFirst = feedFirst["content"];
            const objContentSecond = feedSecond["content"];

            const objContentFirstDate = new Date(objContentSecond["date"]).getTime();
            const objContentSecondDate = new Date(objContentFirst["date"]).getTime();

            if (objContentFirstDate < objContentSecondDate) {
                return -1;
            } else if (objContentFirstDate == objContentSecondDate) {
                return 0;
            } else {
                return 1;
            }
        });

        return arraySortFeeds;
    }

    openSidebar() {
        this.setState({isSidebarOpen: !this.state.isSidebarOpen});
    }

    logout = () => {
        this.props.userActions.logout();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "Login"})]
        });
        this.props.navigation.dispatch(resetAction);
    };

    goUserListView = () => {
        const {userActions} = this.props;
        userActions.blockUserListRequested(this.state.user.blockUserIds);
    };

    goBack() {
        this.props.navigation.pop();
    }

    goExportView() {
        this.props.navigation.navigate({routeName: "ExportView"});
    }

    goToDashboardScreen = () =>
        this.props.navigation.navigate({ routeName: "Dashboard" });

    goUserNotificationView() {
        this.props.navigation.navigate({routeName: "UserNotificationView"});
    }

    uploadUserProfileImage() {
        const options = {
            noData: true
        };
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, response => {
            this.renderResponse(response);
        });
    }

    renderResponse(response) {
        if (response.didCancel) {
        } else if (response.error) {
            trackError(response.error);
        } else {
            if (response.uri) {
                console.log("profileimg going into upload image")
                this.uploadImage(response);
            }
        }
    }

    async createFormData(photo) {
        const data = new FormData();
        let submitURI = await resizeImg(photo.uri, 212, 448, 'JPEG', 80);

        data.append("image", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? submitURI : submitURI.replace("file://", "")
        });
        return data;
    }

    async uploadImage(photo) {
        let data = await this.createFormData(photo);
        let path = `${API_BASE_URL}/userProfile/${
            this.state.user._id
        }/avatar/upload-image`;
        fetch(path, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(response => {
                this.props.userActions.FetchUserProfileCompleted(response);
            })
            .catch(error => {
                trackError(error);
            });
    }

    renderContentView() {
        let contentViews = [];
        const viewContnt = this.state.arrayHorizontalContentShare.map(
            (value, index) => {
                return (
                    <TouchableOpacity
                        key={`${index}`}
                        style={{marginHorizontal: 10, marginBottom: 10, height: 120}}
                        onPress={() => this.onPressShareButton(value)}
                    >
                        <Image
                            style={{height: 120, width: 75, borderRadius: 7}}
                            resizeMode="cover"
                            source={{uri: value.content.image}}
                        />
                        <View
                            style={{
                                lexDirection: "row",
                                alignItems: "flex-end",
                                marginTop: 10,
                                justifyContent: "flex-start",
                                marginLeft: 8,
                                position: "absolute"
                            }}
                        >
                            <Image
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20,
                                    borderWidth: 3,
                                    borderColor: "#9601a1"
                                }}
                                resizeMode="cover"
                                source={{uri: value.pictureURL}}
                            />
                        </View>
                    </TouchableOpacity>
                );
            }
        );

        contentViews.push(...viewContnt);
        return contentViews;
    }

    onPressShareButton = share => {
        this.setState({
            selectedShare: share,
            isShowDetailsPage: true,
            modalVisible: true,
            selectedUser: share.userProfile
        });
    };

    renderFeedViewRow = ({item, index}) => {
        const lastName = item.userLastName != null ? item.userLastName : "";
        const name = `${item.userFirstName} ${lastName}`;
        const userImage = item.pictureUrl;
        const contentQuestion =
            item.content.content1 != undefined && item.content.content1 != null
                ? `${item.content.content1}`
                : "";
        const contentImage = item.content.image;
        const contentTime =
            item.content.date != undefined && item.content.date != null
                ? getFeedDuration(item.content.date)
                : "";

        return (
            <FeedViewCard
            u_image={userImage}
            u_name={name}
            u_contentTime={contentTime}
            u_contentQuestion={contentQuestion}
            onPressShareButton={() => this.onPressShareButton(item)}
            u_contentImage={contentImage}
            />
        );
    };

    onLayoutAnimateView = event => {
    };

    render() {
        const menu = (
            <SideBarMenu
                goUserListView={this.goUserListView}
                logout={this.logout}
                goExportView={this.goExportView}
            />
        );
        const MARGIN_TOP = Platform.OS == "ios" ? 90 : 70;
        return (
            <Container>
                {/* <SideMenu
                    menu={menu}
                    menuPosition="right"
                    isOpen={this.state.isSidebarOpen}
                > */}
                    <ScrollView
                        style={{
                            backgroundColor: "#3C1364",
                            flex: 1
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                marginTop: MARGIN_TOP,
                                backgroundColor: "#3C1364"
                            }}
                        >
                            <View style={{flexDirection: "row"}}>
                                <View
                                    style={{
                                        height: 95,
                                        width: 95,
                                        borderRadius: 45,
                                        borderWidth: 3,
                                        borderColor: "#9601a1",
                                        marginTop: 20,
                                        marginLeft: 8
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setSharesOnPage(this.state.user.shares)}

                                    >
                                        <Image
                                            style={{height: 90, width: 90, borderRadius: 45}}
                                            resizeMode="cover"
                                            source={
                                                this.state.user.profile.pictureURL
                                                    ? {uri: this.state.user.profile.pictureURL}
                                                    : require("../images/Avatar.png")
                                            }
                                            blurRadius={0}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 95,
                                        marginLeft: 80,
                                        position: "absolute"
                                    }}
                                    onPress={this.uploadUserProfileImage}
                                >
                                    <Image
                                        style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            backgroundColor: "#FFF"
                                        }}
                                        resizeMode="cover"
                                        source={require("../images/plus.png")}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        borderRadius: 10,
                                        backgroundColor: "#9600a1",
                                        padding: 0,
                                        marginHorizontal: 20,
                                        marginVertical: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginHorizontal: 10,
                                            marginTop: 10
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontWeight: "500",
                                                    color: "white",
                                                    fontSize: 15
                                                }}
                                            >
                                                Introduction Blockchain
                                            </Text>
                                        </View>

                                        <Right style={{justifyContent: "flex-start"}}>
                                            <Image
                                                style={{height: 20, width: 20}}
                                                resizeMode="cover"
                                                source={require("../images/logout_fill.png")}
                                                blurRadius={0}
                                            />
                                        </Right>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginHorizontal: 10,
                                            marginTop: 7
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontWeight: "400",
                                                    color: "white",
                                                    fontSize: 15
                                                }}
                                            >
                                                Braindump
                                            </Text>
                                        </View>
                                    </View>

                                    <ListItem noBorder>
                                        <Left>
                                            <Image
                                                style={{height: 20, width: 20}}
                                                resizeMode="cover"
                                                source={require("../images/user-silhouette.png")}
                                                blurRadius={0}
                                            />
                                            <Text
                                                style={{
                                                    fontStyle: "normal",
                                                    color: "white",
                                                    fontSize: 15,
                                                    marginLeft: 5
                                                }}
                                            >
                                                5
                                            </Text>
                                        </Left>
                                        <Body style={{width: 150}}>
                                            <TouchableOpacity
                                                style={{
                                                    height: 30,
                                                    backgroundColor: "#20beb8",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: 15
                                                }}
                                            >
                                                <Text
                                                    uppercase={false}
                                                    style={{fontSize: 14, color: "white"}}
                                                >
                                                    Start Task
                                                </Text>
                                            </TouchableOpacity>
                                        </Body>
                                    </ListItem>
                                </View>
                            </View>
                            <ScrollView
                                style={{
                                    maxHeight:
                                        this.state.arrayHorizontalContentShare.length == 0 ? 0 : 140
                                }}
                                horizontal={true}
                            >
                                {this.renderContentView()}
                            </ScrollView>
                        </View>
                        <View style={[styles.viewTab]}>
                            <Tabs
                                locked
                                tabBarUnderlineStyle={{height: 5, backgroundColor: "white"}}
                                scrollWithoutAnimation={true}
                            >
                                <Tab
                                    heading={I18n.t("myFeed") + " " + this.state.user.profile.firstName + " (" + this.state.user.profile.email + ")"}
                                    tabStyle={{
                                        backgroundColor: "#9601a1",
                                        borderBottomWidth: 5,
                                        borderBottomColor: "#ce93d2"
                                    }}
                                    textStyle={{color: "#fff"}}
                                    activeTabStyle={{backgroundColor: "#9601a1"}}
                                    activeTextStyle={{color: "#fff", fontWeight: "normal"}}
                                >
                                    <View style={{flex: 1}}>
                                        <FlatList
                                            data={this.state.arrayVerticalContentShare}
                                            renderItem={this.renderFeedViewRow}
                                            extraData={this.state}
                                            keyExtractor={item => `${item._id}`}
                                            alwaysBounce={true}
                                            scrollEventThrottle={8}
                                            bounces={true}
                                            scrollEnabled={false}
                                        />
                                    </View>
                                </Tab>
                            </Tabs>
                        </View>
                    </ScrollView>
                    <View style={styles.headerBackground}>
                        <View style={styles.headerMainView}>
                            <View style={{flex: 0.8, flexDirection: "row"}}>
                                <Button
                                    transparent
                                    vertical
                                    style={{width: width * 0.1, borderWidth: 0, marginTop: 10}}
                                    onPress={() => this.goBack()}
                                >
                                    <Image
                                        style={{height: 20, width: 10}}
                                        source={require("../images/BackImage.png")}
                                    />
                                </Button>
                                <Button
                                    transparent
                                    vertical
                                    style={{width: width * 0.22, borderWidth: 0}}
                                >
                                    <Image
                                        style={styles.headerButtonIcon}
                                        source={require("../images/icon_group.png")}
                                    />
                                    <View
                                        style={{
                                            backgroundColor: "red",
                                            borderRadius: 10,
                                            zIndex: 2,
                                            top: -8,
                                            left: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: "white",
                                                marginHorizontal: 5
                                            }}
                                        >
                                            0
                                        </Text>
                                    </View>
                                    <View style={{top: -8, width: width * 0.24}}>
                                        <Text
                                            uppercase={false}
                                            style={{
                                                fontSize: 8,
                                                color: "#9601a1",
                                                textAlign: "center"
                                            }}
                                        >
                                            {I18n.t("groups")}
                                        </Text>
                                    </View>
                                </Button>
                                <Button transparent vertical style={{width: width * 0.24}}>
                                    <Image
                                        style={styles.headerButtonIcon}
                                        source={require("../images/icon_chat.png")}
                                    />
                                    <View
                                        style={{
                                            backgroundColor: "red",
                                            borderRadius: 10,
                                            zIndex: 2,
                                            top: -8,
                                            left: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: "white",
                                                marginHorizontal: 5
                                            }}
                                        >
                                            0
                                        </Text>
                                    </View>
                                    <View style={{top: -8, width: width * 0.24}}>
                                        <Text
                                            uppercase={false}
                                            style={{
                                                fontSize: 8,
                                                textAlign: "center",
                                                color: "#9601a1"
                                            }}
                                        >
                                            {I18n.t("messages")}

                                        </Text>
                                    </View>
                                </Button>
                                <Button transparent vertical style={{width: width * 0.24}}>
                                    <TouchableOpacity onPress={this.goUserNotificationView}>
                                        <Image
                                            style={styles.headerButtonIcon}
                                            source={require("../images/icon_notification.png")}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            backgroundColor: "red",
                                            borderRadius: 10,
                                            zIndex: 2,
                                            top: -8,
                                            left: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: "white",
                                                marginHorizontal: 5
                                            }}
                                        >
                                            0
                                        </Text>
                                    </View>
                                    <View style={{top: -8, width: width * 0.24}}>
                                        <Text
                                            uppercase={false}
                                            style={{
                                                fontSize: 8,
                                                color: "#9601a1",
                                                textAlign: "center"
                                            }}
                                        >
                                            {I18n.t("notification")}

                                        </Text>
                                    </View>
                                </Button>
                            </View>

                            <View style={{flex: 0.2}}>
                                <Button
                                    transparent
                                    vertical
                                    style={{width: width * 0.24}}
                                    onPress={() => this.goToDashboardScreen()}
                                >
                                    <Image
                                        style={{...styles.headerButtonIcon,resizeMode:'contain'}}
                                        source={require("../images/dot_menu.png")}
                                    />
                                </Button>
                            </View>
                        </View>
                    </View>
                {/* </SideMenu> */}
                {this.state.isShowDetailsPage && (
                    <Modal
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
                            margin: 0
                        }}
                        onRequestClose={() => {
                            this.setState({
                                modalVisible: false,
                                isShowDetailsPage: false
                            }), alert('ss' + this.state.isShowDetailsPage)
                        }}
                        onBackdropPress={() => this.setState({modalVisible: false, isShowDetailsPage: false})}
                        onSwipeComplete={() => this.setState({modalVisible: false, isShowDetailsPage: false})}
                    >
                        <ShareDetailPage
                            userObj={this.state.selectedUser}
                            shareObj={this.state.selectedShare}
                            handleCloseModal={() => {
                                this.setState({
                                    modalVisible: false,
                                    isShowDetailsPage: false
                                }), alert('ss' + this.state.isShowDetailsPage)
                            }}
                        />
                    </Modal>
                )}
            </Container>
        );
    }
}
