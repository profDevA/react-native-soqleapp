import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import RNUrlPreview from 'react-native-url-preview';
import { TextInput, View, Image, DeviceEventEmitter, ImageBackground, FlatList, TouchableOpacity, KeyboardAvoidingView, Modal, Alert, ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import _ from 'lodash';
import {
    Body,
    Button,
    CardItem,
    Container,
    Header,
    Icon,
    Item,
    Left,
    Right,
    Text,
    Textarea,
    Thumbnail
} from 'native-base';
import { flashMessage, resizeImg, trackMixpanel, trackError } from '../utils/common';
import { Dropdown } from 'react-native-material-dropdown';

import { MAIN_COLOR } from '../constants';
import { USER_SPARK_LIST_PATH_API } from '../endpoints';
import styles from '../stylesheets/profileView';
import MixPanel from 'react-native-mixpanel';
import {saveTicket,getFaq,facebookLoginWitthEmail} from '../reducers/UserReducer';
import CommentsView from './CommentsView';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
// let helpOptionsData = ['Account', "Story", "Task", "Spark", "Chat"]
let helpOptions = [{
    value: 'Account',
  }, {
    value: 'Story',
  }, {
    value: 'Task',
  },{
    value: 'Spark',
  }, {
    value: 'Chat',
  }];
  import {
        GraphRequest,
        GraphRequestManager,
        LoginManager,
      } from 'react-native-fbsdk';
      const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');
      const faceBookProfileFields = [
        'id',
        'email',
        'friends',
        'picture.type(large)',
        'first_name',
        'last_name',
      ];
// TODO: Update this class to new Lifecycle methods
export default class ProfileView extends Component {
    static flashMessage = message => {
        showMessage({ message, type: MAIN_COLOR });
    };

    onChange = (field, value) => {
        const { profile } = this.state;
        this.setState({ profile: { ...profile, [field]: value } });
    };

    onSave = () => {
        const { profile } = this.state;
        const { userActions } = this.props;
        if (!profile.firstName) {
            return ProfileView.flashMessage('Please enter your first name!');
        }
        if (!profile.lastName) {
            return ProfileView.flashMessage('Please enter your last name!');
        }
        this.setState({ isEdit: false });
        userActions.saveProfileRequest(profile);
    };

    goToCompanyDetails = profile => {
        this.props.navigation.navigate('CompanyProfile', { profile });
    };

    goBack = () => {
        if (this.props.backToUserList) {
            this.props.navigation.navigate('UsersList', { taskGroupData: this.props.navigation.state.params.taskGroupData });
        } else {
            this.props.navigation.pop();
        }
    };

    goAgendaView = () => this.props.navigation.navigate('Agenda');

    goUserListView = () => {
        const { userActions } = this.props;
        userActions.blockUserListRequested(this.props.user.blockUserIds);
    };

    logout = () => {
        this.menu.close();
        //todo: uncomment this after successful integeration of mixpanel sdk
        MixPanel.track('Logout');
        this.props.userActions.logout();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    };

    onAssociatePressed = () => {
        if (this.state.associateAccount) {
            this.setState({ associateAccount: false })
        } else {
            this.setState({ associateAccount: true })
        }
    }

    renderMenu = () => {
        if (this.props.backToUserList) {
            return null;
        }


        return <Menu ref={ref => this.menu = ref}>
            <MenuTrigger>
                <Image source={require('./../../assets/images/Setting.png')} style={styles.headerIcon} />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => this.setState({ isEdit: true })}>
                    <Button transparent onPress={() => this.setState({ isEdit: true })}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='pencil' />
                        <Text style={styles.headerMenuIcon}>Edit Profile</Text>
                    </Button>
                </MenuOption>

                <MenuOption>
                    <Button transparent onPress={() => this.onAssociatePressed()}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='pencil' />
                        <Text style={styles.headerMenuIcon}>Account</Text>
                    </Button>
                </MenuOption>
                <MenuOption onSelect={() => this.setState({ isFeedback: true })}>
                    <Button transparent onPress={() => {this.setState({ isFeedback: true });this.menu.close();}}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='question-circle' />
                        <Text style={styles.headerMenuIcon}>Help</Text>
                    </Button>
                </MenuOption>
                <MenuOption onSelect={() => this.setState({ isFaq: true })}>
                    <Button transparent onPress={() => {this.setState({ isFaq: true });this.menu.close();}}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='question-circle' />
                        <Text style={styles.headerMenuIcon}>isFaq</Text>
                    </Button>
                </MenuOption>
                <MenuOption>
                    <Button transparent onPress={() => this.goAgendaView()}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='calendar' />
                        <Text style={styles.headerMenuIcon}>Agenda</Text>
                    </Button>
                </MenuOption>
                <MenuOption>
                    <Button transparent onPress={() => this.goUserListView()}>
                        <Image style={styles.blockIcon} source={require('../../assets/images/eyeCross.png')} />
                        <Text style={styles.headerMenuIcon}>View Block User</Text>
                    </Button>
                </MenuOption>
                <MenuOption onSelect={() => this.logout()}>
                    <Button transparent onPress={this.logout}>
                        <Icon type="FontAwesome" style={styles.headerMenuIcon} name='sign-out' />
                        <Text style={styles.headerMenuIcon}>Exit</Text>
                    </Button>
                </MenuOption>
            </MenuOptions>
        </Menu>;
    };

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isFeedback: false,
            sendFeedBack : false,
            isFaq: false,
            okButton: false,
            selectedButton: null,
            selectedCategory: null,
            descriptionfocus: false,
            description : '',
            profile: props.user.profile || {},
            companies: props.companies || [],
            userPosts: props.userPosts || [],
            tokensCount: this.props.sparks.tokensCount || 0,
            faqData: [],
            pageFaq: 1,
            faqCount : 0,
            associateAccount: false
        };
        this.onChangeDropDown = this.onChangeDropDown.bind(this);
        this.chatToSomeOne = this.chatToSomeOne.bind(this);
        this.submitATicket = this.submitATicket.bind(this);
        this.onRequestFaqClose = this.onRequestFaqClose.bind(this);
        this.appendFaqQuestions = this.appendFaqQuestions.bind(this);
        this.clearCookiesFacebookLogin = this.clearCookiesFacebookLogin.bind(this);

    }

    componentWillMount() {
        if (!Object.keys(this.props.sparks).length) {
            const endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
            this.props.sparkActions.getSparksRequest({ initialLoad: true, endpoint });
        }
    }

    componentDidMount() {
        const { userActions, user } = this.props;
        const { profile } = this.state;
        if (profile && profile.email) {
            userActions.getCompaniesRequest(profile.email.toLowerCase());
        }
        if (user && user._id) {
            userActions.getUserPostWithId(user._id);
        }
        this.props.navigation.addListener(
            'willFocus',
            () => {
                if (user && user._id) {
                    userActions.getUserPostWithId(user._id);
                }
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !_.isEqual(nextProps.user.profile, this.state.profile) && !nextProps.isLoading) {
            this.setState({ profile: nextProps.user.profile });
        }
        if (nextProps.companies && !_.isEqual(nextProps.companies, this.state.companies)) {
            this.setState({ companies: nextProps.companies });
        }
        if (Object.keys(nextProps.sparks).length
            && (!this.props.sparks.transactions ||
                nextProps.sparks.transactions.length != this.props.sparks.transactions.length)) {
            this.setState({ tokensCount: nextProps.sparks.tokensCount });
        }
        if (nextProps.blockUserListSuccess && nextProps.blockUserListSuccess != this.props.blockUserListSuccess) {
            this.props.navigation.navigate('UsersList', { blockUserList: nextProps.blockUserList });
        }
        if (nextProps.userPosts && !_.isEqual(nextProps.userPosts, this.state.userPosts)) {
            this.setState({ userPosts: nextProps.userPosts });
        }
    }

    onChangeDropDown(text) {
       this.setState({selectedCategory : text} )
    }

    isUrl(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;
        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }
        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        }
        else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        }
        else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }
    setSelectedButton= (selectedButton,append) => {
        let {pageFaq} = this.state, context = this;
        this.setState({selectedButton,isFeedback :false })
        // search= {'category': req.query.search};
        this.props.navigation.dispatch(getFaq({search:JSON.stringify({'category': helpOptions[selectedButton].value}),page: pageFaq},(response)=>{

            if(response.status  == 200){
                if(append){
                    let faqDataTemp = [...this.state.faqData]
                    faqDataTemp = [...faqDataTemp,...response.data.lstFaq]
                    context.setState({faqData: faqDataTemp,faqCount:response.data.totalFaq})


                }else{
                    context.setState({faqData: response.data.lstFaq,isFaq :true,faqCount:response.data.totalFaq })

                }
            }
        }));
    }
    appendFaqQuestions(){
        let {pageFaq,selectedButton,faqCount,faqData} = this.state,context = this;


        if(faqCount >faqData.length){

            context.setState({pageFaq :pageFaq+1},()=>{
                context.setSelectedButton(selectedButton,true)
            })
        }

    }
    createTicket=()=>{
        let {user  : {profile : {email}} } = this.props,
         {selectedCategory,description} = this.state;



        if(!description){
            Alert.alert(
                'Alert',
                'Please enter description',
                [
                  {text: 'OK', onPress: () => {}},
                ],
                {cancelable: false},
              );
              return;
        }
        if(!selectedCategory){
            Alert.alert(
                'Alert',
                'Please select category options',
                [
                  {text: 'OK', onPress: () => {}},
                ],
                {cancelable: false},
              );
              return;

        }
        this.setState({sendFeedBack : false})
        this.props.navigation.dispatch(saveTicket({title:selectedCategory,description : description,reporter : email},(response)=>{
            if(response.status  == 200){
                this.setState({selectedCategory: null,okButton: true,description: ""})
            }
        }));
    }

    onRequestClose=(isFeedback)=>{
    this.setState({isFeedback,selectedButton: null, associateAccount: false})
    }
    onRequestFaqClose(isFaq){
        this.setState({isFaq,selectedButton: null,faqData:[]})
    }
    onRequestCloseSendFeedback=(sendFeedBack)=>{
        this.setState({sendFeedBack,selectedCategory: null,description : ''})
    }
    sendFeedbackButton=()=>{
        // let {selectedButton} = this.state;
        // if(selectedButton == null){

        //     Alert.alert(
        //         'Alert',
        //         'Please select options',
        //         [
        //           {text: 'OK', onPress: () => {}},
        //         ],
        //         {cancelable: false},
        //       );
        //       return;

        // }
        this.setState({isFeedback :false,sendFeedBack : true,selectedButton: null} )
    }
    descriptionfocus =  (descriptionfocus) => {
      this.setState({descriptionfocus })
    }
    okButton = (okButton) =>{
     this.setState({okButton})
    }
    submitATicket(){
        let context = this;
        this.setState({isFaq: false},()=>{
            context.sendFeedbackButton();
        })
    }
    chatToSomeOne () {
        Alert.alert(
            'Alert',
            'Coming Soon',
            [
              {text: 'OK', onPress: () => {}},
            ],
            {cancelable: false},
          );
          return;
    }
    _renderFaqComp = ({item}) => {

        return(
        <View>
        <Text style={[styles.helpText,styles.faqTitle]}>{item.question} </Text>
        <Text style={[styles.helpText,styles.faqText]}>{item.answer}</Text>
        {item.imageUrl && <View style={styles.imageUrlView}><Image source={{uri: item.imageUrl}} resizeMode = {'contain'} resizeMethod={'resize'} style={styles.imageFaqs}/></View>}
       </View>
      ); }

      _renderAssociateAccount = () => {
          return (
              <View style={styles.associateContainer}>
              <View style={styles.associateView1}>
              <Text style={styles.associateTitle}>Associates Accounts</Text>
              <View>
                  <View>
                  <FontAwesomeIcon name={'facebook-f'} size={24} color={'white'} />
                  </View>
                  <View>
                  <FontAwesomeIcon name={'envelope'} size={24} color={'white'} />
                  </View>
              </View>
                  <Text style={{fontSize: 30, color: 'black'}} onPress={this.onAssociatePressed}>check</Text>

                  </View>
            </View>
          )
      }

    renderItem = (item) => {
        var isUrl = true;
        let message = '', commentsCount = 0, arrayComments = [], arrayLike = [], likeCount = 0;
        if (item.item.message) {
            message = item.item.message

            if (this.isUrl(message)) {
                isUrl = true;
            }
            var str = message;//" some text http://www.loopdeloop.org/index.html aussie bi-monthly animation challenge site."
            var urlRE = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
            let url = str.match(urlRE);
            if (url) {
                isUrl = true;
            } else {
                isUrl = false;
            }
        }
        if (item.item.comments) {
            arrayComments = item.item.comments;
            commentsCount = arrayComments.length;
        }
        if (item.item.like) {
            arrayLike = item.item.like;
            likeCount = arrayLike.length;
        }

        let minutes = this.timeDifference(new Date(), new Date(item.item.date))
        return (
            <View style={styles.viewContainImage}>

                {isUrl ? <RNUrlPreview text={message} /> : <Text style={styles.txtDescription}> {message}</Text>}
                <View style={styles.viewLikeComments}>

                    <TouchableOpacity onPress={() => this.moveToCommentView(item.item.comments, item.item._id)} style={styles.buttonComment}>
                        <Image source={require('./../../assets/images/Comments.png')} />
                        <Text style={styles.txtComment}>{commentsCount}</Text>
                    </TouchableOpacity>
                    <Text style={styles.txtMin}>{minutes}</Text>
                </View>
            </View>
        )
    }
    moveToCommentView(arrayComments, postId) {
        this.props.navigation.navigate('CommentsView', {
            commentDetail: arrayComments,
            userDetail: this.state.profile,
            'userId': this.props.user._id,
            postId: postId
        })
    }


    clearCookiesFacebookLogin() {
                // if(this.props.user &&  this.props.user.facebook && this.props.user.facebook.email){
                //     return;
                // }
                RCTNetworking.clearCookies(() => this.facebookLink());
            }

          facebookLink = async () => {
            const { userActions } = this.props;
            const getFacebookInfoCallback = (error, result) => {

              if (error) {
                  // LoginView.flashMessage('Can not fetch your Facebook profile');
              } else {
                userActions.facebookLinkRequest(this.props.user._id,result);

                 trackError(JSON.stringify(result));
              }
            };
            const processResult = result => {
                console.log("resulltttt",result)
              try {
                if (result.isCancelled) {
                //   LoginView.flashMessage('Facebook login has been canceled');
                } else {
                  const infoRequest = new GraphRequest(
                    `me?fields=${faceBookProfileFields.join(',')}`,
                    null,
                    getFacebookInfoCallback,
                  );
                  return new GraphRequestManager().addRequest(infoRequest).start();
                }
              } catch (error) {
                 trackError(error);
                // LoginView.flashMessage('Unexpected error, please try again!');
              }
            };
            let result = {};
            try {
              result = await LoginManager.logInWithReadPermissions([
                'public_profile',
                'user_friends',
                'email',
              ]);
              processResult(result);
            } catch (nativeError) {
              try {
                LoginManager.setLoginBehavior('web');
                result = await LoginManager.logInWithReadPermissions([
                  'public_profile',
                  'user_friends',
                  'email',
                ]);
                processResult(result);
              } catch (webError) {
                trackError(webError);

              }
            }
          };

    _keyExtractor = (item, index) => item.id;

    render() {
        const { profile, companies, isEdit, userPosts, selectedButton,description,descriptionfocus } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MenuProvider>
                    <Container>
                        <Header transparent style={styles.blurBg}>
                            <Left>
                                <Button transparent onPress={this.goBack}>
                                    <Icon style={styles.headerIcon} name='arrow-back' />
                                </Button>
                            </Left>
                            <Right>
                                {isEdit ?
                                    <Button transparent onPress={this.onSave}><Text
                                        style={[styles.headerIcon, {fontSize: 25, color: 'black'}]}>save</Text></Button> : this.renderMenu()}
                            </Right>
                        </Header>
                        <View style={styles.topProfile}>
                            <CardItem style={styles.blurBg}>
                                <Left>
                                    <Thumbnail
                                        style={styles.avatar}
                                        source={{
                                            uri: profile.pictureURL ||
                                                `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}`
                                        }} />
                                    <Body>
                                        {isEdit ? <Item>
                                            <TextInput placeholder="First Name" onChangeText={value => this.onChange('firstName', value)}
                                                style={[styles.input, styles.inputName]}
                                                value={profile.firstName} />
                                            <TextInput placeholder="Last Name" onChangeText={value => this.onChange('lastName', value)}
                                                style={[styles.input, styles.inputName]}
                                                value={profile.lastName} />
                                        </Item> : <Text style={styles.inputName}>{`${profile.firstName} ${profile.lastName || ''}`}</Text>
                                        }
                                        {isEdit ?
                                            <TextInput placeholder="Title" onChangeText={value => this.onChange('title', value)}
                                                style={styles.input}
                                                value={profile.title} /> : <Text note>{profile.title || ''}</Text>}
                                        {!isEdit && (<View style={styles.profileStats}>
                                            <Image source={require('./../../assets/images/Star.png')} />
                                            <Text style={styles.profileTokenText}>{this.state.tokensCount}</Text>
                                        </View>)}
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem style={styles.blurBg}>
                                <Body>
                                    {isEdit ? <Textarea style={styles.txtArea} placeholder="Type your bio" onChangeText={value => this.onChange('bio', value)}
                                        value={profile.bio} /> :
                                        <Text style={styles.txtBioShow}>{profile.bio}</Text>}
                                </Body>
                            </CardItem>
                            <CardItem style={styles.blurBg}>
                                {
                                    companies.map((company, index) =>
                                        <Button key={`company_${index}`} onPress={() => this.goToCompanyDetails(company)} small rounded
                                            style={styles.companyButton}>
                                            <Text style={{ color: MAIN_COLOR }}>{company.name}</Text>
                                        </Button>)
                                }
                            </CardItem>
                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={userPosts}
                                scrollEnabled={true}
                                // marginBottom={50}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem.bind(this)}
                            />

                        </View>
                    </Container>
                </MenuProvider>


                {/* todo:// This modal was added by sidhanth. This is the modal to add associated accounts like fb and email
                The UI is done. But no straight API was given. Pending is the API through which the user's fbID and linkedIN
                id should be updated.
                Weird bug that LinkedIn already has some ID though no login done. Need to check. */}
                <Modal
                        hardwareAccelerated
                        transparent={true}
                        visible={this.state.associateAccount}
                        animationType="fade"
                        backdropOpacity={0}
                        style={styles.submitModal}
                        onRequestClose={() => {
                        this.onRequestClose(false)
                    }}>

                    <View style={styles.modalSendFeedBack}>
                        <View style={styles.sendFeedbackContainer}>


                            <Text style={styles.helpText}>Associate Accounts</Text>
                            <TouchableOpacity
                        style={styles.closeButton}
                                                        onPress={() => { this.onRequestClose(false) }}>
                                                        <Icon name='close' style={styles.closeIcon} />
                                                    </TouchableOpacity>
                                                    <View style={styles.myaccountsItem}>
                                                        <View style={{ flex: 1, flexDirection: 'row',justifyContent : 'space-around' }}>
                                                            <FontAwesomeIcon name={'facebook-f'} size={24} color={'white'} />
                                                            <Text style={styles.colorWhite}>Facebook</Text>
                                                        </View>
                                                        <View style={styles.myaccountSubContainer}>
                                                            {this.props.user &&  this.props.user.facebook && this.props.user.facebook.email ? <View style={styles.facebookRow}><View >
                                                                <TouchableOpacity>
                                                                    <Text style={styles.paddingWhiteRight}>{this.props.user &&  this.props.user.profile && this.props.user.profile.firstName}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={styles.flexEnd}>
                                                                <FontAwesomeIcon name={'check-circle'} size={24} color={'white'} />
                                                            </View></View> :
                                                            <View  style={styles.facebookRow}><View></View>
                                                            <TouchableOpacity  onPress={() => { this.clearCookiesFacebookLogin()}} style={styles.flexEnd}>
                                                                <FontAwesomeIcon name={'plus'} size={24} color={'white'} />
                                                            </TouchableOpacity></View> }
                                                        </View>
                                                    </View>
                                                    <View style={styles.myaccountsItem}>
                                                        <View style={styles.myaccountSubContainer}>
                                                            <FontAwesomeIcon name={'linkedin'} size={24} color={'white'} />
                                                            <Text style={styles.colorWhite}>Linkdin</Text>
                                                        </View>
                                                        <View style={styles.myaccountSubContainer}>
                                                            <View style={styles.flexStart}>
                                                                <Text style={styles.paddingWhiteRight}></Text>
                                                            </View>
                                                            <View style={styles.flexEnd}>
                                                                <FontAwesomeIcon name={'plus'} size={24} color={'white'} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.myaccountsItem}>
                                                       <View style={styles.myaccountSubContainer}>
                                                            <FontAwesomeIcon name={'envelope'} size={24} color={'white'} />
                                                            <Text style={styles.colorWhite}>E-mail</Text>
                                                        </View>
                                                        <View style={styles.myaccountSubContainer}>
                                                            <View style={styles.flexStart}>
                                                                <Text style={styles.paddingWhiteRight}>{this.props.user &&  this.props.user.profile && this.props.user.profile.email}</Text>
                                                            </View>
                                                            <View style={styles.flexEnd}>
                                                                <FontAwesomeIcon name={'check-circle'} size={24} color={'white'} />
                                                            </View>
                                                        </View>
                                                    </View>




                            <TouchableOpacity
                                    style={[ styles.modalButton,styles.modalButtonSubmit]}
                                    onPress={() => {}}>
                                    <Text style={styles.submitText}>Save</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
               </Modal>
                <Modal
                    hardwareAccelerated
                    transparent={true}
                    animationType="fade"
                    backdropOpacity={0}
                    style={{ marginVertical: 40 }}
                    visible={this.state.isFeedback}
                    onRequestClose={() => {this.onRequestClose(false) }}>
                    <View style={styles.modalSendFeedBack}>
                        <View style={styles.sendFeedbackContainer}>
                            <Text style={[styles.helpText,styles.marginBottom]}>How can we help ? </Text>
                            <TouchableOpacity
                            style={styles.closeButton}
                            onPress={()=>{this.onRequestClose(false)}}>
                            <Icon name='close'  style={styles.closeIcon}/>
                        </TouchableOpacity>
                            {helpOptions.map((element, index) => {
                                return (<TouchableOpacity
                                    style={[{ backgroundColor: selectedButton == index ? '#800094' : 'transparent', borderColor: '#ffffff', borderWidth: selectedButton == index ? 0 : 1 }, styles.modalButton]}
                                    onPress={() => { this.setSelectedButton(index,false)}}>
                                    <Text style={styles.submitText}>{element.value}</Text>
                                </TouchableOpacity>)
                            })}

                            <TouchableOpacity
                                style={styles.sendFeedbackButton}
                                onPress={() => { this.sendFeedbackButton()}}>
                                <Text style={styles.submitText} >Send Feedback</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    hardwareAccelerated
                    transparent={true}
                    animationType="fade"
                    backdropOpacity={0}
                    style={{ marginVertical: 40 }}
                    visible={this.state.isFaq}
                    onRequestClose={() => {this.onRequestFaqClose(false) }}>
                    <View style={styles.modalFaq}>
                        <View style={[styles.sendFeedbackContainerFaq,styles.sendFeedbackContainer]}>
                        <Text style={[styles.helpText,styles.marginBottomFaq]}>How about these ? </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={()=>{this.onRequestFaqClose(false)}}>
                            <Icon name='close'  style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <View style={[styles.lineFaq,styles.marginBottomFaq]}></View>

                            <FlatList
                                 data={this.state.faqData}
                                 extraData={this.state}
                                scrollEnabled={true}
                                onEndReached={()=>this.appendFaqQuestions()}
                                onEndReachedThreshold={1}
                                // marginBottom={50}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderFaqComp.bind(this)}
                            />
                            <Text style={[styles.helpText,styles.marginBottomFaq]}>Not Solved ? </Text>
                            <View style={styles.lastFaqButtons}>
                            <TouchableOpacity
                                style={[styles.chatToSomeOne,styles.latButtonFont]}
                                onPress={() => { this.chatToSomeOne()}}>
                                <Text style={styles.submitText} >Chat To Someone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitATicket,styles.latButtonFont]}
                                onPress={() => { this.submitATicket()}}>
                                <Text style={styles.submitTicketText} >Submit a ticket</Text>
                            </TouchableOpacity>
                           </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    hardwareAccelerated
                    transparent={true}
                    animationType="fade"
                    backdropOpacity={0}
                    style={styles.submitModal}
                    visible={this.state.sendFeedBack}
                    onRequestClose={() => {this.onRequestCloseSendFeedback(false) }}>
                    <View style={styles.modalSendFeedBack}>
                        <View style={styles.sendFeedbackContainer}>


                            <Text style={styles.helpText}>Send Feedback </Text>
                            <TouchableOpacity
                            style={styles.closeButton}
                            onPress={()=>{this.onRequestCloseSendFeedback(false)}}>
                            <Icon name='close' style={styles.closeIcon}/>
                        </TouchableOpacity>

                         <Textarea placeholder="Enter your text" style={[styles.description,{backgroundColor : descriptionfocus? '#ffffff' : "transparent",color: descriptionfocus?  '#000000': '#ffffff'}]}
                         onFocus={()=>{this.descriptionfocus(true)}}
                         onBlur={()=>{this.descriptionfocus(false)}}

                                    onChangeText={value => this.setState({'description' :  value}) }
                                    value={description}/>

                        <Dropdown
                        label='Choose Category'
                         data={helpOptions}
                         containerStyle={styles.dropdown}
                         baseColor={'#ffffff'}
                         textColor={'#ffffff'}
                         itemColor={'#808080'}
                         selectedItemColor={'#000000'}
                         onChangeText={this.onChangeDropDown}
                       />


                            <TouchableOpacity
                                    style={[ styles.modalButton,styles.modalButtonSubmit]}
                                    onPress={() => { this.createTicket()}}>
                                    <Text style={styles.submitText}>Submit</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    hardwareAccelerated
                    transparent={true}
                    animationType="fade"
                    backdropOpacity={0}
                    style={styles.submitModal}
                    visible={this.state.okButton}
                    onRequestClose={() => {this.onRequestCloseSendFeedback(false) }}>
                    <View style={styles.modalSendFeedBack}>
                        <View style={styles.sendFeedbackContainer}>


                            <Text style={[styles.helpText,styles.marginBottom]}>Thank you! </Text>


                            <Image style={styles.thumbnailImage}source={require('./../../assets/images/thumbsup.png')} />

                            <TouchableOpacity
                                    style={[styles.modalButton,styles.modalButtonSubmit, styles.marginTop]}
                                    onPress={() => { this.okButton(false)}}>
                                    <Text style={styles.submitText}>Ok</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
