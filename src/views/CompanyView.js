import React, {Component} from 'react';
import {Image, View, StatusBar} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import _ from 'lodash';
import {
    Body,
    Button,
    CardItem,
    Container,
    Header,
    Icon,
    Input,
    Item,
    Left,
    Right,
    Text,
    Textarea,
    Thumbnail,
} from 'native-base';
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption, MenuProvider
} from 'react-native-popup-menu';

import {MAIN_COLOR} from '../constants';
import styles from '../stylesheets/companyViewStyles';

// TODO: Update this class to new Lifecycle methods
export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content', true);
        this.state = {
            isEdit: false,
            profile: props.navigation.getParam('profile', {}),
        };
    }

    static flashMessage = message => showMessage({message, type: MAIN_COLOR});

    onChange = (field, value) => {
        const {profile} = this.state;
        this.setState({profile: {...profile, [field]: value}});
    };
    onSave = () => {
        const {profile} = this.state;
        const {companyActions} = this.props;
        if (!profile.name) {
            return ProfileView.flashMessage('Please enter company name!');
        }
        if (!profile.title) {
            return ProfileView.flashMessage('Please enter company title!');
        }
        if (!profile.description) {
            return ProfileView.flashMessage('Please enter description!');
        }
        this.setState({isEdit: false});
        companyActions.saveCompanyRequest(profile);
    };
    goBack = () => this.props.navigation.pop();

    componentWillReceiveProps(nextProps) {
        if (nextProps.details && !_.isEqual(nextProps.details, this.state.profile) && !nextProps.isLoading) {
            this.setState({profile: nextProps.details});
        }
    }

    renderMenu = () => {
        return (
            <Menu ref={ref => this.menu = ref}>
                <MenuTrigger>
                    <Icon style={styles.headerIcon} name='settings'/>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption>
                        <Button transparent onPress={() => this.setState({isEdit: true})}>
                            <Icon type="FontAwesome" style={styles.headerMenuIcon} name='pencil'/>
                            <Text style={styles.headerMenuIcon}>Edit Profile</Text>
                        </Button>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );
    }

    render() {
        const {profile, isEdit} = this.state;
        return (
            <MenuProvider>
                <Container>
                    <Header transparent style={styles.blurBg}>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon style={styles.headerIcon} color="black" name='arrow-back'/>
                            </Button>
                        </Left>
                        <Right>
                            {isEdit ? <Button transparent>
                                <Button transparent onPress={this.onSave}><Text
                                    style={styles.headerIcon}>save</Text></Button></Button> :
                                this.renderMenu()
                            }
                        </Right>
                    </Header>
                    <View style={styles.topProfile}>
                        <CardItem style={styles.blurBg}>
                            <Left>
                                <Thumbnail
                                    style={styles.avatar}
                                    source={{uri: profile.imageUrl || `https://ui-avatars.com/api/?name=${profile.name}`}}/>
                                <Body>
                                    {isEdit ? <Item>
                                        <Input placeholder="Name" onChangeText={value => this.onChange('name', value)}
                                            style={[styles.input, styles.inputName]}
                                            value={profile.name}/>
                                    </Item> : <Text style={styles.inputName}>{`${profile.name}`}</Text>
                                    }
                                    {isEdit ?
                                        <Input placeholder="Title" onChangeText={value => this.onChange('title', value)}
                                            style={styles.inputTitle}
                                            value={profile.title}/> :
                                        <Text style={styles.inputTitle} note>{profile.title || ''}</Text>}
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem style={styles.blurBg}>
                            <Body>
                                {isEdit ? <Textarea placeholder="Company description" style={styles.inputDescription}
                                    onChangeText={value => this.onChange('description', value)}
                                    value={profile.description}/> :
                                    <Text style={styles.inputDescription}>{profile.description}</Text>}
                            </Body>
                        </CardItem>
                    </View>
                </Container>
            </MenuProvider>
        );
    }
}
