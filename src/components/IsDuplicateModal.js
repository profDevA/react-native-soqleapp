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
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get('window').height // full width
const IsDuplicateModal = ({
    modalVisible,
    propagateSwipeValue,
    swipeDirectionValue,
    backdropColorValue,
    closeIsDuplicateModal,
    onPressGoToGroup,
    createGroup,
    radiusValue
}) => (
        <Modal
            isVisible={modalVisible}
            propagateSwipe={propagateSwipeValue}
            swipeDirection={swipeDirectionValue}
            backdropColor={backdropColorValue}
        >
            <View
                style={{
                    // justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    //alignItems: 'center',
                    height: height * 27 / 100,
                    width: width * 60 / 100,
                    borderRadius: 8,
                    padding: 10,
                    marginTop: hp('1%'),
                    //  borderRadius: radiusValue,
                    justifyContent: 'center'
                }}>
                <TouchableOpacity
                 style={{ alignSelf: 'flex-end' }} 
                 onPress={closeIsDuplicateModal} >
                    <FastImage source={require('../images/close.png')} style={{ height: 13, width: 13 }} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: hp('2.15%'),
                        color: 'black',
                        alignSelf: 'center',
                        fontFamily: 'Gilroy-Bold',
                        marginTop: hp('1%'),
                    }} >
                    {'DUPLICATE'}
                </Text>
                <Text
                    style={{
                        fontSize: hp('1.74%'),
                        color: 'black',
                        marginTop: hp('1%'),
                        alignSelf: 'center',
                        fontFamily: 'Gilroy-Light'
                    }} >{'You already have an existing group for this story!'}
                </Text>
                <TouchableOpacity
                    onPress={onPressGoToGroup}
                    style={{
                        backgroundColor: '#3C1464',
                        width: '100%',
                        padding: 10,
                        marginTop: hp('1%'),
                        borderRadius: radiusValue,
                        justifyContent: 'center'
                    }}>
                    <Text style={{
                        alignSelf: 'center',
                        color: 'white',
                        fontFamily: 'Gilroy-Bold'
                    }} >
                        {'GO TO MY GROUP'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={createGroup}
                    style={{
                        backgroundColor: '#0DE6CF',
                        width: '100%',
                        padding: 10,
                        marginTop: hp('1%'),
                        borderRadius: radiusValue,
                        justifyContent: 'center'
                    }}>
                    <Text style={{
                        alignSelf: 'center',
                        color: 'white',
                        fontFamily: 'Gilroy-Bold'
                    }} >
                        {'CREATE ANYWAY'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )

export default IsDuplicateModal;