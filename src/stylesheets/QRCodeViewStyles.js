import { StyleSheet, Platform } from "react-native";
const fontFamilyName = Platform.OS === 'ios' ? 'SFUIDisplay-Regular' : 'SF-UI-Display-Regular'

export default StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  fullcontentContainer: {
    flex: 1,
    backgroundColor: "#371c5f"
  },
  headerTopView:{
    flexDirection:"row",
    height: 60,
    backgroundColor: "#371c5f"
  },
  container: {
    backgroundColor: "#371c5f",
    padding: 10,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
    zIndex:999
  },
  transparentContainer: {
    backgroundColor: "#fff",
    padding: 10,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
    zIndex:999
  },
  modalHeaderTitleStyle: {
    fontFamily: fontFamilyName,
    fontSize: 20,
    width: "90%",
    textAlign: 'center',
    color: '#fff',
  },
  iconContainer: {
    width: 28,
    height: 28,
    right: -15,
    top:-12,
    alignSelf:'flex-end',
    alignItems:'center',
    justifyContent: "center",
    position:'absolute',
    borderWidth:1,
    borderRadius:20,
    borderColor:'transparent',
    backgroundColor:'gray'
  },
  fulliconcontainer: {
    width: 28,
    height: 28,
    left: 8,
    bottom:20,
    alignSelf:'flex-end',
    alignItems:'center',
    justifyContent: "center",
    borderRadius:20,
    backgroundColor:'transparent'
  },
  closeIcon: {
    fontSize: 28
  }
});