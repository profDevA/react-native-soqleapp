import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    contentView: {
        flex: 1,
        backgroundColor: '#2C2649',
        padding: 10,
    },
    sortPicker: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        width: '100%'
    },
    sparkTile: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    sparkTileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    sparkTileTitle: {
        fontSize: 17,
        color: '#000000',
        width: '75%'
    },
    sparkTileToken: {
        fontSize: 18,
        color: '#9600A1'
    },
    sparkTileDate: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 13
    },
    sparkTileUser: {
        color: '#1FBEB8',
        fontSize: 15
    }
});