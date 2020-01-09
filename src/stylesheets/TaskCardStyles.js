import {Dimensions, StyleSheet} from 'react-native';

export const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    keyText: {
      color: '#fff',
      fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    swipeItem: {
        width: width - 40,
        // alignSelf: 'center',
        borderRadius: 5,
        marginVertical: 6,
    },
    topWrapper: {
        padding: 10,
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        // alignItems: 'center'
    },
    subItems:{
        flexDirection: 'row'
    },
    textWhite: {
        color: '#FFFFFF'
    },
    eyeIcon: {
        fontSize: 20,
        paddingHorizontal: 10,
        marginLeft: 5
    },
    facePile: {
        width: '100%',
        justifyContent: 'flex-end',
        padding: 10,
        borderColor: 'white'
    },
    memberWrapper: {
        backgroundColor: '#1FBEB8',
        flex: 1,
        flexDirection: 'column'
    },
    taskItem: {
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    taskItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    taskItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#000000',
        width: '90%'
    },
    taskItemSize: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    taskItemDescription: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 13,
        marginBottom: 5
    },
    taskItemTime: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 13,
    },
    taskItemFooter: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeIconStyle:{
        maxHeight: 16, 
        maxWidth: 16,
        marginRight: 5
    },
    taskItemExpiry: {
        flex: 1,
        color: '#2C2649',
        fontSize: 14,
    },
    taskItemExpiryIcon: {},
    taskItemXP: {
        color: '#9600A1',
        fontSize: 18,
        fontWeight: 'bold'
    },
    listLoader: {
        paddingVertical: 10,
    },
    taskItemScore: {
        marginTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskItemTextScore: {
        flex: 1,
        color: '#9600A1',
        fontSize: 16,
        marginTop: -20,
        fontWeight: 'bold'
    },
    chatViewStyle: {
        maxHeight: 20
    },
    chatIconStyle: {
        maxHeight: 16, 
        maxWidth: 16,
        marginBottom: 5
    },
    chatCountStyle: {
        color: '#9600A1',
        fontSize: 10,
        position: 'absolute',
        bottom: 0,
        marginLeft: 10
    },
});
