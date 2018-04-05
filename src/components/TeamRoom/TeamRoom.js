import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './TeamRoom.css';
import * as actions from '../../store/actions/index';
// import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-dailyUpdates';

class TeamRoom extends Component {
	deleteTeamRoom(id) {
		this.props.onDeleteTeamRoom(id);
	}
	getUserName = (accountName) => {
		if (this.props.users) {
			return this.props.users[accountName] || accountName;
		}
		return accountName;
	};
	render() {
		let room = this.props.data;
		let actionItems =
			this.props.accountName.toLowerCase() === room.owner.toLowerCase() ? (
				<span className={classes.Delete} onClick={() => this.deleteTeamRoom(room._id)}>
					&#10008;
				</span>
			) : (
				<span>&nbsp;</span>
			);
		let members = null;
		if (this.props.data.members.length > 0) {
			members = this.props.data.members.map((m, index) => {
				return <li key={index}>{this.getUserName(m)}</li>;
			});
		}
		let memberDetails = members ? <ul>{members}</ul> : null;
		return (
			<section className={classes.TeamRoom}>
				<div className={classes.RoomName}>
					{room.displayName}
					{actionItems}
				</div>
				<div className={classes.ActionContainer}>
					<div className={classes.OwnerName}>by - {room.ownerName}</div>
				</div>
				<div>{memberDetails}</div>
			</section>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteTeamRoom: (id) => dispatch(actions.deleteTeamRoom(id))
	};
};

export default connect(null, mapDispatchToProps)(withErrorHandler(TeamRoom, axios));
