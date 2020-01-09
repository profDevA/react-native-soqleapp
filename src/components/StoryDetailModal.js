import React from 'react';
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
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, widthPercentageToDP, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import IsDuplicateModal from "./IsDuplicateModal";
import styles from "../stylesheets/storyViewStyles";
import Loader from "./Loader";
import {   CHALLENGE_IMAGE_BASE_URL,
    STORY_IMAGE_BASE_URL,
    STORY_VIDEO_BASE_URL,
    TASK_GROUP_TYPES } from "../constants";
import LinearGradient from 'react-native-linear-gradient';
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get('window').height // full width
const storyDetailModal = ({
    visibleValue,
    onRequestCloseValue,
    onBackdropPressValue,
    onSwipeCompleteValue,
    modalVisibleValue,
    closeIsDuplicateModalValue,
    onPressGoToGroupValue,
    createGroupValue,
    radiusValue1,
    item,
    image,
    storyItemTextStyle,
    onRequestCloseModal,
    storyContent,
    morePressed,
    renderAbstractOrDescription,
    onMorePressed,
    processing,
    onMomentumScrollBeginValue,
    ListFooterComponentValue,
    ListEmptyComponentValue,
    dataValue,
    onEndReachedValue,
    addUserToTeam,
    initiateNewGroup,
    path1
}) => (
        <Modal
            animationInTiming={1000}
            animationType={"slide"}
            useNativeDriver={true}
            propagateSwipe={true}
            swipeDirection={'down'}
            transparent={true}
            visible={visibleValue}
            style={[styles.modalContent, { justifyContent: "flex-end", margin: 0 }]}
            onRequestClose={onRequestCloseValue}
            onBackdropPress={onBackdropPressValue}
            onSwipeComplete={onSwipeCompleteValue}
        >
            <IsDuplicateModal
                modalVisible={modalVisibleValue}
                propagateSwipeValue={true}
                swipeDirectionValue={'down'}
                backdropColorValue={'rgba(100,100,100, 0.6)'}
                closeIsDuplicateModal={closeIsDuplicateModalValue}
                onPressGoToGroup={onPressGoToGroupValue}
                createGroup={createGroupValue}
                radiusValue={radiusValue1}
            />

            <View style={styles.likeModalView}>
                <View style={item.type === TASK_GROUP_TYPES.CHALLENGE ? styles.challengeContainer : [styles.storyContainer, { width: '100%' }]}>

                    <View >
                        <FastImage
                            source={{ uri: image}}
                            style={[storyItemTextStyle, {
                                height: hp('48%'),
                                borderBottomRightRadius: width * 11 / 100,
                                borderBottomLeftRadius: width * 11 / 100,
                                overflow: 'hidden'
                            }]}
                            resizeMode={FastImage.resizeMode.cover}
                        >
                            <SafeAreaView>
                                <TouchableOpacity style={{ height: 40, width: 40, left: 10 }}
                                    onPress={onRequestCloseModal}
                                >
                                    <View style={{ height: '100%', width: '100%', position: 'absolute' }} >
                                        <FastImage
                                            source={require('../images/Go_Back.png')}
                                            style={{ height: '100%', width: '100%' }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </SafeAreaView>
                            <LinearGradient
                                colors={['rgba(75, 23, 141, 0)', 'rgba(75, 23, 141, 0)', 'rgba(75, 23, 141, 0.6)', 'rgba(75, 23, 141,0.8)']}
                                style={{
                                    height: hp('53%'),
                                    width: '100%',
                                    zIndex: 2,
                                    borderBottomRightRadius: width * 11 / 100,
                                    borderBottomLeftRadius: width * 11 / 100,
                                    backgroundColor: 'transparent',
                                    shadowOffset: { width: 10, height: 10, },
                                    shadowColor: 'rgba(61,21,100,0)',
                                    shadowOpacity: 1.0,
                                    justifyContent: 'flex-end',
                                }}>
                                <Text numberOfLines={4} style={styles.titleText}>
                                    {item.name}
                                </Text>
                            </LinearGradient>

                        </FastImage>
                        <View style={styles.imageContainer}>
                            {path1 > 0 && <View style={styles.storyTagImageContainer}>
                                <FastImage style={styles.storyTagImage}
                                    source={require('../images/VerifedIcon.png')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <Text style={styles.quotaTag}>
                                    {item.quota + ' paths' || 0}
                                </Text>
                            </View>}
                            {item.reward && (
                                <View style={[styles.storyTagImageContainer, { marginLeft: hp('7%') }]}>
                                    <FastImage style={styles.storyTagImage}
                                        source={require('../images/PlanIcon.png')}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <Text style={{ ...styles.quotaTag }}>
                                        {`${item.reward.value || 0}`}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {item.type === TASK_GROUP_TYPES.STORY ? (
                            <View style={[storyContent, { paddingVertical: 0, backgroundColor: 'white', marginTop: hp('2.5%') }]}>
                                <View style={{ flexWrap: 'wrap', alignSelf: 'center' }}>
                                    <View style={{ marginLeft: hp('3%'), marginRight: hp('3%') }}>
                                        {
                                            morePressed ?
                                                <Text
                                                    style={[styles.storyItemText,
                                                    { color: '#4F4F4F', fontSize: wp('3.8%'), letterSpacing: -0.7, fontFamily: 'Gilroy-Regular', textAlign: 'justify' }
                                                    ]}>
                                                    {renderAbstractOrDescription(item)}
                                                </Text> :
                                                <Text
                                                    numberOfLines={4}
                                                    style={[styles.storyItemText,
                                                    { color: '#4F4F4F', textAlign: 'justify', fontSize: wp('3.8%'), letterSpacing: -0.7, fontFamily: 'Gilroy-Regular' }]}>
                                                    {renderAbstractOrDescription(item) + '... '}
                                                </Text>
                                        }
                                    </View>
                                    <TouchableOpacity onPress={onMorePressed} activeOpacity={0.9} >
                                        {morePressed ?
                                            <Text
                                                style={[styles.showOrLess,
                                                { marginLeft: hp('1%'), paddingLeft: 15, paddingRight: 15, color: '#4F4F4F', fontSize: wp('3.8%'), fontFamily: 'Gilroy-Regular', textAlign: 'justify', }]}
                                            >
                                                less
                           </Text>
                                            :
                                            <Text
                                                style={[styles.showOrLess,
                                                { marginLeft: hp('1%'), paddingLeft: 15, paddingRight: 15, color: '#4F4F4F', fontSize: wp('3.8%'), fontWeight: '600', fontFamily: 'Gilroy-Regular', }]}>
                                                Read more
                                                    </Text>}
                                    </TouchableOpacity>
                                </View>

                            </View>
                        ) : (
                                <View style={storyContent}>
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


                        {processing && (
                            <Loader />
                        ) }
                        <View>
                            {/* <TouchableOpacity style={{ borderRadius: 10, }} activeOpacity={0.9} onPress={() => { this.initiateNewGroup() }}>
                                          <View style={{
                                              height: height * 15 / 100,
                                              width: width * 25 / 100,
                                              backgroundColor: '#0DE6CF',
                                              paddingVertical: hp('1%'),
                                              marginRight: hp('0.50%'),
                                              borderRadius: 10,
                                              marginLeft: hp('1%'),
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
                                                      {'Create a Group'}
                                                  </Text>
                                              </View>
                                          </View>
                                      </TouchableOpacity> */}
                            <FlatList
                                directionalLockEnabled={false}
                                horizontal={true}
                                removeClippedSubviews={true}
                                initialNumToRender={4}
                                onMomentumScrollBegin={onMomentumScrollBeginValue}
                                maxToRenderPerBatch={5}
                                updateCellsBatchingPeriod={100}
                                showsHorizontalScrollIndicator={false}
                                ListFooterComponent={ListFooterComponentValue}
                                ListEmptyComponent={ListEmptyComponentValue}
                                // windowSize={7}
                                onEndReachedThreshold={0.1}
                                data={dataValue}
                                onEndReached={onEndReachedValue}
                                keyboardShouldPersistTaps={true}
                                style={{ zIndex: -9999 }}
                                contentContainerStyle={{ marginLeft: wp('6%'), flexDirection: 'row', flexGrow: 1 }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableWithoutFeedback style={{
                                            position: 'relative',
                                        }}>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() =>addUserToTeam(item._team._id, item._id)}>
                                                {item.addnew ?
                                                    <TouchableOpacity style={{ borderRadius: 10, }} activeOpacity={0.9} onPress={initiateNewGroup}>
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
                                                                    {'Create a Group'}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={{
                                                        height: height * 15 / 100,
                                                        width: width * 25 / 100,
                                                        backgroundColor: '#3C1464',
                                                        paddingVertical: hp('1%'),
                                                        // paddingHorizontal: hp('1%'),
                                                        // justifyContent:'center',
                                                        alignItems: 'center',
                                                        marginRight: hp('2%'),
                                                        borderRadius: 10,
                                                    }}>
                                                        {item._user && <Text style={{ textAlign: 'center', fontSize: hp('1.78%'), color: 'white', fontFamily: 'Gilroy-Bold' }}>{item._user.profile.firstName}</Text>}
                                                        {item._user && <Text style={{ textAlign: 'center', paddingLeft: 10, paddingRight: 10, fontSize: hp('1.74%'), color: 'white', marginTop: hp('1%'), fontFamily: 'Gilroy-Light' }}>{'Team -'}{item.name}</Text>}
                                                        {item._user &&
                                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', alignSelf: 'flex-end', }} >
                                                                <FastImage
                                                                    source={require('../images/member.png')}
                                                                    style={{ height: 15, width: 15 }} />
                                                                <Text
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        paddingLeft: 7,
                                                                        paddingRight: 7,
                                                                        alignSelf: 'flex-end',
                                                                        fontSize: hp('1.35%'),
                                                                        color: 'white',
                                                                        bottom: 0,
                                                                        fontFamily: 'Gilroy-Bold'
                                                                    }}>{item._team.users.length}{'/'}{item._userStory.maxnum}</Text>

                                                            </View>

                                                        }
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                        </TouchableWithoutFeedback>
                                    )
                                }}
                            >
                            </FlatList>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

export default storyDetailModal;
