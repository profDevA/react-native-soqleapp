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
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, widthPercentageToDP, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Thumbnail, Input, Item } from 'native-base';
import FastImage from 'react-native-fast-image';
const UnlockStory = ({
    showUnlock,
    closeUnlockView,
    code,
    modalSetCode,
    unlockCode,
    user,
    goToUserTasksScreen,
    goToProfileScreen,
}) => (
        <Modal
            transparent={true}
            isVisible={showUnlock}
            style={{
                justifyContent: "flex-end",
                margin: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                // padding: 22,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                borderColor: 'rgba(0, 0, 0, 0.1)'
            }}
        >
            <View
                style={{

                    flex: 1,
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    width: '100%',
                    backgroundColor: '#FFFFFF'
                }}>
                <TouchableOpacity
                    onPress={closeUnlockView}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginHorizontal: hp('3%'),
                        marginVertical: hp('5%')
                    }}>
                    <MaterialIcon
                        name='close'
                        size={30}
                        color="#828282" />
                </TouchableOpacity>
                <View
                    style={{
                        marginHorizontal: hp('3%'),
                        marginBottom: hp('1%'),

                        flexDirection: 'row'
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Gilroy-Bold',
                            fontSize: 24
                        }}>
                        Unlock
                            </Text>
                    <Text
                        style={{
                            left: hp('1%'),
                            fontFamily: 'Gilroy-Light',
                            fontSize: 24
                        }}>

                        a story
                        </Text>
                </View>

                <Text
                    style={{
                        marginHorizontal: hp('3%'),
                        marginBottom: hp('2.5%'),
                        fontSize: 14,
                        color: '#9A9A9A',
                        fontFamily: 'Gilroy-Light'
                    }}>
                    Key in the code provided by your teacher
                                    </Text>
                <View
                    style={{
                        borderColor: '#BDBDBD',
                        paddingLeft: hp('1%'),
                        borderWidth: 0.5,
                        marginHorizontal: hp('3%'),
                        height: 40,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}>
                    <Input
                        placeholder={'Enter Your Code Here'}
                        placeholderTextColor={' #E0E0E0'}
                        value={code}
                        autoCapitalize='none'
                        onChangeText={modalSetCode}
                    />
                </View>

                <TouchableOpacity
                    onPress={unlockCode}
                    style={{
                        paddingTop: hp('0.50'),
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
                    <TouchableOpacity onPress={goToProfileScreen}>
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
                  
                    {user.userTaskGroupIds.length > 0 && <FastImage
                        source={require('../images/Vector.png')}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                            height: 30, width: 25,
                        }}
                    />}
                    {user.userTaskGroupIds.length > 0 && <TouchableOpacity onPress={goToUserTasksScreen}>
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
            </View>
        </Modal>
    )
export default UnlockStory;
