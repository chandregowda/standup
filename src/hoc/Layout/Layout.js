import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auxiliary from '../Auxiliary/Auxiliary';
import Classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
	state = {
		displaySideDrawer: false
	};
	closeSideDrawer = () => {
		this.setState({ displaySideDrawer: false });
	};
	toggleSideDrawer = () => {
		this.setState((prevState) => {
			return { displaySideDrawer: !prevState.displaySideDrawer };
		});
	};
	render() {
		return (
			<Auxiliary>
				<Toolbar
					isAuthenticated={this.props.isAuthenticated}
					displaySideDrawer={this.state.displaySideDrawer}
					toggleSideDrawer={this.toggleSideDrawer}
				/>
				<SideDrawer
					isAuthenticated={this.props.isAuthenticated}
					displaySideDrawer={this.state.displaySideDrawer}
					closeSideDrawer={this.closeSideDrawer}
				/>
				<main className={Classes.Content}>{this.props.children}</main>
			</Auxiliary>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};
export default connect(mapStateToProps)(Layout);
