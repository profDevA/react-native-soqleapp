import { Platform, StyleSheet,Dimensions } from 'react-native';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
var { width} = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor:'white',
        flex: 1,
    },
    viewMain:{
        flexDirection:'row'
    },
    header: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    headerBackIcon: {
        color: '#130C38',
        fontSize: 20,
    },
    memberEditIcon: {
        color: '#20B8BE',
        fontSize: 20,
    },
    headerBackView:{
        width: width*.06,
        height:width*.06,
    },
    imageUser:{
        width: 40,
        height:40,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    txtName:{
        fontSize:16,
        fontWeight: 'bold',
        marginLeft:3,
    },
    txtDesignation:{
        color:'gray',
        fontSize:14,
    },
    txtMemberCount:{
        fontSize: 18,
        color:'#20B8BE',
        marginRight:20,
    },
    imgSearchIcon:{
        top:1,
        right: 3,
        position: 'absolute',
        width:40,
        height:40,
    },
    listStyle:{
        marginTop:'10%',
    },
    viewSearchMemCount:{
        flexDirection:'row',
        marginLeft:10,
        marginRight:10,
    },
    avatar: {
        width: 60,
        height: 60,
    },
    eyeImg:{
        width: 20,
        height:20,
    },
    eyeWithCross:{
        width:25,
        height:25,
    },
    eyeBtn:{
        marginRight:30
    }
});

export default styles;
