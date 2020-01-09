import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {isImmutable} from 'immutable'

import * as UserActions from '../reducers/UserReducer';
import ExportView from '../views/ExportView';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
        : state.getIn(['user', 'user'])
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch),
        };
    }
)(ExportView);
