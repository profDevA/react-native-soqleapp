import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    circle: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    menu: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 10,
        height: 60
    },
    menuItemText: {
        fontSize: 20
    }
});