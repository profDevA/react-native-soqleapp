import {connect} from 'react-redux';
import {isImmutable} from 'immutable';

import LevelView from './../views/LevelView';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
    })
)(LevelView);
