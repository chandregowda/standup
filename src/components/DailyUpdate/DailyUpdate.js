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
					<span className={classes.TeamRoom}>({data.teamRoom})</span>
					<p className={classes.CreatedAt}>
						{moment.unix(data.createdAt / 1000).format('dddd, MMMM Do YYYY')}
					</p>
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

export default DailyUpdate;
