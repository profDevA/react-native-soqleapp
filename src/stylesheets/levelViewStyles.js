import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    contentView: {
        flex: 1,
        backgroundColor: '#2C2649'
    },
    levelTile: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center'
    },
    levelTitle: {
        color: '#000000',
        fontSize: 18,
        paddingBottom: 1,
    },
    levelCircle: {
        overflow: 'hidden',
        marginRight: 10,
    },
    levelCircleText: {
        fontSize: 15,
    },
    levelText: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 14,
    },
    levelTags: {
        marginTop: 5,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    levelTag: {
        backgroundColor: '#9600A1',
        overflow: 'hidden',
        borderRadius: 14,
        color: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        marginTop: 5,
        marginRight: 6,
    },
    levelStatus: {
        overflow: 'hidden',
        color: '#1FBEB8',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: 5,
        marginRight: 6,
        fontWeight: '500'
    }
});