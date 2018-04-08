import React, { Component } from 'react';
import classes from './Retrospection.css';
import moment from 'moment';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-dailyUpdates';
import * as actions from '../../store/actions/index';

class Retrospection extends Component {
	render() {
		let data = this.props.data;
		let dateTime = (
			<p className={classes.CreatedAt}>{moment.unix(data.createdAt / 1000).format('dddd, MMMM Do YYYY')}</p>
		);
		let actionItems = null;
		actionItems =
			this.props.accountName.toLowerCase() === data.accountName.toLowerCase() ? (
				<span
					className={classes.Delete}
					onClick={() =>
						this.props.onDeleteRetrospection({
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
			<div className={classes.Retrospection}>
				<div>
					<div className={classes.Toolbar}>
						<div>
							<span className={classes.User}>Anonymous</span>
							<span className={classes.TeamRoom}>({this.props.teamRoomDisplayName})</span>
						</div>
						{actionItems}
					</div>
					{dateTime}
				</div>
				<section className={classes.CommentContainer}>
					<label className={classes.Yesterday}>What worked or went well</label>
					<article className={classes.Comment}>
						<pre>{data.right}</pre>
					</article>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Today}>What caused problems</label>
					<article className={classes.Comment}>
						<pre>{data.wrong}</pre>
					</article>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Obstacle}>What can be done differently</label>
					<article className={classes.Comment}>
						<pre>{data.suggestion}</pre>
					</article>
				</section>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteRetrospection: ({ id, startDate, endDate, accountName }) => {
			dispatch(actions.deleteRetrospection({ id, startDate, endDate, accountName }));
		}
	};
};

export default connect(null, mapDispatchToProps)(withErrorHandler(Retrospection, axios));
