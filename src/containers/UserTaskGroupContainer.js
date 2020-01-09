import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {NavigationActions} from 'react-navigation'
import {isImmutable} from 'immutable'

import * as UserActions from './../reducers/UserReducer'
import UserTaskGroupView from './../views/UserTaskGroupView'

export default connect(
    state => ({
      user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS()
            : state.getIn(['user', 'user']),
      taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ? state.getIn(['user', 'task_groups']).toJS()
            : state.getIn(['user', 'task_groups']),
      error: state.getIn(['user', 'error']),
      userTaskGroupsSuccess: state.getIn(['user', 'getUserTaskGroups'])
    }),
    dispatch => {
      return {
        navigate: bindActionCreators(NavigationActions.navigate, dispatch),
        userActions: bindActionCreators(UserActions, dispatch)
      }
    }
)(UserTaskGroupView)
