import { connect } from 'react-redux'
import { isImmutable } from 'immutable'

import DecodeView from './../views/DecodeView';
import { bindActionCreators } from 'redux'
import * as UserActions from './../reducers/UserReducer'

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
            : state.getIn(['user', 'user']),
        world: isImmutable(state.getIn(['app', 'world'])) ? state.getIn(['app', 'world']).toJS()
            : state.getIn(['app', 'world'])
    }),
    dispatch => {
        return {
            userActions: bindActionCreators(UserActions, dispatch)
        }
    }
)(DecodeView)