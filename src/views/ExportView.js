import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, Picker, Dimensions, TouchableOpacity, ScrollView, CheckBox, FlatList} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Content, Card, CardItem, Body, Thumbnail, Left, Right } from 'native-base';
import { DEFAULT_SHARE, DEFAULT_AVATAR, MAIN_COLOR } from '../constants';
import FastImage from 'react-native-fast-image';
import { getUserTaskGroupsById, getCurrentUserFromUserTaskGroupsTeam, getAllSharesFromUserProfiles } from "../utils/grouputil";
import {  getSharesById, setShareExport } from "../realm/RealmHelper";
import * as axios from 'axios';
import { API_BASE_URL, BUGSNAG_KEY } from '../config';
import { ExportImageView } from '../components/ExportImageView';
import _ from 'lodash';
import {showMessage} from 'react-native-flash-message';
import {trackMixpanel, trackError} from '../utils/common';
const { width, height } = Dimensions.get('window')
import BaseComponent from "./BaseComponent";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});


export default class ExportView extends BaseComponent {
  static flashMessage = message => showMessage({message, type: MAIN_COLOR});

    constructor(props) {
        super(props);
        this.state = {
            selectedGroup: '',
            userTaskGroups: [],
            sharesFromUsers: [],
            selectedImages: {},
            user: this.props.navigation.state.params && this.props.navigation.state.params.user,
            list: [{}]
        }
        if (!this.state.user){
          this.state.user= this.props.user;
        }
        this.findSharesAndUserTaskFromRealm = this.findSharesAndUserTaskFromRealm.bind(this);
        this.goBack = this.goBack.bind(this);
        this.selectedImageItem = this.selectedImageItem.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
        this.filterShared = this.filterShared.bind(this);
        this.selectSubmittedShare = this.selectSubmittedShare.bind(this);
    }
    componentDidMount(){
        super.componentDidMount();
        this.findSharesAndUserTaskFromRealm();
    }
    goBack() {
        this.props.navigation.pop();
    }
    selectGroup(itemValue) {
        this.setState({selectedGroup: itemValue})

        let userTaskGroups = this.state.userTaskGroups.filter(group => (itemValue === 'all' || itemValue === group._id));

        this.filterShared(userTaskGroups);
    }
    filterShared(userTaskGroups){
        let usersFromTeamsInGroups = getCurrentUserFromUserTaskGroupsTeam(this.state.user._id, userTaskGroups);

        let sharesFromUsers = getAllSharesFromUserProfiles(usersFromTeamsInGroups);

        this.setState({
            sharesFromUsers: sharesFromUsers ? sharesFromUsers : []
        })
    }
    downloadAll() {
        const arr = Object.values(this.state.selectedImages);
        console.log("arr", arr)
        let unselectedIds = [];
        let shareIds= [] //ids of shares, needed for the api call

        let allShares=this.state.sharesFromUsers;

        //prepare to send the updated statuses of each share to API
        allShares.forEach(share =>{
          const found = arr.find(function(s) { //compare vs selected images (in arr)
              return s._id == share._id;
            });

          if (found) { shareIds.push(share._id); }
          else { unselectedIds.push(share._id); }
        })

        const data = {
          shareIds: shareIds,
          unselectedIds: unselectedIds,
        }

        let latestShares;
          instance.post(`${API_BASE_URL}/exportShares`, data)
            .then(response => {
                  if (response) {
                    let selected=0;
                    response.data.forEach( share => {
                        //update state and realm with the return
                        let sharesState=this.state.sharesFromUsers;
                        sharesState.forEach(stateShare => {
                          if (stateShare._id==share._id)
                          {
                              if (share.submit==true){ selected++}; //to show on the flashmessage
                              const updated=setShareExport(stateShare, share.submit); //update realm
                          }
                        })
                    })
                    ExportView.flashMessage(selected+ " shares will be submitted!");
          }
      }).catch(err => {
          console.log('ExportView Export Shares Err ', err);
          bugsnag.notify(err);
        });
    }



    findSharesAndUserTaskFromRealm() {
        // console.log('findSharesAndUserTaskFromRealm');
        // console.log(this.props.user);

        let userTaskGroups = getUserTaskGroupsById(this.state.user.userTaskGroupIds);
        // console.log('userTaskGroups');
        // console.log(userTaskGroups);

//        let usersFromTeamsInGroups = getCurrentUserFromUserTaskGroupsTeam(this.props.user._id, userTaskGroups);
        // console.log('usersFromTeamsInGroups');
        // console.log(usersFromTeamsInGroups);

//        let sharesFromUsers = getAllSharesFromUserProfiles(usersFromTeamsInGroups);
        // console.log('sharesFromUsers');
        // console.log(sharesFromUsers);

        let shareIds = [];
        this.state.user.shares.map((share)=>{ shareIds.push(share._id); });
        let shares=getSharesById(shareIds);

        let selectedImages = this.selectSubmittedShare(shares);

        this.setState({selectedImages:selectedImages});
        this.setState({userTaskGroups: userTaskGroups ? userTaskGroups : []})
        this.setState({sharesFromUsers: shares}) //sharesFromUsers ? sharesFromUsers : []})
    }

    selectSubmittedShare(shares) {
        const selectedImages = {};

        if (shares){
          shares.forEach((share) => {
              if(share.submit){
                  selectedImages[share._id] = share;
              }
          });
        }

        return selectedImages;
    }

    shouldComponentUpdate(nextProps, nextState)
    {
      console.log("shouldcomponentupdate")
      return (
        !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
      );
    }

    selectedImageItem(item, remove) {
        // console.log(remove);
        const selectedImages = {...this.state.selectedImages};
        // console.log(selectedImages);
        if(remove) {
            delete selectedImages[item._id];
        } else {
            selectedImages[item._id] = item;
        }
        this.setState({selectedImages:selectedImages});
        // console.log(selectedImages);
    }

    isSelected(itemId){
        if(this.state.selectedImages[itemId]) {
            return true;
        }
        return false;
    }

    render() {
      console.log("render exportview")

        return (
            <SafeAreaView style={{flex:1, backgroundColor: '#ffffff'}}>
                <View style={{flexDirection:'row', alignItems:'center', paddingTop:5, paddingBottom:5}}>
                    <Button transparent vertical style={{ width: 50, borderWidth: 0}} onPress={()=>this.goBack()}>
                        <Image
                            style={{ height: 20, width: 10, }}
                            source={require('../images/BackImage.png')} />
                    </Button>
                    <View style={styles.GroupPicker}>
                        <Picker
                            style={{height: 35,width: '100%', color:'white'}}
                            value={this.state.selectedGroup}
                            onValueChange={this.selectGroup}>
                            <Picker.Item key='all' label='All' value='all' />
                            {this.state.userTaskGroups.map((userTaskGroup)=>{
                                return <Picker.Item key={userTaskGroup._id} label={userTaskGroup.name} value={userTaskGroup._id} />
                            })}
                        </Picker>
                    </View>
                </View>
                <View style={{flexDirection:'row-reverse', margin: 10}}>
                    <TouchableOpacity onPress={()=> this.downloadAll()}>
                        <Text style={styles.DownloadAllText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <FlatList style={{backgroundColor: '#dadada'}}
                    numColumns={2}
                    data={this.state.sharesFromUsers}
                    renderItem={({item}) =>
                        <ExportImageView key={item._id} item={item} selected={this.isSelected(item._id)} selectedImageItem={this.selectedImageItem}/>
                }/>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    GroupPicker: {
        height: 35,
        flex: 1,
        marginRight: 60,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: '#20beb8',
        color: '#ffffff'
    },
    DownloadAllText: {
        textAlign: 'center',
        color: '#9600A1'
    },
    timeIconStyle:{
        maxHeight: 16,
        maxWidth: 16,
        marginRight: 2
    },
    checkbox: {
        borderWidth: 0,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height :width*.06,
        width : width*0.06
    }
});
