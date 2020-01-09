import {connect} from 'react-redux'
import {isImmutable} from 'immutable'

import StoryView from './../views/StoryView'
import * as StoryActions from '../reducers/StoryReducer'
import {bindActionCreators} from 'redux'
import * as UserActions from './../reducers/UserReducer'

export default connect(
    state => ({
      user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
            : state.getIn(['user', 'user']),
      world: isImmutable(state.getIn(['app', 'world'])) ? state.getIn(['app', 'world']).toJS()
            : state.getIn(['app', 'world']),
      userProfile: isImmutable(state.getIn(['app', 'user'])) ? state.getIn(['app', 'user']).toJS()
            : state.getIn(['app', 'user']),      
      stories: isImmutable(state.getIn(['story', 'stories'])) ? state.getIn(['story', 'stories']).toJS()
          : state.getIn(['story', 'stories'])
    }),
    dispatch => {
      return {
        storyActions: bindActionCreators(StoryActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch)
      }
    }
)(StoryView)
