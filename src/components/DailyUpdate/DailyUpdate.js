import React, { Component } from 'react';
import classes from './DailyUpdate.css';
import moment from 'moment';

class DailyUpdate extends Component {
	render() {
		let data = this.props.data;
		return (
			<div className={classes.DailyUpdate}>
				<div>
					<span className={classes.User}>{data.displayName}</span>
					<span className={classes.CreatedAt}>
						{moment.unix(data.createdAt / 1000).format('dddd, MMMM Do YYYY')}
					</span>
				</div>
				<section className={classes.CommentContainer}>
					<label className={classes.Yesterday}>What I did last day</label>
					<p className={classes.Comment}>{data.yesterday}</p>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Today}>What I will do today</label>
					<p className={classes.Comment}>{data.today}</p>
				</section>
				<section className={classes.CommentContainer}>
					<label className={classes.Obstacle}>What are my obstacles</label>
					<p className={classes.Comment}>{data.obstacles}</p>
				</section>
			</div>
		);
	}
}

export default DailyUpdate;
