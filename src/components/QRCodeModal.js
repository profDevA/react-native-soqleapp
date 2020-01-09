import React, { Component } from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import styles from "../stylesheets/QRCodeViewStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import QRCode from "react-native-qrcode-svg";

export default class QRCodeModal extends Component {
  render() {
    const {
      modalVisible,
      onRequestClose,
      taskGroupId
    } = this.props;

    return (
      <Modal
        hardwareAccelerated
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.contentContainer}>
          <View style={styles.transparentContainer}>
          <TouchableOpacity
              style={styles.iconContainer}
              onPress={onRequestClose}
            >
              <Icon name="close" color='white' style={styles.closeIcon} />
            </TouchableOpacity>
            <QRCode
                value={taskGroupId}
                size={200}
               />
          </View>
        </View>
      </Modal>
    );
  }
}
