import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {isImmutable} from 'immutable';

import * as actions from '../reducers/AchievementReducer';
import AchievementView from '../views/AchievementView';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
        achievements: isImmutable(state.getIn(['achievement', 'details'])) ?
            state.getIn(['achievement', 'details']).toJS() : state.getIn(['achievement', 'details']),
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            actions: bindActionCreators(actions, dispatch)
        };
    }
)(AchievementView);
