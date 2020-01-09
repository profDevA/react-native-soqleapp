import { Platform, StyleSheet } from 'react-native';
const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor:'white',
        flex: 1,
    },
    viewTop:{
        backgroundColor:'#F8F8F8',
        borderBottomColor:'#D3D3D3',
        borderBottomWidth:1,
    },
    viewNamePhoto:{
        flexDirection:'row'
    },
    imageUser:{
        width: 50,
        height:50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    txtName:{
        fontSize:20,
        fontWeight: 'bold',
        marginLeft:4,
    },
    txtDesignation:{
        color:'gray',
        fontSize:14,
    },
    txtDescription:{
        fontSize:12,
        color:'#000000',
        marginLeft:10,
    },
    viewBottomBtn:{
        flexDirection:'row',
        width:'100%',
        height: 40,
        marginTop:10,
        justifyContent: 'center',
        alignItems:'center'
    },
    btnSelected:{
        flex:3,
        height:25,
        borderRadius:10,
        backgroundColor:'#9600A1',
        alignItems:'center',
        justifyContent: 'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
    },
    btnCenterNotSelect:{
        flex:3,
        height:25,
        borderRadius:10,
        borderColor: '#9600A1',
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
        borderWidth: 1,
    },
    btnNotSelected:{
        flex:3,
        height:25,
        borderRadius:10,
        borderColor: '#9600A1',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent: 'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
        borderWidth: 1,
    },
    txtSelected:{
        color:'white'
    },
    txtNotSelected:{
        color:'#9600A1'
    },
    headerBackIcon: {
        color: '#130C38',
        fontSize: 20,
        marginLeft:10
    },
    viewContainImage:{
        width:'90%',
        margin:10,
        borderRadius:10,
        height:250,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity:0.5,
        alignSelf:'center'
    },
    imgStyle:{
        borderRadius:10,
        height:150,
        alignSelf: 'center',
    },
    txtMin:{
        position:'absolute',
        right:2,
        top: 2,
        fontSize:12,
        color:'white',
    },
    textGrayLine:{
        fontSize:12,
        color: 'gray'
    },
    txtIluminates:{
        fontSize:12,
        color: '#20B8BE',
        marginRight:2,
        marginLeft:2
    },
});

export default styles;