import { Platform, StyleSheet } from 'react-native';

const fontFamilyName = Platform.OS === 'ios' ? "SFUIDisplay-Regular" : "SF-UI-Display-Regular";

export default StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 40 : 0,
        flex: 1,
        width: window.width,
        height: window.height,
        borderTopLeftRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        justifyContent:'flex-start',
        elevation: 16,
        
    },
    item: {
        //paddingTop: 5,
        color: '#4F4F4F',
        fontFamily:'Gilroy-Regular'
        
    },
    Header: {
    fontFamily: 'Gilroy-Bold',

    },
});
