import React, { Component } from 'react';
import classes from './DailyUpdate.css';
import moment from 'moment';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-dailyUpdates';
import * as actions from '../../store/actions/index';

class DailyUpdate extends Component {
	render() {
		let data = this.props.data;
		let dateTime = true && (
			<p className={classes.CreatedAt}>{moment.unix(data.createdAt / 1000).format('dddd, MMMM Do YYYY')}</p>
		);
		let actionItems = null;
		actionItems =
			this.props.accountName.toLowerCase() === data.accountName.toLowerCase() ? (
				<span
					className={classes.Delete}
					onClick={() =>
						this.props.onDeleteDailyUpdate({
							id: data._id,
							startDate: this.props.startDate,
							endDate: this.props.endDate,
							accountName: data.accountName
						})}
				>
					&#10008;
				</span>
			) : (
				<span>&nbsp;</span>
			);
		return (
			<div className={classes.DailyUpdate}>
				<div>
					<div className={classes.Toolbar}>
						<div>
							<span className={classes.User}>{data.displayName}</span>
							<span className={classes.TeamRoom}>({this.props.teamRoomDisplayName})</span>
						</div>
						{actionItems}
					</div>
					{dateTime}
				</div>
				<section className={classes.CommentContainer}>
					<label className={classes.Yesterday}>What I did last day</label>
					<article className={classes.Comment}>
						<pre>{data.yesterday}</pre>
					</article>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Today}>What I will do today</label>
					<article className={classes.Comment}>
						<pre>{data.today}</pre>
					</article>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Obstacle}>What are my obstacles</label>
					<article className={classes.Comment}>
						<pre>{data.obstacles}</pre>
					</article>
				</section>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteDailyUpdate: ({ id, startDate, endDate, accountName }) => {
			dispatch(actions.deleteDailyUpdate({ id, startDate, endDate, accountName }));
		}
	};
};

export default connect(null, mapDispatchToProps)(withErrorHandler(DailyUpdate, axios));
