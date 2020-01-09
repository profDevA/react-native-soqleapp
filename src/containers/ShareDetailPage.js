import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {NavigationActions} from 'react-navigation'

import ShareDetailPage from './../views/ShareDetailPage'

export default connect(
    state => ({
      user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
          state.getIn(['user', 'user']),
      taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ?
          state.getIn(['user', 'task_groups']).toJS() : state.getIn(['user', 'task_groups']),
      messages: state.getIn(['user', 'messages']),
    }),
    dispatch => {
      return {
        navigate: bindActionCreators(NavigationActions.navigate, dispatch)
      }
    }
)(ShareDetailPage)
