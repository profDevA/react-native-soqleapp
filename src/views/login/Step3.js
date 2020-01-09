import React, {Component} from 'react';
import {ImageBackground, Linking, TouchableOpacity, View, Image} from 'react-native';
import {CheckBox, Form, Input, Item, Text} from 'native-base';

import LoginView from '../LoginView';
import styles from '../../stylesheets/login/step3Styles';
//import Icon from "../LoginView.ios";
import Icon from 'react-native-vector-icons/FontAwesome';
const PRIVACY_LINK = 'https://beta.soqqle.com/privacyPolicy';
const TERM_OF_USE_LINK = 'https://beta.soqqle.com/termsOfUse';
import FastImage from 'react-native-fast-image'
import I18n from '../../utils/localize'

export default class Step3 extends Component {
    openLink = url => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                LoginView.flashMessage('Can not open web browser');
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => LoginView.flashMessage('Can not open web browser'));
    };

    render() {
        const {password, repassword, name, onChange, onSignup, isAgree, data ,passwordValidation } = this.props;
        // debugger;
        return (
            <Form>
                <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                    <Input
                        style={styles.textInput}
                        value={name}
                        placeholder={I18n.t("enterName")}
                        onChangeText={value => onChange('name', value)}
                    />
                </Item>
                <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                    <Input
                        style={[styles.textInput,styles.InputPassword]}
                        secureTextEntry={data.showPassword1}
                        value={password}
                        placeholder={I18n.t("password")}
                        onChangeText={value => onChange('password', value)}
                    />
                   {password?
                    <TouchableOpacity  style={styles.passwordIconValidationContainer} onPress={()=>{
                        !data.isPassword && passwordValidation()
                    }}>
                   <Image
                        source={data.isPassword?require('../../images/Correct.png'):require('../../images/Warning.png')}
                        style={styles.passwordIconValidation}
                    />
                 </TouchableOpacity>

                    :

                     null }
                    <TouchableOpacity  style={styles.passwordIconValidationEyeContainer} onPress={()=>{
                        onChange('showPassword1', !data.showPassword1)
                    }}>
                     <Image
                        source={data.showPassword1 ?require('../../images/eyeBlur.png'):require('../../images/eye.png')}
                        style={styles.passwordIconValidationEye}
                    />
                    </TouchableOpacity>
                </Item>
                {
                    (data.isPassword)&&
                    <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                        <Input
                          style={[styles.textInput,styles.InputPassword]}
                            secureTextEntry={data.showPassword1}
                            value={repassword}
                            placeholder={I18n.t("rePassword")}
                            onChangeText={value => onChange('repassword', value)}
                        />
                       {repassword ?  <Text style={styles.rePasswordIncorrect}>{ (data.isSubmit && !data.isRePassword)?"Incorrect":""}</Text> : null}
                    {repassword ?
                    <TouchableOpacity style={styles.passwordIconValidationContainer} onPress={()=>{
                        !data.isRePassword && passwordValidation()
                    }}>
                    <Image
                            source={data.isRePassword?require('../../images/Correct.png'):(data.isSubmit?require('../../images/InCorrect.png'):require('../../images/Warning.png'))}
                            style={styles.passwordIconValidation}
                        />
                 </TouchableOpacity>
                        : null}
                     <TouchableOpacity style={styles.passwordIconValidationEyeContainer} onPress={()=>{
                             onChange('showPassword1', !data.showPassword1)
                         }}>
                         <Image
                        source={data.showPassword1 ?require('../../images/eyeBlur.png'):require('../../images/eye.png')}
                        style={styles.passwordIconValidationEye}
                    />
                    </TouchableOpacity>
                    </Item>
                }
                {
                    ((!data.isPassword || !data.isRePassword) && data.validationMsg !== "" ) &&
                    <Item rounded style={styles.passwordValidation}>
                        <Text style={styles.passwordValidationContent}>
                            {data.validationMsg}
                        </Text>
                    </Item>
                }

                <View style={{height: 40, marginTop: 20, flexDirection: 'row'}}>
                    <CheckBox style={styles.checkbox} checked={isAgree} onPress={() => onChange('isAgree', !isAgree)}/>
                    <View style={{marginLeft: 20, flexDirection: 'row', flexWrap: 'wrap'}}><Text style={styles.text}>I
                        agree to
                        the </Text><TouchableOpacity onPress={() => this.openLink(PRIVACY_LINK)}><Text
                        style={styles.inputLabel}>{I18n.t("privacyPolicy")}</Text></TouchableOpacity><Text style={styles.text}> & </Text><TouchableOpacity
                        onPress={() => this.openLink(TERM_OF_USE_LINK)}><Text style={styles.inputLabel}>{I18n.t("terms")}</Text></TouchableOpacity></View>
                </View>
                <View style={styles.margin10}>
                <FastImage  style={{width: '100%', height: 50}} source={require('../../images/Rectangle.png')}>
                <TouchableOpacity
                            style={styles.loginButton}
                            onPress={onSignup}
                        >
                            <Text style={styles.loginText}>{I18n.t("signUp")}</Text>
                        </TouchableOpacity>
                </FastImage>
                    {/* <ImageBackground>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={onSignup}
                        >
                            <Text style={styles.loginText}>Sign up</Text>
                        </TouchableOpacity>
                    </ImageBackground> */}
                </View>
            </Form>
        );
    }
}
