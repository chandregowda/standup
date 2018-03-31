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
		return (
			<section className={classes.TeamRoom}>
				<div className={classes.RoomName}>{room.displayName}</div>
				<div className={classes.ActionContainer}>
					{actionItems}
					<div className={classes.OwnerName}>by - {room.ownerName}</div>
				</div>
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
