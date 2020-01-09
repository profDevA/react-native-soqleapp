import React from 'react';
import { Container, Text, List, ListItem, Content, Separator, Left, Body, Right } from 'native-base';
import { TouchableOpacity, Image } from 'react-native'

import I18n from '../utils/localize'

import styles from './../stylesheets/SideBarMenuStyles';

const SidebarMenu = ({ goUserListView, logout, goExportView,onPressClose,isVisible,goUnlockView }) => {


  return (
        <Container style={styles.container}>
            <Content>
                <List>
                    <ListItem>

                        <Body>
                            <Text style={styles.Header}>Menu</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={()=>onPressClose()} >
                                <Image
                                    style={{ height: 13, width: 13, }}
                                    source={require('../images/close_grey.png')}
                                />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                    <ListItem button onPress={() => goUnlockView()}>
                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, alignSelf: 'center' }}
                                source={require('../images/padlock.png')}
                            />
                            <Text style={styles.item}>{I18n.t("unlockstory")}</Text>
                        </Body>
                    </ListItem>
                    <ListItem button onPress={() => goExportView()}>

                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, alignSelf: 'center' }}
                                source={require('../images/frame.png')}
                            />
                            <Text style={styles.item}>{I18n.t("export")}</Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, alignSelf: 'center' }}
                                source={require('../images/star.png')}
                            />
                            <Text style={styles.item}>{I18n.t("sendFeedback")}</Text>
                        </Body>
                    </ListItem>
                    <ListItem >
                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, }}
                                source={require('../images/faq.png')}
                            />
                            <Text style={styles.item}>{I18n.t("FAQ")}</Text>
                        </Body>
                    </ListItem>
                    <ListItem button onPress={() => goUserListView()}>
                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, resizeMode: 'contain' }}
                                source={require('../images/blocked.png')}
                            />
                            <Text style={styles.item}>{I18n.t("blocked")}</Text>
                        </Body>
                    </ListItem>
                    <ListItem button onPress={() => logout()}>
                        <Body style={{ flexDirection: 'row' }} >
                            <Image
                                style={{ height: 20, width: 20, }}
                                source={require('../images/logout_purple.png')}
                            />
                            <Text style={styles.item}>{I18n.t("logout")}</Text>
                        </Body>
                    </ListItem>
                </List>
            </Content>
        </Container>
    )
}


export default SidebarMenu
