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
    TextInput,
    StyleSheet
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, widthPercentageToDP, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Thumbnail, Input, Item } from 'native-base';
import FastImage from 'react-native-fast-image';
import styles from "../stylesheets/storyViewStyles";
const JoinModal = ({
    modalVisible,
    transparentValue,
    closeJoinModal,
    qrCodeScanned,
    addUserToTeam
}) => (
        <Modal
            visible={modalVisible}
            transparent={transparentValue}
            style={[styles.modalContent, { justifyContent: "center", margin: 0, backgroundColor: 'rgba(100,100,100, 0.8)' }]}
        >
            <View style={styles.joinModalMainView}>
                <TouchableOpacity
                    onPress={closeJoinModal}
                    style={styles.joinModalCloseIcon}>
                    <FastImage
                        source={require('../images/closeIcon.png')}
                        style={{ height: 15, width: 15, alignSelf: 'flex-end' }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableOpacity>
                <View style={{ width: '82%' }}>
                    <Text style={styles.joimModalTitle}>
                        {qrCodeScanned && qrCodeScanned.data ? qrCodeScanned.data.name : ''}
                    </Text>
                    <Text style={styles.joinModalDesText}>
                        {qrCodeScanned && qrCodeScanned.data ? qrCodeScanned.data._userStory.description : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('1.5%') }}>
                        <FastImage
                            source={require('../images/Group5.png')}
                            style={{ height: 15, width: 15, right: 3, }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.teamLengthText}>
                            {qrCodeScanned && qrCodeScanned.data ? qrCodeScanned.data._team.users.length + '/' + qrCodeScanned.data._userStory.maxnum : '4/5'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            addUserToTeam(
                                qrCodeScanned.data._team._id,
                                qrCodeScanned.data._id)}
                        style={{
                            width: '100%',
                            marginBottom: 15,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3C1464',
                            height: 30,
                            borderRadius: 30,
                            marginTop: hp('2.8%')
                        }}>
                        <Text style={styles.joinButtonText}>
                            JOIN
            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )

export default JoinModal;