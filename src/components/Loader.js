import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Dimensions,
    Image,
    ActivityIndicator
} from 'react-native';
import {
    MaterialIndicator
  } from 'react-native-indicators';
let width = Dimensions.get('window').width;
export default class Loader extends Component {

    render() {
            return (
                <View style={styles.container}>
                    <View style={[styles.loader, { flexDirection: 'row' }]}>
                        {/* <Image
                            style={{width: width/2,height: width/2}}
                            source={require('../images/loader.gif')}
                        /> */}
                              <MaterialIndicator color='#0FE2CA' />

                    </View>
                </View>
            )
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0007',
        position: 'absolute',
        top: 0, left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 100000
    },
    loader: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, 0.7)',
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 0.7,
            },
        }),
    },
});
