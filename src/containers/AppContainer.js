import {connect} from 'react-redux'
import {createAppContainer} from 'react-navigation'

import AppView from './../views/AppView'
import codePush from 'react-native-code-push'

export default connect(
    state => ({
      isReady: state.getIn(['session', 'isReady']),
      loading: state.getIn(['app', 'loading'])
    })
)(AppView)
