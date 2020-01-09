import React, {Component} from 'react';
import {
    FlatList,
    SafeAreaView,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    Platform,
    Text,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    Animated,
    StyleSheet,
    PanResponder
} from "react-native";
import * as axios from 'axios';
import {API_BASE_URL, BUGSNAG_KEY} from '../config';
import _ from 'lodash';
import stylesuserTaskGroupStyles from "../stylesheets/chatViewStyles";
import styles from "../stylesheets/userTaskGroupStyles";
import {trackMixpanel, trackError, getuuid} from '../utils/common';
import {patchProfilePicInContent} from '../utils/patchutil';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import BaseComponent from "./BaseComponent";
import {TASK_GROUP_TYPES, TASK_GROUP_OBJECTIVE, MAIN_COLOR, DEFAULT_AVATAR} from '../constants';
import {addCommentToShare, createUpdateContent} from "../realm/RealmHelper";
import I18n from '../utils/localize'
import ImageOrVideo from "../components/ImageOrVideo";

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

const {height, width} = Dimensions.get('window');

export default class ShareDetailPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            share: null,
            nextShare:null,
            user: null,
            shareComment: "",
            firstY: 0,
            displayComments: true,
            displayMoreComments: false,
            shares: this.props.shares,
            pan: new Animated.ValueXY()
        };
        this.goBack = this.goBack.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.renderTopView = this.renderTopView.bind(this);
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        });
        this.state.panResponder = Platform.OS != 'ios' && PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
              null,
              {
                dx: this.state.pan.x, // x,y are Animated.Value
                dy: this.state.pan.y,
              },
            ]),
            onPanResponderRelease: () => {
                Math.abs(this.state.pan.y._value)>20 && this.props.handleCloseModal()
            },
          });

        //  this.setNextShare();
    }

    goBack() {
        this.props.navigation.pop();
    }

    // setNextShare(){ 
    //   if (!this.state.shares){return}
    //
    //   // for (share in shares){
    //   //   //find the current this.state.share in this.state.shares and set nextShare to the next share
    //   // }
    // }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
        );
    }

    componentWillMount() {
        let {shareObj} = this.props;
        let {userObj} = this.props;

        this.state.share = shareObj;
        this.state.user = userObj;
    }

    addComment() {
        if (!this.state.shareComment && !this.state.shareComment.length > 0) {
            return;
        }


        const shareId = this.state.share._id;
        const creator = this.state.user._id;
        const content1 = this.state.shareComment;
        const type = "ShareDetailComment"
        const uuid = getuuid();

        let data = {
            _feid: uuid,
            userId: creator,
            shareId: shareId,
            creator: creator,
            content1: content1,
            type: type,
        }

        //the name of the user is missing on the GUI because the creator is not initialized and sent
        addCommentToShare(this.state.share, content1, type, uuid);

        instance.post(`${API_BASE_URL}/savepost`, data)
            .then(response => {
                if (response.status == 400) {
                }

              if (response) {
                  if (!response.data.creator.pictureURL){
                    patchProfilePicInContent(response.data.creator)
                  }

                  createUpdateContent(response.data, this.state.share);
                  //  this.state.share.comments.push(createdContent);
              }})

          .catch(err => {
              console.log(err);
              trackError(err);
            });


        this.onChangeText("");//reset again
    }

    onChangeText(shareComment) {
        this.setState({shareComment: shareComment})
    }

    _onHandlerStateChange = (event) => {
        if (this.state.firstY = 0) {
            this.setState({firstY: event.nativeEvent.translationY})
        }
        if (event.nativeEvent.oldState === State.ACTIVE) {
            // if (event.nativeEvent.translationY > this.state.firstY) {
                this.props.handleCloseModal()
            // }
        }

    };

    renderTopView() {
        let shareObj = this.state.share;
        return (
            <View style={sdpStyles.topViewContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.handleCloseModal()
                    }}
                    style={sdpStyles.closeIconContainer}
                >
                    <View>
                        <Icon name='close' size={30} style={styles.closeButton}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderCommentView(comments) {
        let {displayComments} = this.state;
        if (displayComments) {
            const commentArr = this.lastComment(comments);
            return (
                // <FlatList style={sdpStyles.commentFlatList}
                //     data={commentArr}
                //     inverted={true}
                //     ListHeaderComponent= {
                //         comments.length > 3 ?
                //         <TouchableOpacity style={{padding : 10}} onPress={() => this.more()}>
                //             <Text style={{color:'#ffffff', fontSize: 16}}>
                //                 More
                //             </Text>
                //         </TouchableOpacity>
                //         :null
                //     }
                //     renderItem={({item}) => <ShareCommentItem item={item} />}
                //     />
                <View style={sdpStyles.commentFlatList}>
                    {comments.length > 3 ?
                        <TouchableOpacity style={{padding: 10}} onPress={() => this.more()}>
                            <Text style={{color: '#ffffff', fontSize: 16}}>
                                More
                            </Text>
                        </TouchableOpacity>
                        : null}
                    {commentArr.map(item => {
                            return (<ShareCommentItem item={item}/>)
                        }
                    )}
                </View>
            );
        }
    }

    more() {
        // Alert.alert(
        //     'Comming soon',
        //     'More comments',
        //     [
        //         {
        //             text: 'OK', onPress: () => {
        //             }
        //         },
        //     ],
        //     {cancelable: true},
        // );
        // let {shareObj} = this.props;
        // let comments = shareObj.comments;
        // this.renderMoreCommentsView(comments);
        this.setState({
            displayComments: !this.state.displayComments,
            displayMoreComments: !this.state.displayMoreComments
        });
    }

    less() {
        this.setState({
            displayComments: !this.state.displayComments,
            displayMoreComments: !this.state.displayMoreComments
        });
    }


    renderMoreCommentsView(comments) {
        let {displayMoreComments} = this.state;

        if (displayMoreComments) {
            // const commentArr = this.lastComment(comments);
            const commentArr = comments;
            return (
                <>
                <View style={{width: '100%', height: 80}} />
                <View
                    {
                        ...this._panResponder.panHandlers
                    }
                    style={{
                        flex: 1,
                        flexDirection: 'column-reverse',
                        marginBottom: 5,
                        width: width,
                        height: height,
                        // backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                    {comments.length > 3 ?
                        <TouchableOpacity style={{padding: 10}} onPress={() => this.less()}>
                            <Text style={{color: '#ffffff', fontSize: 16}}>
                                Show less
                            </Text>
                        </TouchableOpacity>
                        : null}
                    <ScrollView style={{flex: 1}}>
                        {commentArr.map(item => {
                                return (<ShareCommentItem item={item}/>)
                            }
                        )}
                        {/* <FlatList
                            data={comments}
                            renderItem={({item}) => <ShareCommentItem item={item}/>}
                            // keyExtractor={item => item.id}
                        /> */}
                    </ScrollView>
                </View>
                </>
            );
        }
    }

    lastComment(comments) {
        let commentArr = [];
        if (comments) {
            comments.map(element => {
                commentArr.push(element);
            })
            commentArr = commentArr.reverse().slice(0, 3).reverse();
        }
        return commentArr;
    }

    render() {
      console.log("sharedetailpage render")
        let {shareObj} = this.props;
        let comments = shareObj.comments;

        //  comments.reverse(); //to put latest in front

        return (

            <Animated.View
                {...this.state.panResponder.panHandlers}
                style={styles.containerModal}

            >

        <ImageOrVideo
           type={shareObj.content.video ? "video" : "image"}
            style={[
                styles.imageBackgroundModal,
              { backgroundColor: shareObj.content.video  ? "black" : 'black' }
            ]}
            source={{ uri: shareObj.content.video ? shareObj.content.video : shareObj.content.image }}
            ></ImageOrVideo>

        {/* :
                <FastImage
                    //style={styles.image},
                    style={styles.imageBackgroundModal}
                    //headers={{ Authorization: 'someAuthToken' }},
                    //priority= FastImage.priority.normal,
                    resizeMode={FastImage.resizeMode.cover}
                    //FIND A BETTER PICTURE TO USE WHEN THE SHARE HAS NO IMAGE
                    source={{uri: shareObj.content.image}}
                />} */}
                <PanGestureHandler
                    minDeltaX={10}
                    onHandlerStateChange={this._onHandlerStateChange}>
                <View
                    style={[sdpStyles.modalSubContainer, ]}>

                    {this.renderMoreCommentsView(comments)}
                    {this.renderCommentView(comments)}
                    <View style={sdpStyles.commentContainer}>
                        <View style={sdpStyles.textInputContainer}>
                            <TextInput
                                style={sdpStyles.textInputModal}
                                onChangeText={(shareComment) => this.onChangeText(shareComment)}
                                placeholder={I18n.t("typeReply")}
                                placeholderTextColor={"#000000"}
                                value={this.state.shareComment}/>
                        </View>
                        <TouchableOpacity style={sdpStyles.addCommentButton} onPress={() => this.addComment()}>
                            <View>
                                <Icon name='send' size={15} style={styles.closeButton}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                </PanGestureHandler>

                  {this.renderTopView()}

            </Animated.View>


        )
    }
}

class ShareCommentItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        return (
            <View style={sciStyles.container}>
                <View style={sciStyles.transparentContainer}>

                    <FastImage
                        style={sciStyles.image}
                        resizeMode={FastImage.resizeMode.contain}
                        source={{uri: item.creator && item.creator.pictureURL ? item.creator.pictureURL : DEFAULT_AVATAR}}
                        blurRadius={0}
                    />
                    <View style={sciStyles.content}>
                        <Text style={sciStyles.name}>
                            {item.creator && item.creator.firstName ? item.creator.firstName : ""}
                        </Text>
                        <Text style={sciStyles.content1}>{item.content1 ? item.content1 : ""}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

//ShareCommentItem StyleSheet
const sciStyles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingRight: width * .25,
    },
    transparentContainer: {
        marginTop: 5,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: width * .07,
        flexDirection: 'row'
    },
    content1: {
        color: '#ffffff',
        fontSize: 14,
        marginLeft: 10,
        flexWrap: 'wrap',
        paddingRight: width * .10,
    },
    name: {
        color: '#eaeaea',
        fontSize: 10,
        marginLeft: 10,
        flexWrap: 'wrap'
    },
    content: {
        justifyContent: 'flex-start'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#9601a1'
    }
})
const sdpStyles = StyleSheet.create({
    topViewContainer: {
        position: 'absolute',
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        top: 20,
        justifyContent: 'center'
    },
    commentFlatList: {
        flex: 1,
        flexDirection: 'column-reverse',
        marginBottom: 5,
    },
    closeIconContainer: {
        justifyContent: 'center'
    },
    timeIconStyle: {
        maxHeight: 16,
        maxWidth: 16,
        marginRight: 2
    },
    textInputModal: {
        height: width * .14,
        width: width * .75,
        paddingLeft: 10,
        paddingRight: 10,
        color: "#000000",
        fontSize: 18
    },
    commentContainer: {
        flexDirection: "row"
    },
    modalSubContainer: {
        position: "absolute",
        // bottom: width * .1,
        left: 0,
        right: 0,
        top: 0,
        // bottom: width * .1,
        bottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "column",
        flex: 1,
        paddingBottom: 20,
    },
    textInputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: width * .1,
        flex: 1
        //paddingHorizontal: width * .05, paddingHorizontal: width * .05
    },
    addCommentButton: {
        width: width * .14,
        marginLeft: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: width * .07,
        backgroundColor: '#d57765'
    }
});
