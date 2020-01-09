import { Platform, StyleSheet } from 'react-native';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: 'white',
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : 20,
    },
    viewMain: {
        flexDirection: 'row'
    },
    header: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
    },
    headerText: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    headerBackIcon: {
        color: '#130C38',
        fontSize: 20,
    },
    imageUser: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    txtName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 3,
    },
    txtComment: {
        fontSize: 14,
        margin: 3.2,

    },
    txtDesignation: {
        color: 'gray',
        fontSize: 14,
        marginLeft: 3,
    },
    txtMemberCount: {
        fontSize: 18,
        color: '#20B8BE',
        marginRight: 20,
    },

    imgSearchIcon: {
        top: 1,
        right: 3,
        position: 'absolute',
        width: 40,
        height: 40,
    },
    listStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: '2%',

    },
    viewSearchMemCount: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
    },
    avatar: {
        width: 60,
        height: 60,
    },
    eyeImg: {
        width: 20,
        height: 20,
    },
    eyeWithCross: {
        width: 25,
        height: 25,
    },
    eyeBtn: {
        marginRight: 30
    },
    likeImgIcon: {
        position: 'absolute',
        width: 17.23,
        height: 16,
        left: 303,
        top: 5,
        borderColor: '#D8D8D8',
    },
    likeCount: {
        position: 'absolute',
        width: 17.23,
        height: 16,
        left: 333,
        top: 5,
    },
    viewBottomContainInput: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginBottom: 10,
        
    },
    viewInput: {
        flex: 9,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        height: 35,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 5,
        marginRight: 10
    },
    attchment: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        paddingLeft: 35,
        fontSize: 15,
        color: '#A1A1A1',
    },
    sendIcon: {
        paddingRight: 35, paddingTop: 1.5
    },
});

export default styles;

/* Vector */

