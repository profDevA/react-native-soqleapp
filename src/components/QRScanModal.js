import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Text, SafeAreaView } from "react-native";
import styles from "../stylesheets/QRCodeViewStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { RNCamera } from 'react-native-camera';
import { QRScannerView } from 'react-native-qrcode-scanner-view';

import {API_BASE_URL} from "../config";
import * as axios from 'axios';
const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: {'Content-type': 'application/json'}
});

export default class QRScanModal extends Component {

  onBarCodeRead=(scanResult)=>{
    console.log("onBarCodeRead start")
    console.log(scanResult.type);
    console.log(scanResult.data);
    if (scanResult.data != null) {
      console.log('onBarCodeRead call', scanResult.data);
      instance.get(`${API_BASE_URL}/getGroupWithMessage?_id=${scanResult.data}`)
          .then((response) => {
            console.log("onBarCodeRead response ", response)
            this.props.onQRcodeDetect(response);

          })
    }
    return;
  }

  renderMenu = () => {
    return (
      <View style={{alignSelf: "center", height: 120, backgroundColor: "transparent", alignItems: "center", justifyContent: "flex-start"}}>
        <View 
          style={{
            alignSelf: "center", 
            height: 80, 
            backgroundColor: "black", 
            opacity: 0.5, 
            width: "60%", 
            alignItems: "center", 
            justifyContent: "flex-start"}}>
          <Text style={{color:'white',textAlign:'center'}}>Position the QR Code within the frame.</Text>
          <Text style={{color:'white',textAlign:'center'}}>Open your friend's group and press info icon -> QR icon</Text>
        </View>
      </View>
    )
  } 

  render() {
    const {
      modalVisible,
      onRequestClose,
    } = this.props;

    return (
      <Modal
        hardwareAccelerated
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        <SafeAreaView style={styles.fullcontentContainer}>
            <View style={styles.fullcontentContainer}>
                <View style={styles.headerTopView}>
                    <TouchableOpacity
                        style={styles.fulliconcontainer}
                        onPress={onRequestClose}>
                        <Icon name="arrow-circle-left" color='white' style={styles.closeIcon} />
                    </TouchableOpacity>
                    <Text style={styles.modalHeaderTitleStyle}> Scan and join your friend's group using QR code </Text>
                    
                </View>
            <QRScannerView
                hintText=""
                cornerStyle={{borderWidth: 6, width: 56, height: 56,
                  borderColor: '#0DE6CF'}}
                onScanResult={ this.onBarCodeRead }
                renderHeaderView={ null }
                renderFooterView={ this.renderMenu }
                isShowScanBar={ false }/>
            </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
