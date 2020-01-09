import * as UserActions from '../reducers/UserReducer';
import CommentsView from '../views/CommentsView';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

export default connect(
    state => ({
        commentsPost: isImmutable(state.getIn(['user', 'commentsPost'])) ? state.getIn(['user', 'commentsPost']).toJS() : state.getIn(['user', 'commentsPost']),
        postUserCommentsSuccess: state.getIn(['user', 'postUserCommentsSuccess']),
        userLike: isImmutable(state.getIn(['user', 'userLike'])) ? state.getIn(['user', 'userLike']).toJS() : state.getIn(['user', 'userLike']),
        userLikeSuccess: state.getIn(['user', 'userLikeSuccess']),

    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch)
        };
    }
)(CommentsView);
