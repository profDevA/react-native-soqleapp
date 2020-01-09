import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    item: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
    itemText: {
        color: '#ffffff',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#1FBEB8',
        paddingVertical: 5,
        paddingBottom: 8,
        paddingHorizontal: 10,
    }
});