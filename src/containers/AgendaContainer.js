import {connect} from 'react-redux';

import AgendaView from './../views/AgendaView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady'])
    })
)(AgendaView);
