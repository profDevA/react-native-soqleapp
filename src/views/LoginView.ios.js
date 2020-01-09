import React, {Component} from 'react';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import { gSignin } from "../controllers/google"
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {Button, Input, Item, Label, Text, Thumbnail} from 'native-base';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
//  import LinkedInModal from 'react-native-linkedin';
import { Client } from 'bugsnag-react-native';
import {BUGSNAG_KEY} from "../config";
const bugsnag = new Client(BUGSNAG_KEY);
import FastImage from 'react-native-fast-image'

import {isValidEmail, trackMixpanel, trackError} from '../utils/common';
import * as constants from '../constants';
import {MAIN_COLOR} from '../constants';
import Step1 from './login/Step1';
import Step3 from './login/Step3';
import Step2 from './login/Step2';
import {LINKEDIN_LOGIN_APP_ID, LINKEDIN_LOGIN_APP_SECRET, LINKEDIN_LOGIN_CALLBACK, LOGO1,} from '../config';
import styles from '../stylesheets/loginView.iosStyles';
import MixPanel from "react-native-mixpanel";
import Loader from '../components/Loader';
const baseApi = 'https://api.linkedin.com/v1/people/';
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');
const faceBookProfileFields = ['id', 'email', 'friends', 'picture.type(large)', 'first_name', 'last_name'];
const linkedInProfileFields = ['id', 'first-name', 'last-name', 'email-address', 'picture-urls::(original)',
    'picture-url::(original)', 'headline', 'specialties', 'industry'];

const {width, height} = Dimensions.get('window')
import { AppState } from 'react-native';
import * as AppStateActions from '../reducers/AppReducer'
import store from '../redux/store'


// TODO: Update this class to new Lifecycle methods
export default class LoginView extends Component {

    static flashMessage = message => showMessage({message, type: MAIN_COLOR});
    constructor(props) {
      //console.log("endlessload loginview ios contructor. appstate ", AppState)
        super(props);
        this.state = {
            step: 1,
            processing:false,
            email: '',
            password: '',
            repassword: '',
            newPassword: '',
            isAgree: false,
            modalVisible: false,
            processing: false,
            isPassword:false,
            isRePassword:false,
            validationMsg:"",
            isSubmit:false,
            showPassword1: true,
            showPassword3:true
        };
          store.dispatch(AppStateActions.stopLoading())
    }



    linkedinLogin = async token => {
        try {
            const {userActions} = this.props;
            const response = await fetch(
                `${baseApi}~:(${linkedInProfileFields.join(',')})?format=json`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            const result = await response.json();
            userActions.linkedinLoginRequest({...result, accessToken: token});
        } catch (error) {
            trackError(error)
            LoginView.flashMessage('Can not fetch your LinkedIn profile');
        }
    };

    facebookLogin = async () => {
        const {userActions} = this.props;
        const getFacebookInfoCallback = (error, result) => {
            if (error) {
                LoginView.flashMessage('Can not fetch your Facebook profile');
            } else {
                userActions.facebookLoginRequest(result);
            }
        };

        const processResult = result => {
            try {
                if (result.isCancelled) {
                    LoginView.flashMessage('Facebook login has been canceled');
                } else {
                    const infoRequest = new GraphRequest(
                        `me?fields=${faceBookProfileFields.join(',')}`,
                        null,
                        getFacebookInfoCallback,
                    );
                    return new GraphRequestManager().addRequest(infoRequest).start();
                }
            } catch (error) {
                trackError(error)
                LoginView.flashMessage('Unexpected error, please try again!');
            }
        };
        let result = {};
        try {
            this.setState({showLoadingModal: true});
            result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
            processResult(result);
        } catch (nativeError) {
            trackError(nativeError)
            try {
                LoginManager.setLoginBehavior('web');
                result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
                processResult(result);
            } catch (webError) {
                trackError(webError)
                LoginView.flashMessage('Can not login with your Facebook, please try again!');
            }
        }
    };

    googleLogin = async () =>{
      const userInfo = await gSignin();
      const {userActions} = this.props;
       data = {type:"Google", userInfo:userInfo}
       userActions.loginRequest(data); //API required name in login case??

    }

    login = () => {
        Keyboard.dismiss();
        const {userActions} = this.props;
        const {email, password} = this.state;
        if (!password) {
            return LoginView.flashMessage('Please enter your password');
        }
        //todo: uncomment this after successful integeration of mixpanel sdk
		    trackMixpanel('Sign in');
        //initiateLogin("web", email, password, this.loader)
        userActions.loginRequest({type:"web", email, password, name: 'hardcoded'}); //API required name in login case??
    };

    signup = () => {
        Keyboard.dismiss();
        this.setState({isSubmit:true})
        const {userActions} = this.props;
        const {email, name, password, isAgree, repassword} = this.state;
        if (!name) {
            return LoginView.flashMessage('Please enter your name');
        }
        else if (!password) {
            return LoginView.flashMessage('Please enter your password');
          }
          else if (password.length<8) {
            return LoginView.flashMessage('Password must be minimum 8 character');
          }
          else if (password.includes(' ')) {
            return LoginView.flashMessage('You are not allowed to have a space in password');
          }
          else if (!repassword) {
            return LoginView.flashMessage('Please enter your re-Password');
          }
        if(!this.passwordValidation())
            return;
        if (!isAgree) {
            return LoginView.flashMessage('Please agree to the Privacy Policy and Terms and Conditions.');
        }
        //todo: uncomment this after successful integeration of mixpanel sdk
        trackMixpanel('Sign up - ios')


        //MixPanel.registerSuperProperties()

        userActions.loginRequest({email, password, name});
    };





    moveToIntro = () =>{
        this.props.showSplashAgain()
    }
    passwordValidationOnChange = () => {
        const { password, repassword } = this.state;
        if (password.trim().length < 8) {
          this.setState({
            isPassword: false,
            isRePassword: false,
            validationMsg: '',
            });
          return false;
        }

        if (password.includes(' ')) {
          this.setState({
            isPassword: false,
            isRePassword: false,
            validationMsg: '',
          });
          return false;
        }

        if (password !== repassword && repassword !== '') {
          this.setState({
            isPassword: true,
            isRePassword: false,
            validationMsg: '',
          });
          return false;
        }
        if(repassword == ""){
          this.setState({
            isPassword: true,
            isRePassword: false,
            validationMsg: '',
                });
          return false;
        }

        this.setState({
          isPassword: true,
          isRePassword: true,
            validationMsg: '',
        });
        return true;
      };

    passwordValidation = () =>{
        const {password, repassword} = this.state;

        if(password.includes(" ")){
            this.setState({
                isPassword:false,
                isRePassword:false,
                validationMsg:"You are not allowed to have a space in password.",
            })
            return false;
        }
        if(password.trim().length <8){
            this.setState({
                isPassword:false,
                isRePassword:false,
                validationMsg:"Password must be minimum 8 character.",
            })
            return false ;
        }

        if (password !== repassword && repassword !=="") {
            this.setState({
                isPassword:true,
                isRePassword:false,
                validationMsg:"Your password don't match.",
            })
            return false;
        }

        this.setState({
            isPassword:true,
            isRePassword:true,
            validationMsg:"",
        })
        return true;
    }

    showforgotPasswordView = () => {
        this.setState({
            modalVisible: true,
            newPassword: ''
        });
    };

    onOtherEmail = () => {
        this.setState({step: 1, email: ''});
    };

    onChange = (field, value) => {
        this.setState({[field]: value,isSubmit:false},()=>{
            // debugger;
            if (field === "password" || field === "repassword")
                this.passwordValidationOnChange();
        });
    }

    onEmailSubmit = () => {
        const {email} = this.state;
        const {userActions} = this.props;
        if (!isValidEmail(email)) {
            return LoginView.flashMessage('Please enter an valid email');
        }
        userActions.checkEmailRequest(email.toLowerCase());
    };



    forgotPassword() {
        Keyboard.dismiss();
        const {userActions} = this.props;
        const {email, newPassword} = this.state;
        if (!email) {
            return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
        } else if (!isValidEmail(email)) {
            return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
        } else if (!newPassword) {
            return LoginView.flashMessage(constants.KPASSWORD_VALIDATION_ALERT);
        } else {
            userActions.forgotpasswordRequested(this.state);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error && nextProps.error.message) {
            LoginView.flashMessage(nextProps.error.message);
        }
        if (nextProps.registerSuccess && nextProps.registerSuccess !== this.props.registerSuccess) {
            LoginView.flashMessage('Register successful');
            this.props.navigate({routeName: 'LoginScreen'});
        }
        if (nextProps.loginSuccess && nextProps.loginSuccess !== this.props.loginSuccess) {
            LoginView.flashMessage('Login successful');
            this.props.navigation.navigate({routeName: 'Story'});
        }
        if (nextProps.checkEmailResult && nextProps.checkEmailResult !== this.props.checkEmailResult) {
            if (nextProps.checkEmailResult.isExisten) {
                this.setState({email: nextProps.checkEmailResult.email, step: 2});
            } else {
                this.setState({email: nextProps.checkEmailResult.email, step: 3});
            }
        }

        if (nextProps.forgotpasswordSuccess && nextProps.forgotpasswordSuccess !== this.props.forgotpasswordSuccess) {
            LoginView.flashMessage(constants.KFORGOT_PWD_SUCCESS_ALERT);
            this.setState({modalVisible: false,});
        } else {
            this.setState({modalVisible: false,});
        }

    }

    clearCookiesFacebookLogin() {
        RCTNetworking.clearCookies(() => this.facebookLogin());
    }

    clearCookiesOpenModal() {
        RCTNetworking.clearCookies(() => this.modal.open());
    }

    toggleModalVisibility() {
        const {modalVisible} = this.state;
        this.setState({modalVisible: !modalVisible});
    }

    modalOnPasswordChange(newPassword) {
        this.setState({newPassword});
    }

    loader = (flagValue) => {
      console.log("flagvalue ", flagValue)
        // Will print the flag value
        console.log(flagValue);
        this.setState({processing: flagValue});
    }

    random = () => {
      const {userActions} = this.props;
      const randomNo=(Math.random().toString(36).substring(7));

      const randomEmail = randomNo + "@random.com";
      userActions.loginRequest({type:"web", email:randomEmail, password: "12345678", name: "random"});
    }

    render() {
        const {email, password, name, isAgree, modalVisible, step, repassword, showPassword3} = this.state;
        return (
            <KeyboardAvoidingView behavior="position"
                style={styles.container}
                contentContainerStyle={step === 1 ? styles.containerContent:styles.containerContentStep2 }
            >




            {this.state.processing ? (
                <Loader />
            ) : null}

                <FastImage
                style={{height: 100, width: width}}
                 // source={{
                 //     uri: 'https://unsplash.it/400/400?image=1',
                 //     // headers: { Authorization: 'someAuthToken' },
                  //     priority: FastImage.priority.normal,
                 // }}
                source={{uri: LOGO1}}
               resizeMode={FastImage.resizeMode.contain}
               />
               {__DEV__ ? (
                 <TouchableOpacity
                     onPress={this.random}
                 >
                     <View>
                         <Text style={[styles.text]}>Random Login</Text>
                     </View>
                 </TouchableOpacity>
               ) : null}
             {/* <Image style={{ maxHeight: 100, maxWidth: width}} source={require('../images/image2.1.png')} resizeMode="contain"/> */}
                <View style={styles.content}>
                    {step === 1 && <Step1 onChange={this.onChange} email={email} onEmailSubmit={this.onEmailSubmit}/>}
                    {step === 2 && <Step2 onChange={this.onChange} password={password} onLogin={this.login}
                        showPassword3={showPassword3}
                        showforgotPasswordView={this.showforgotPasswordView}
                        onOtherEmail={this.onOtherEmail}/>}
                    {step === 3 &&
                    <Step3 onChange={this.onChange} passwordValidation={this.passwordValidation} password={password} repassword={repassword} name={name}
                        isAgree={isAgree} data={this.state}
                        onSignup={this.signup}/>}
                    {step === 1 && <View style={styles.socialLogin}>
                        <Text style={[styles.text]}>Or</Text>
                    </View>}
                    {step === 1 && <View style={styles.socialLogin}>
                    <GoogleSigninButton
                      style={{ width: 48, height: 48 }}
                      size={GoogleSigninButton.Size.Icon}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={this.googleLogin}
                      disabled={false} />
                    </View>}
                    {step === 1 && <TouchableOpacity
                    onPress={() => {
                        this.moveToIntro();
                    }}
                    style={styles.getTogether}
                    >
                    <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 17, textAlign: 'center',fontFamily: 'SFUIDisplay-Regular', }}>
                    Get together, now
                    </Text>
                </TouchableOpacity>}
                {
                    (step === 2 || step === 3) &&
                    <View style={styles.containerLoginWithOtherEmail}>

                        <Button transparent onPress={this.onOtherEmail}>
                          <Icon name="chevron-left" style={styles.iconLeft}/>
                        </Button>
                    </View>
                }
                </View>

                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={this.toggleModalVisibility.bind(this)}
                >
                    <View style={styles.helpModal}>
                        <View style={styles.helpModalContent}>
                            <Text style={styles.forgotPwdTitle}>Enter New Password</Text>
                            <Item rounded style={[styles.margin10, styles.textInput]}>
                                <Input
                                    style={styles.textInputPwd}
                                    secureTextEntry
                                    value={this.state.newPassword}
                                    placeholder={"New Password"}
                                    onChangeText={this.modalOnPasswordChange.bind(this)}
                                />
                            </Item>
                            <View style={styles.margin10}>
                                <ImageBackground style={{width: '100%', height: 57}} source={require('../images/Rectangle.png')}>
                                    <TouchableOpacity
                                        style={styles.loginButton}
                                        onPress={() => this.forgotPassword()}
                                    >
                                        <Text style={styles.loginText}>Save</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                            <TouchableOpacity
                                onPress={this.toggleModalVisibility.bind(this)}
                                style={styles.likeModalClose}
                            >
                                <View>
                                    <Icon name='close' style={styles.likeModalCloseIcon}/>
                                </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        );
    }
}
