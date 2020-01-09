import React, {Component} from 'react';
import {Animated,View,Text,Image,TouchableOpacity} from 'react-native';
import styles from '../stylesheets/storyViewStyles';
import {CHALLENGE_IMAGE_BASE_URL, STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL, TASK_GROUP_TYPES} from '../constants';
import ReadMore from 'react-native-read-more-text';
import FastImage from 'react-native-fast-image';
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);


export default class TextImage extends Component {

    constructor(props){
        super(props);
        this.state = {
            source: props.source,
            storyItemTextStyle: styles.storyItemImage,
            animatedStyle:{height:new Animated.Value(styles.storyItemImage.height)},
            currentSlideIndex: props.currentSlideIndex,
            item: props.item,
            index:props.index,
            storyContent: styles.storyContent,
            morePressed: false,
            isStoryLocked: props.isStoryLocked
        }

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

    onMorePressed = () => {
        if (this.state.morePressed) {
            this.setState({ morePressed: false })
        } else {
            this.setState({ morePressed: true })
        }
    }

    render(){
        const item = this.state.item;
        const imageBaseUrl = item.type === TASK_GROUP_TYPES.CHALLENGE ? CHALLENGE_IMAGE_BASE_URL : STORY_IMAGE_BASE_URL;
        return (
            <View>
                {item.has_video && this.state.currentSlideIndex === this.state.index ? (
                    <Video
                        ref={ref =>
                            this.player = ref}
                        source={{uri: STORY_VIDEO_BASE_URL.replace('{}', item._id)}}
                        resizeMode={'cover'}
                        controls={true}
                        volume={1.0}
                        rate={1.0}
                        style={styles.storyItemVideo}
                    />
                ) : (
                    <AnimatedFastImage
                      source={{uri: imageBaseUrl.replace('{}', item._id), priority: FastImage.priority.normal,}}
                      style={[this.state.storyItemTextStyle,this.state.animatedStyle]}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                )}
                <View style={styles.goButtonContainer}>
                    <TouchableOpacity onPress={this.props.go} style={styles.goButton}>
                        <Image style={styles.goButonImage} source={require('../../assets/images/go.png')}/>
                    </TouchableOpacity>
                </View>
                {item.type === TASK_GROUP_TYPES.STORY ? (
                    <View style={this.state.storyContent}>
                        <Text
                            style={styles.storyItemTitle}>
                            {item.name}
                        </Text>
                        {/* <ReadMore
                numberOfLines={4}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}> */}
                        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>



                            {this.state.morePressed ?
                                <Text style={styles.storyItemText}>{this.renderAbstractOrDescription(item)} </Text> :
                                <Text  style={styles.storyItemText} numberOfLines={4}>{this.renderAbstractOrDescription(item) + '... '}</Text> }
                            <TouchableOpacity hitSlop={{
                                top: 10,
                                bottom: 10,
                                right: 10,
                                left: 10
                            }}
                                              onPress={
                                                  this.state.morePressed ? () => {
                                                          Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImage.height,duration:500}).start(); this.setState({storyItemTextStyle: styles.storyItemImage, storyContent: styles.storyContent});
                                                          this.onMorePressed()
                                                      } :
                                                      () => {
                                                          Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImageMin.height,duration:500}).start(); this.setState({storyItemTextStyle:styles.storyItemImage, storyContent:{...styles.storyContent, height: styles.storyContentExpanded.height} })
                                                          this.onMorePressed()
                                                      }
                                              }>
                                {this.state.morePressed ?
                                    <Text style={styles.showOrLess}
                                        // onPress={() => { Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImage.height,duration:500}).start(); this.setState({storyItemTextStyle: styles.storyItemImage, storyContent: styles.storyContent});
                                        //this.onMorePressed()
                                        //}}
                                    >
                                        less
                                    </Text>
                                    :
                                    <Text
                                        //onPress={() => {Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImageMin.height,duration:500}).start(); this.setState({storyItemTextStyle:styles.storyItemImage, storyContent:{...styles.storyContent, height: styles.storyContentExpanded.height} })
                                        //   this.onMorePressed()
                                        // }}
                                        style={styles.showOrLess}>Read more</Text>}
                            </TouchableOpacity>



                        </View>

                        {/* </ReadMore>              */}
                    </View>
                ) : (
                    <View style={this.state.storyContent}>
                        <Text
                            style={styles.challengeItemTitle}
                            numberOfLines={1}
                        >
                            {item.name}
                        </Text>
                        <Text
                            style={styles.challengeItemText}
                            numberOfLines={4}
                        >
                            {item.description}
                        </Text>
                    </View>
                )}
                <View style={styles.storyTagContainer}>
                    {item.type !== TASK_GROUP_TYPES.STORY && (
                        <Text style={{...styles.storyTag, ...styles.objectiveTag}}>
                            {item.type.toUpperCase()}
                        </Text>
                    )}
                    <View style={styles.storyTagImageContainer}>
                        <Image style={styles.storyTagImage} source={require('../../assets/images/clock.png')}/>
                        <Text style={{...styles.storyTag, ...styles.quotaTag}}>
                            {`0/${item.quota || 0}`}
                        </Text>
                    </View>
                    {item.reward && (
                        <View style={styles.storyTagImageContainer}>
                            <Image style={styles.storyTagImage} source={require('../../assets/images/sparks.png')}/>
                            <Text style={{...styles.storyTag, ...styles.rewardTag}}>
                                {`${item.reward.value || 0}`}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[
                    (!item.sequence || !item.groupName) && {display: 'none'},
                    styles.sequenceText]}>#{item.sequence} Of {(item.groupName || '').toUpperCase()}</Text>
                {
                    this.state.isStoryLocked ? <View style={{
                        backgroundColor: 'rgba(0,0,0,0.84)',
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        zIndex: 999
                    }}
                    >
                        <Image source={require('../images/story_lock.png')}/>
                    </View> : <View/>
                }
            </View>
        );
    }

    setModalVisible = () => {
        this.props.setModalVisible(
            !this.props.modalVisible,
            this.state.item._id,
            this.state.item.type,
            this.state.item.bonusSparks
        )
    }

    _renderTruncatedFooter = (handlePress) => {
        return (
            <TouchableOpacity
                hitSlop={{
                    top: 10,
                    left: 10, right: 10, bottom: 10
                }}
                onPress={() => {Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImageMin.height,duration:500}).start(); this.setState({storyItemTextStyle:styles.storyItemImage, storyContent:{...styles.storyContent, height: styles.storyContentExpanded.height} }); handlePress();}}>
                <Text style={styles.showOrLess} >
                    more
                </Text>
            </TouchableOpacity>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={styles.showOrLess} onPress={() => { Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImage.height,duration:500}).start(); this.setState({storyItemTextStyle: styles.storyItemImage, storyContent: styles.storyContent}); handlePress();}}>
                less
            </Text>
        );
    }

    _handleTextReady = () => {
        // ...
    }

}
