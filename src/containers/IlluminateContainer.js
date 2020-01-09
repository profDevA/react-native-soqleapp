import {connect} from 'react-redux';
import {isImmutable} from 'immutable';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import IlluminateView from './../views/IlluminateView';
import * as UserActions from './../reducers/UserReducer';
import * as TaskActions from './../reducers/TaskReducer';
import * as sparkActions from './../reducers/SparkReducer';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
            : state.getIn(['user', 'user']),
        taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ? state.getIn(['user', 'task_groups']).toJS()
            : state.getIn(['user', 'task_groups']),
        getQuestionsSuccess: state.getIn(['user', 'getQuestionsSuccess']),
        world: isImmutable(state.getIn(['app', 'world'])) ? state.getIn(['app', 'world']).toJS()
                   : state.getIn(['app', 'world']),
        questions: isImmutable(state.getIn(['task', 'questions'])) ? state.getIn(['task', 'questions']).toJS()
            : state.getIn(['task', 'questions']),
        stories: isImmutable(state.getIn(['story', 'stories'])) ? state.getIn(['story', 'stories']).toJS()
            : state.getIn(['story', 'stories']),
        error: state.getIn(['task', 'error'])
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            taskActions: bindActionCreators(TaskActions, dispatch),
            userActions: bindActionCreators(UserActions, dispatch),
            sparkActions: bindActionCreators(sparkActions, dispatch)
        };
    }
)(IlluminateView);
