import {StyleSheet} from 'react-native';

import {MAIN_COLOR} from '../constants';

export default StyleSheet.create({
    topProfile: {
        paddingBottom: 20,
        backgroundColor: '#130C38',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    blurBg: {
        backgroundColor: '#130C38'
    },
    headerIcon: {
        fontSize: 25,
        color: 'white'
    },
    headerMenuIcon: {
        fontSize: 15,
        color: 'black'
    },
    avatar: {
        width: 60,
        height: 60,
    },
    inputName: {
        fontSize: 20,
        color: 'white'
    },
    inputTitle: {
        color: '#1FBEB8',
        fontSize: 13
    },
    inputDescription: {
        fontSize: 13,
        color: '#AEAEAE'
    },
    input: {
        height: 20,
        fontSize: 15,
        marginLeft: 10,
    },
    joinButton: {
        marginTop: 5,
        backgroundColor: MAIN_COLOR
    },
    card: {
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 10,
    },
    buttonExt: {
        color: '#8C7DDA'
    }
});