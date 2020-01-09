import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {isImmutable} from 'immutable';

import * as actions from './../reducers/SparkReducer';
import SparkView from './../views/SparkView';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
        sparks: isImmutable(state.getIn(['spark', 'details'])) ? state.getIn(['spark', 'details']).toJS() :
            state.getIn(['spark', 'details']),
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            actions: bindActionCreators(actions, dispatch)
        };
    }
)(SparkView);
