import { connect } from 'react-redux';

import NavigatorView from './NavigatorView';

export default connect(
    state => ({
        navigatorState: state.get('navigatorState').toJS(),
        userState: state.get('user').toJS()
    })
)(NavigatorView);
