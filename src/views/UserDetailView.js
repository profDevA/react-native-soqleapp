import React, {Component} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView} from 'react-native';
import {Thumbnail} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {isImmutable} from 'immutable';

import styles from '../stylesheets/userDetailViewStyles';
import ProfileView from './ProfileView';
import * as UserActions from '../reducers/UserReducer';
import * as actions from '../reducers/SparkReducer';

class UserDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUser: {},
        };
    }

    componentDidMount() {
        this.setState({
            dataUser: this.props.navigation.state.params.detailDict
        });
    }

    handleBackAction() {
        this.props.navigation.navigate({
            routeName: 'UsersList'
        });
    }

    render() {
        let name = '';
        let designation = '';
        let imgUser;
        let bio = '';
        const dictUserDetail = this.state.dataUser.userDetails;
        if (dictUserDetail && dictUserDetail.profile ) {
            if (  dictUserDetail.profile.firstName) {
                name = dictUserDetail.profile.firstName;
            }
            if (dictUserDetail.profile.lastName) {
                name = name + ' ' + dictUserDetail.profile.lastName;
            }
            imgUser = <Thumbnail
                style={styles.imageUser}
                source={{uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}`}}/>;

            if (dictUserDetail.profile.title) {
                designation = dictUserDetail.profile.title;
            }
            if (dictUserDetail.profile.bio) {
                bio = dictUserDetail.profile.bio;
            }
        }
        let sparks = {
            tokensCount: 0
        };
        if (dictUserDetail) {
            return (
                <ProfileView
                    taskGroupData={this.props.navigation.state.params.taskGroupData}
                    backToUserList={true}
                    userActions={this.props.userActions}
                    sparks={sparks}
                    user={dictUserDetail}
                    navigation={this.props.navigation}
                    companies={this.props.companies}
                    sparks={this.props.sparks}
                    sparkActions={this.props.sparkActions}
                />
            );
        }
        return null;
    }
}

export default connect(
    state => ({
        isLoading: state.getIn(['app', 'loading']),
        companies: isImmutable(state.getIn(['user', 'companies'])) ? state.getIn(['user', 'companies']).toJS() : state.getIn(['user', 'companies']),
        sparks: isImmutable(state.getIn(['spark', 'details'])) ? state.getIn(['spark', 'details']).toJS() : state.getIn(['spark', 'details']),
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch),
            sparkActions: bindActionCreators(actions, dispatch)
        };
    }
)(UserDetailView);