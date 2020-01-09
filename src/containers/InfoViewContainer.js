import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isImmutable} from 'immutable';

import * as UserActions from './../reducers/UserReducer';
import InfoView from "../views/InfoView";
import {NavigationActions} from "react-navigation";

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
        taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ?
            state.getIn(['user', 'task_groups']).toJS() : state.getIn(['user', 'task_groups']),
        messages: state.getIn(['user', 'messages']),
        reportUserSuccess: state.getIn(['user','reportUserSuccess'])
    }),
    dispatch => {
        return {
            userActions: bindActionCreators(UserActions, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(InfoView);