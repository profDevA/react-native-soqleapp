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

import SideBarMenu from "./SideBarMenu";
import {NavigationActions, StackActions} from "react-navigation";
import ImagePicker from "react-native-image-picker";
import {Client} from "bugsnag-react-native";
import {API_BASE_URL, BUGSNAG_KEY} from "../config";
import {
    getUserTaskGroupsById,
    getAllSharesFromUserProfiles,
    getAllUsersFromUserTaskGroupsTeam
} from "../utils/grouputil";
import {getFeedDuration} from "../utils/common";
import ShareDetailPage from "../views/ShareDetailPage";
import I18n from '../utils/localize'

const bugsnag = new Client(BUGSNAG_KEY);

const {width} = Dimensions.get("window");

const feedViewCard = ({ 
    u_image,
    u_name,
    u_contentTime,
    u_contentQuestion,
    onPressShareButton,
    u_contentImage
}) =>(


    <View style={{padding: 10, backgroundColor: "#3C1364"}}>
    <View
        style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 20
        }}
        borderRadius={20}
    >
        <View style={{flexDirection: "row"}}>
            <View style={{marginLeft: 20, marginTop: 12, flex: 0.5}}>
                {u_image != null ? (
                    <Thumbnail circle source={{uri: u_image}}/>
                ) : (
                    <Thumbnail circle source={require("../images/Avatar.png")}/>
                )}
            </View>
            <View
                style={{
                    marginLeft: 12,
                    marginTop: 12,
                    flex: 2,
                    justifyContent: "center"
                }}
            >
                <View style={{marginBottom: 5}}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: "#000000",
                            fontWeight: "bold"
                        }}
                    >
                        {u_name}
                    </Text>
                    <Text note style={{fontSize: 10, color: "#000000"}}>
                        {u_contentTime}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginRight: 12,
                    marginTop: 12,
                    flex: 0.5
                }}
            >
                <Button transparent>
                    <Icon
                        name="md-more"
                        type={"Ionicons"}
                        style={{fontSize: 20, color: "black"}}
                    />
                </Button>
            </View>
        </View>
        <View
            style={{
                flex: 1,
                margin: 20
            }}
        >
            <Text style={{fontSize: 13}}>{u_contentQuestion}</Text>
            {u_contentImage != undefined && u_contentImage != null ? (
                <Image
                    resizeMode={"cover"}
                    source={{uri: u_contentImage}}
                    style={{
                        height: 300,
                        width: "100%",
                        flex: 1,
                        marginTop: 10
                    }}
                />
            ) : (
                <Image
                    source={require("../images/Avatar.png")}
                    style={{
                        height: 200,
                        width: "100%",
                        flex: 1,
                        marginTop: 10
                    }}
                />
            )}
            <View
                style={{
                    height: 30,
                    backgroundColor: "#9601a1",
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    flexDirection: "row"
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon
                            type={"SimpleLineIcons"}
                            name={"share"}
                            style={{fontSize: 15, color: "#fff"}}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#fff",
                            marginLeft: 5,
                            fontWeight: "bold"
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end"
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon
                            type={"AntDesign"}
                            name={"heart"}
                            style={{fontSize: 15, color: "red"}}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#fff",
                            marginLeft: 5,
                            fontWeight: "bold"
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onPress={onPressShareButton}

                    >
                        <Icon
                            type={"MaterialCommunityIcons"}
                            name={"tooltip-outline"}
                            style={{fontSize: 15, color: "#fff"}}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#fff",
                            marginRight: 10,
                            marginLeft: 5,
                            fontWeight: "bold"
                        }}
                    />
                </View>
            </View>
        </View>
    </View>
</View>
)
export default feedViewCard;