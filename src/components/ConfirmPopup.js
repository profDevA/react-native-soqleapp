import React, { Component } from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import styles from "../stylesheets/ConfirmPropupStyles";
import Icon from "react-native-vector-icons/FontAwesome";

export default class ConfirmPopup extends Component {
  render() {
    const {
      animationType,
      modalVisible,
      onRequestClose,
      onYesSubmit,
      onNoSubmit,
      message,
    } = this.props;
    return (
      <Modal
        hardwareAccelerated
        animationType={animationType}
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.contentContainer}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onRequestClose}
            >
              <Icon name="close" color={"#9600A1"} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={styles.headingText}>
              {`${message}`}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 30, justifyContent: 'space-around' }}>
              <TouchableOpacity
                style={[styles.submitButton, {marginRight: 10}]}
                onPress={onYesSubmit}
              >
                <Text style={styles.submitText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, {marginLeft: 10}]}
                onPress={onNoSubmit}
              >
                <Text style={styles.submitText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
