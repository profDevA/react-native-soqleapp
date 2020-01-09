import React, {Component} from 'react'
import {View, Modal, Text, TouchableOpacity} from 'react-native'
import styles from '../stylesheets/PincodePopStyle'
import PropTypes from "prop-types";
import CodeInput from '../components/ConfirmationCodeInput';
import Icon from "react-native-vector-icons/FontAwesome";

export default class PincodePopup extends Component {
    state = {
        code: '',
        response: false
    };
    validateValues = () => {
        const {code} = this.state
        if((!code || code.length < 5) && this.props.emptyErr) {
            alert(this.props.emptyErr)
            return false
        }
        return true
    }
    static propTypes = {
        animationType: PropTypes.string,
        //transparent: PropTypes.boolean,
        //modalVisible: PropTypes.modalVisible,
        onRequestClose: PropTypes.func,
        onSubmit: PropTypes.func,
        emptyErr: PropTypes.string
    }
    static defaultProps = {
        animationType: 'slide',
        transparent: true,
        onRequestClose: () => {
        },

    }

    onSubmit = () => {
        const {code} = this.state
        if (this.validateValues()) {
            this.props.onSubmit({code})
            this.props.onRequestClose()
        }
    }

    render() {
        const {animationType, transparent, modalVisible, onRequestClose} = this.props
        return (
            <Modal
                hardwareAccelerated
                animationType={animationType}
                transparent={transparent}
                visible={modalVisible}
                onRequestClose={onRequestClose}>
                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={onRequestClose}>
                            <Icon name='close' color={'white'} style={styles.closeIcon}/>
                        </TouchableOpacity>

                        <Text style={styles.headingText}>ENTER CODE:</Text>
                        <CodeInput
                            containerStyle={styles.codeInputContainer}
                            codeInputStyle={styles.codeInputStyle}
                            codeLength={5}
                            size={30}
                            space={10}
                            cellBorderWidth={1.5}
                            className={'border-b'}
                            autoFocus={false}
                            activeColor={'yellow'}
                            inactiveColor={'#fff'}
                            compareWithCode={null}
                            onFulfill={(code) => {}}
                            onCodeChange={(code) => this.setState({code})}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={this.onSubmit}>
                            <Text style={styles.submitText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}
