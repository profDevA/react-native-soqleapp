import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { Container, Button } from 'native-base';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import NewsFeedStyle from "../stylesheets/NewsFeedStyle";
import { getNotifications } from '../realm/RealmHelper';

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS == 'ios' ? 90 : 70;
const MARGIN_TOP = Platform.OS == 'ios' ? 40 : 10;

class UserNotificationView extends Component {
    state = {
        notificationsList: [],
    };

   componentDidMount(){
    const notifications = getNotifications();
    console.log("notifications to display ", notifications)
    const notificationsList = Object.keys(notifications).map((e,i) => ({...notifications[e], key: `key_${i}`}));
    this.setState({
        notificationsList,
    })
   }

  render() {
    return (
        <Container>
        <ScrollView style={{flex: 1, marginTop: HEADER_HEIGHT}}>
      <View style={styles.container}>
        <FlatList
          data={this.state.notificationsList}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
          return(
            <View style={{ ...styles.view, ...(item.type === "Unread Messages" ? {backgroundColor: 'rgba(31, 190, 184, 0.22)'} : {}) }}>
              <Image
                style={styles.image}
                source={{uri:"https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg"}}
              />
              <View>
                <Text style={styles.item}>You have {item.message} {item.type}</Text>
                <View style={styles.time}>
                    <Icon
                        name="clock-o"
                        size={18}
                        style={{color: '#979797', marginRight: 3}}
                    />
                  <Text style={styles.timeText}>{moment(item.sent).fromNow()}</Text>
                </View>
              </View>
              <View style={styles.viewButton}>
                <Icon
                    name='heart'
                    size={20}
                    style={{color: 'rgba(150, 0, 161, 0.4)'}}
                />

              </View>
            </View>
          )}}
          renderSeparator={(sectionId, rowId) =>
                      <View key={rowId} style={styles.separator} />}
        />
      </View>
    </ScrollView>

      <View style={styles.headerBackground}>
                  <View style={styles.headerMainView}>
                      <View style={{ flex: 0.8, flexDirection: "row" }}>
                          <Button
                            transparent
                            vertical
                            style={{ width: width * 0.1, borderWidth: 0, marginTop: 10, alignSelf:'flex-start' }}
                            onPress={() => this.props.navigation.pop()}
                          >
                            <Image
                              style={{ height: 20, width: 10 }}
                              source={require("../images/BackImage.png")}
                            />
                          </Button>
                          <Text style={{ alignSelf:'center',fontSize: 20,color: '#3C1364'}} >Notifications</Text>
                      </View>
                  </View>
              </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {

  },
  view:{
    minHeight: 70,
    flex: 1,
        paddingRight: 15,
        paddingLeft: 10,
        paddingTop: 13,
        paddingBottom: 13,
        borderBottomWidth: 1,
        borderColor: '#B0B4BA',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 20,

  },
  image:{
    height: 44,
    width: 44,
    marginRight: 13,
    borderRadius: 40,
  },
  time:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText:{

    fontSize: 10,
    lineHeight: 20,

    //  letterSpacing: '-0.016em',

    color: '#979797',
  },
  viewButton:{
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 13,
  },
  viewImage:{
    height: 24,
    width: 24,
    borderRadius: 40,
  },
  separator: {
        height: 1, width: "100%", backgroundColor: "#B0B4BA"
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
})

export default UserNotificationView;
