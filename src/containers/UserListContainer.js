import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import * as UserActions from '../reducers/UserReducer';
import { bindActionCreators } from 'redux';
import UsersList from '../views/UsersList';


export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() : state.getIn(['user', 'user']),
        isLoading: state.getIn(['app', 'loading']),
        blockUserSuccess: state.getIn(['user', 'blockUserSuccess']),
        error: state.getIn(['user', 'error'])
    }),
    dispatch => {
        return {
            userActions: bindActionCreators(UserActions, dispatch),
        };
    }
)(UsersList);