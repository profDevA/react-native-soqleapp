import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text, View, SafeAreaView, Image, FlatList, Alert, Dimensions
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome'
import CardSection from '../components/CardSection';
import {
    Thumbnail
} from "native-base";
import styles from './../stylesheets/CommentsViewStyle';
import {Input, Item} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const {height, width} = Dimensions.get("window");
const deviceHeight = height;

export default class CommentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUser: [],
            message: '',
        };
    }

    componentDidMount() {


        if (this.props.navigation.state.params.commentDetail) {
            this.setState({dataUser: this.props.navigation.state.params.commentDetail})
        }
    }

    handleBackAction() {
        this.props.navigation.goBack();
    }

    onLikeButtonClick(commentId, index) {
        let navigationParam = this.props.navigation.state.params
        let profile = navigationParam.userDetail;
        let name = '';
        if (profile.firstName) {
            name = profile.firstName;
        }
        if (profile.lastName) {
            name = name + ' ' + profile.lastName;
        }
        let arrayParam = {'likeBy': name, 'comment_id': commentId, 'userId': navigationParam.userId};
        this.props.userActions.userLikeWithData(arrayParam);
        let arrayComment = this.state.dataUser;
        arrayComment[index].like.push({
            "liked_by": ""
        })
        this.setState({dataUser: arrayComment});
    }

    onChangeMessageText(message) {
        this.setState({message: message});
    }

    onSendButtonClick() {
        if (this.state.message.length <= 0) {
            return;
        }
        let navigationParam = this.props.navigation.state.params
        let profile = navigationParam.userDetail;
        let name = '', profileUrl = '';

        if (profile.firstName) {
            name = profile.firstName;
        }
        if (profile.lastName) {
            name = name + ' ' + profile.lastName;
        }
        if (profile.pictureURL) {
            profileUrl = profile.pictureURL;
        }
        var date1 = new Date()
        this.setState(prevState => {
            return {
                dataUser: prevState.dataUser.concat({
                    'userId': navigationParam.userId,
                    'comment': this.state.message,
                    'commentator_id': navigationParam.userId,
                    'commentator_name': name,
                    'profileUrl': profileUrl,
                    'createdAt': date1,
                    'like': []
                })
            }
        });
        /* Api calling */
        let arrayParam = {
            'userId': navigationParam.userId,
            'comment': this.state.message,
            'commentator_id': navigationParam.userId,
            'commentator_name': name,
            'profilePic': profileUrl,
            'post_id': navigationParam.postId
        }

        const {userActions} = this.props;
        this.props.userActions.userCommentPostRequest(arrayParam);
        this.setState({message: ''});
    }

    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;
        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    renderItem = (item) => {

        let arrayLike = item.like, btnLikeConfirmation = '', likeCount = '';
        var name = '', imgUser, userId = 0, comment = '', isBtnLikeShow = true;
        let dictUserDetail = {};

        if (item.item) {
            dictUserDetail = item.item;
        }
        if (dictUserDetail.commentator_name) {
            name = dictUserDetail.commentator_name
        }
        if (dictUserDetail.commentator_id) {
            userId = dictUserDetail.commentator_id;
        }
        comment = dictUserDetail.comment;

        if (dictUserDetail.createdAt) {
            // this.timeDifference(dictUserDetail.createdAt);
        }
        // User can't like it's own comment
        if (dictUserDetail.commentator_id === this.props.navigation.state.params.userId) {
            //isBtnLikeShow = false;
        }
        if (dictUserDetail.like.length > 0) {
            likeCount = dictUserDetail.like.length;
            btnLikeConfirmation = <TouchableOpacity style={styles.likeImgIcon}
                                                    onPress={() => this.onLikeButtonClick(dictUserDetail._id, item.index)}>
                <Image source={require('./../../assets/images/Like.png')}/>
            </TouchableOpacity>
        } else {
            btnLikeConfirmation = <TouchableOpacity style={styles.likeImgIcon}
                                                    onPress={() => this.onLikeButtonClick(dictUserDetail._id, item.index)}>
                <Image source={require('./../../assets/images/Dislike.png')}/>
            </TouchableOpacity>
        }

        imgUser = <Thumbnail
            style={styles.imageUser}
            source={{uri: dictUserDetail && dictUserDetail.profileUrl || `https://ui-avatars.com/api/?name=${dictUserDetail.commentator_name}`}}/>

        let minutes = this.timeDifference(new Date(), new Date(dictUserDetail.createdAt))
        return (
            <CardSection>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.viewMain}>
                        {imgUser}
                        <View>
                            <Text style={styles.txtName}> {name} </Text>
                            <Text style={styles.txtComment}> {comment} </Text>
                            <Text style={styles.txtDesignation}> {minutes} </Text>

                        </View>
                    </View>
                    {isBtnLikeShow ? btnLikeConfirmation : null}
                    <Text style={styles.likeCount}>
                        {dictUserDetail.like && dictUserDetail.like.length > 0 ? dictUserDetail.like.length : ""}
                    </Text>

                </View>
            </CardSection>
        )
    };

    render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.handleBackAction()}
                    >
                        <View>
                            <Icon
                                name='chevron-left'
                                style={styles.headerBackIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{height: height * 0.79}}>

                        <FlatList
                            style={styles.listStyle}
                            data={this.state.dataUser}
                            extraData={this.state}
                            scrollEnabled={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                        />
                    </View>
                    <View style={[styles.viewBottomContainInput]}>
                        <TouchableOpacity style={styles.attchment}>
                            <Image source={require('./../../assets/images/attachment.png')}/>
                        </TouchableOpacity>

                        <View style={styles.viewInput}>
                            <Item>
                                <Input
                                    style={styles.textInput}
                                    value={this.state.message}
                                    placeholder="Enter your message"
                                    onChangeText={value => this.onChangeMessageText(value)}
                                />
                            </Item>
                            <TouchableOpacity style={styles.sendIcon} onPress={this.onSendButtonClick.bind(this)}>
                                <Image source={require('./../../assets/images/sendArrow.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>

        );
    }
}
