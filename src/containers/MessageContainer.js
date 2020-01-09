import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Map, List, isImmutable} from 'immutable'
import * as MessageActions from "../reducers/MessageReducer";
import * as UserActions from "../reducers/UserReducer";
import BaseComponent from "../views/BaseComponent";

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
            : state.getIn(['user', 'user']),
        world: isImmutable(state.getIn(['app', 'world'])) ? state.getIn(['app', 'world']).toJS()
            : state.getIn(['app', 'world']),
        messages: isImmutable(state.getIn(['message', 'messages'])) ? state.getIn(['message', 'messages']).toJS()
            : state.getIn(['message', 'messages'])
    }),
    dispatch => {
        return {
            messageActions: bindActionCreators(MessageActions, dispatch),
            userActions: bindActionCreators(UserActions, dispatch)
        }
    }
)(BaseComponent)