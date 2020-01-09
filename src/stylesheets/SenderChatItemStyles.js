import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    item: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    itemText: {
        color: '#ffffff',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#56478C',
        paddingVertical: 5,
        paddingBottom: 8,
        paddingHorizontal: 10,
    }
});
