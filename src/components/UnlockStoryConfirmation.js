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
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get('window').height // full width
const radius =
Math.round(Dimensions.get('window').width + Dimensions.get('window').height) /
2;
const UnlockStoryConfirmation = ({
    isStoryUnlocked,
    unlockedStories,
    onPressClose
}) => (
    <Modal
    transparent={true}
    isVisible={isStoryUnlocked}
    style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}

>
    <View style={{
        justifyContent: 'flex-start',
        alignContent: 'center',
        // height: height * 27 / 100,
        width: width * 60 / 100,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        paddingBottom: 20,
    }}>
        <TouchableOpacity
            onPress={onPressClose}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
            <MaterialIcon name='close' size={20} color="#828282" />
        </TouchableOpacity>
        <Text
            style={{
                textAlign: 'center',
                fontFamily: 'Gilroy-Bold',
                color: '#000000',
                fontSize: hp('2.65%'),
                marginTop: hp('0.3%')

            }}>
            STORY UNLOCKED
                   </Text>
        <Text
            style={{
                textAlign: 'center',
                color: 'black',
                marginTop: hp('1%'),
                fontFamily: 'Gilroy-Light'
            }}>
            You unlocked { unlockedStories && unlockedStories[0] && unlockedStories[0].name}!
                       </Text>
                    
        <TouchableOpacity
            onPress={onPressClose}
            style={{
                backgroundColor: '#3C1464',
                width: '100%',
                padding: 10,
                top: hp('1%'),
                borderRadius: radius,
                justifyContent: 'center',
                marginTop: hp('1.5%'),
            }}>
            <Text style={{ fontFamily: 'Gilroy-Bold', color: '#FFFFFF', alignSelf: 'center' }}>OK</Text>
        </TouchableOpacity>


    </View>
</Modal>
    )
export default UnlockStoryConfirmation;
