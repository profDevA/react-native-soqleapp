import {Platform, StyleSheet} from 'react-native';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'column'
    },
    contentView: {
        flex: 1,
        backgroundColor: '#2C2649',
        padding: 0,
    }
});