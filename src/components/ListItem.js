import React, {Component} from 'react';
import {Text, TouchableWithoutFeedback, View, TouchableOpacity, Share, Image} from 'react-native';

import styles from './../stylesheets/ListItemStyles';

class ListItem extends Component {
    onPressRow() {}
    render() {
        //const {nameUser, phone, dob, image, repeatValue} = this.props.employee;
        let imageIcon = 'https://bootdey.com/img/Content/avatar/avatar6.png';

        return (
            <TouchableWithoutFeedback onPress={this.onPressRow.bind(this)}>
                <View style={styles.viewOuter}>
                    <View style={styles.viewInner}>
                        <View style={styles.mainView}>
                            <View>
                                <Image source={{uri: imageIcon}} style={styles.imageStyle}/>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ListItem;
