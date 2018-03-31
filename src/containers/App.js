import React, { Component } from 'react';
import classes from './App.css';

import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Layout from '../hoc/Layout/Layout';
import withClass from '../hoc/withClass';
import Auth from './Auth/Auth';
import Logout from './Auth/Logout/Logout';
import * as actions from '../store/actions/index';
import DailyUpdates from './DailyUpdates/DailyUpdates';
import Reports from './Reports/Reports';
import TeamRooms from './TeamRooms/TeamRooms';
import Home from '../components/Home/Home';

// This _datepicker css is required for Calander component
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoLogin();
	}

	render() {
		let route = (
			<Switch>
				<Route path="/auth" component={Auth} />
				<Route path="/" exact component={Home} />
				<Redirect to="/" />
			</Switch>
		);

		if (this.props.isAuthenticated) {
			route = (
				<Switch>
					<Route path="/auth" component={Auth} />
					<Route path="/logout" component={Logout} />
					<Route path="/Reports" component={Reports} />
					<Route path="/dailyUpdates" component={DailyUpdates} />
					<Route path="/teamRooms" component={TeamRooms} />
					<Route path="/" exact component={Home} />
				</Switch>
			);
		}

		return (
			<div className={classes.MainContainer}>
				<Layout>{route}</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoLogin: () => {
			// console.log('Trying Auto login');
			return dispatch(actions.authCheckState());
		}
	};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withClass(App)));
