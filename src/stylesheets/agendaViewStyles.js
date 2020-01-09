import {Platform, StyleSheet} from 'react-native';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 20;

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    activityLoaderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        color: '#ffffff',
    },
    separator: {
        flex: 1,
        height: 2,
        backgroundColor: '#8E8E8E',
    },
    accordionHeader: {
        backgroundColor: '#120B34',
        paddingHorizontal: 22,
        paddingVertical: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    accordionIcon: {
        color: '#1FBEB8',
        marginTop: 5,
        fontSize: 15,
    },
    itemName: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    itemTime: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 5
    },
    itemCount: {
        fontSize: 15,
        color: '#1FBEB8',
    },
    taskView: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
    },
    taskTime: {
        textAlign: 'right',
        paddingRight: 32,
        fontSize: 13,
        color: 'rgba(19, 12, 56, 0.4)',
    },
    taskText: {
        lineHeight: 18,
        fontSize: 15,
        color: 'rgba(19, 12, 56, 0.6)',
        paddingHorizontal: 32,
        paddingVertical: 5,
        textAlign: 'justify',
    },
    taskSeparator: {
        marginVertical: 5,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    listLoader: {
        paddingVertical: 10,
    }
});
