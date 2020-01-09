import {connect} from 'react-redux';
import {isImmutable} from 'immutable';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import CompanyView from './../views/CompanyView';
import * as CompanyActions from './../reducers/CompanyReducer';

export default connect(
    state => ({
        details: isImmutable(state.getIn(['company', 'details'])) ?
            state.getIn(['company', 'details']).toJS() : state.getIn(['company', 'details']),
        isLoading: state.getIn(['app', 'loading'])
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            companyActions: bindActionCreators(CompanyActions, dispatch)
        };
    }
)(CompanyView);
