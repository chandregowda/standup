import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
	componentWillMount() {
		this.props.onLogout();
	}

	render() {
		return <Redirect to="/auth" />;
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => {
			console.log('Calling Logout...');
			return dispatch(actions.authLogout());
		}
	};
};

export default connect(null, mapDispatchToProps)(Logout);
