import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isImmutable} from 'immutable';

import * as UserActions from './../reducers/UserReducer';
import BraindumpView from './../views/BraindumpView';
import {NavigationActions} from 'react-navigation';
import * as TaskActions from './../reducers/TaskReducer';
import * as sparkActions from './../reducers/SparkReducer';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
        taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ?
            state.getIn(['user', 'task_groups']).toJS() : state.getIn(['user', 'task_groups']),
        messages: state.getIn(['user', 'messages']),
        world: isImmutable(state.getIn(['app', 'world'])) ? state.getIn(['app', 'world']).toJS()
                   : state.getIn(['app', 'world']),
        stories: isImmutable(state.getIn(['story', 'stories'])) ? state.getIn(['story', 'stories']).toJS()
                       : state.getIn(['story', 'stories']),
        reportUserSuccess: state.getIn(['user','reportUserSuccess'])
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            taskActions: bindActionCreators(TaskActions, dispatch),
            userActions: bindActionCreators(UserActions, dispatch),
            sparkActions: bindActionCreators(sparkActions, dispatch)
        };
    }
)(BraindumpView);
