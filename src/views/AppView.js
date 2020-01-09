import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import Loader from '../components/Loader';

import * as snapshotUtil from '../utils/snapshot';
import * as SessionStateActions from '../session/SessionState';
import store from '../redux/store';
import DeveloperMenu from '../components/DeveloperMenu';
import NavigatorViewContainer from '../navigator/NavigatorViewContainer';
import {MAIN_COLOR} from '../constants';
import styles from '../stylesheets/appViewStyles';

class AppView extends Component {

  static propTypes = {
      isReady: PropTypes.bool.isRequired,
      dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
      snapshotUtil.resetSnapshot()
          .then(snapshot => {
              const {dispatch} = this.props;

              if (snapshot) {
                  dispatch(SessionStateActions.resetSessionStateFromSnapshot(snapshot));
              } else {
                  dispatch(SessionStateActions.initializeSessionState());
              }

              store.subscribe(() => snapshotUtil.saveSnapshot(store.getState()));
          });
  }


  render() {
      console.log("propserror ", this.props)


      return (
          <View style={{flex: 1}}>
              <StatusBar backgroundColor='#455a64' barStyle='light-content' />
              <NavigatorViewContainer />
              {this.props.loading && <Loader
                  color={MAIN_COLOR}
                  visible={this.props.loading}
              />}
              {__DEV__ && <DeveloperMenu />}
          </View>
      );
  }
}

export default AppView;
