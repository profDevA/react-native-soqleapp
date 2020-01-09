import RewardsView from "../views/RewardsView";
import * as UserActions from "../reducers/UserReducer";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isImmutable} from 'immutable';
import * as rewardsActions from "../reducers/RewardsReducer";

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
    }),
    dispatch => {
        return {
            rewardsActions: bindActionCreators(rewardsActions, dispatch),
        };
    }
)(RewardsView);