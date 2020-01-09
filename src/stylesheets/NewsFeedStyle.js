import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet, Dimensions, Platform } from "react-native";

import { MAIN_COLOR } from "../constants";
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS == 'ios' ? 90 : 70;
const MARGIN_TOP = Platform.OS == 'ios' ? 40 : 10;

export default StyleSheet.create({
  horizontalContent: {
    padding: 10,
    maxHeight: 150
  },
  horizontalContentViewOne: {
    flexDirection: "row"
  },
  horizontalContentViewTwo: {
    flex: 3,
    height: 130,
    alignSelf: "flex-start"
  },
  horizontalContentViewImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#9601a1",
    marginTop: 10,
    marginLeft: 8,
    padding: 2
  },
  horizontalContentImageView: {
    height: 90,
    width: 90,
    borderRadius: 50
  },
  horizontalContentViewImageBackground: {
    flexDirection: "row",
    marginTop: 95,
    marginLeft: 80,
    position: "absolute"
  },
  tabStyle: {
    backgroundColor: "#9601a1",
    borderBottomWidth: 5,
    borderBottomColor: "#ce93d2"
  },
  tabTextStyle: {
    color: "#fff"
  },
  tabActiveTabStyle: {
    backgroundColor: "#9601a1"
  },
  favouriteIconStyle: {
    maxHeight: 20,
    maxWidth: 20,
    borderRadius: 7
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor:'#fff',
    height: HEADER_HEIGHT 
  },
  headerMainView: {
    flexDirection: "row",
    flex: 1,
    marginTop: MARGIN_TOP,
    marginLeft: 10,
    marginRight: 10
  },
  headerInnerView: { 
    flex: 1,
    flexDirection: "row"
  },
  headerButton: {
    marginLeft: 5,
    marginRight: 5
  },
  headerButtonIcon: {
    height: width * 0.08,
    width: width * 0.08
  },
  headerFontIcon: {
    height: 30,
    width: 20,
    color: "#fff"
  },
  viewTab: {
    flex: 1,
    // marginTop: 270
  },
  buttonTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTab: {
    color: '#fff',
    fontSize: 14
  }
});
