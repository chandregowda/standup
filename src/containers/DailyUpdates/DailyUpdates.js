import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import faCoffee from '@fortawesome/fontawesome-free-solid/faCoffee';

import classes from './DailyUpdates.comp.css';

import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import { inputChangeHandler } from '../../utility';

class DailyUpdates extends Component {
	state = {
		formIsValid: false,
		createdAt: moment(),
		calendarFocused: false,
		formFields: {
			teamRoom: {
				elementType: 'select',
				elementConfig: {
					options: [
						// {
						// 	value: 'agni',
						// 	displayName: 'Agni - Team 1'
						// },
						// {
						// 	value: 'brahmos',
						// 	displayName: 'Brahmos - Team 2'
						// },
						// {
						// 	value: 'prithvi',
						// 	displayName: 'Prithvi - Team 3'
						// },
						// {
						// 	value: 'prahar',
						// 	displayName: 'Prahar - Team 4'
						// },
						// {
						// 	value: 'shaurya',
						// 	displayName: 'Shaurya - Team 5'
						// }
					]
				},
				value: '',
				label: { text: "I'm part of Team", color: 'blue' },
				isValid: false,
				validation: {
					required: true
				}
			},
			yesterday: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					rows: 4,
					placeholder: 'This is what I have done since we last met...'
				},
				value: '',
				label: { text: 'What I did last day', color: 'green' },
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 3,
					required: true
				}
			},
			today: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					rows: 4,
					placeholder: 'This is what I plan to do today...'
				},
				value: '',
				label: { text: 'What I will do today', color: 'orange' },
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 3,
					required: true
				}
			},
			obstacles: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					placeholder: 'These are the obstacles I have encountered...'
				},
				value: '',
				label: { text: 'What are my obstacles', color: 'red' },
				isValid: true,
				touched: false,
				validation: {
					// minimumLength: 0
				}
			}
		}
	};

	getReports = () => {
		this.props.onDailyUpdatesFetch(
			this.props.token,
			this.props.accountName,
			+this.state.createdAt.startOf('date'),
			this.state.formFields.teamRoom.value
		);
	};

	componentDidMount() {
		if (this.props.dailyUpdates.length === 0) {
			this.getReports();
		}
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
		this.props.onDailyUpdatesReset();
	}

	handleDateChange = (createdAt) => {
		if (createdAt) {
			this.setState(
				() => ({
					createdAt
				}),
				() => {
					// console.log('Calling Fetch after setstate is completed');
					this.getReports();
				}
			);
		}
	};
	handleFocusChanged = ({ focused }) => {
		this.setState(() => ({
			calendarFocused: focused
		}));
	};

	onInputChange = (event, identifier) => {
		let { formFields, formIsValid } = inputChangeHandler({
			state: this.state,
			value: event.target.value,
			identifier
		});
		this.setState({ formFields, formIsValid });
	};

	submitHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIdentifier in this.state.formFields) {
			formData[formElementIdentifier] = this.state.formFields[formElementIdentifier].value;
		}

		// this.setState({ loading: true });
		const data = {
			...formData,
			createdAt: +this.state.createdAt.startOf('date'),
			accountName: this.props.accountName,
			displayName: this.props.displayName
			// uniqueId: uuid()
		};
		this.props.onDataSubmit(data, this.props.token);
	};

	render() {
		let formElements = [];
		for (let key in this.state.formFields) {
			formElements.push({
				id: key,
				config: this.state.formFields[key]
			});
		}

		let selectOptions = [ { value: '', displayName: 'Select Team Room', _id: '0' } ].concat(this.props.teamRooms);

		let form = (
			<form className={classes.Form} onSubmit={this.submitHandler}>
				<h2>My Updates for {this.state.createdAt.format('dddd, MMMM Do YYYY')}</h2>

				<SingleDatePicker
					date={this.state.createdAt}
					onDateChange={this.handleDateChange}
					focused={this.state.calendarFocused}
					onFocusChange={this.handleFocusChanged}
					numberOfMonths={1}
					showDefaultInputIcon={true}
					small
					isOutsideRange={() => false}
				/>
				{formElements.map((elem) => {
					return (
						<Input
							key={elem.id}
							isValid={elem.config.isValid}
							shouldValidate={elem.config.validation}
							hasTouched={elem.config.touched}
							changed={(event) => this.onInputChange(event, elem.id)}
							elementType={elem.config.elementType}
							options={selectOptions}
							elementConfig={elem.config.elementConfig}
							value={elem.config.value}
							label={elem.config.label}
						/>
					);
				})}
				{this.props.error && (
					<div>
						<p className={classes.Error}>{this.props.error.message}</p>
					</div>
				)}
				{this.props.message && (
					<div>
						<p className={classes.Message}>&#10004; {this.props.message}</p>
					</div>
				)}
				<Button btnType="Success-big" disabled={!this.state.formIsValid}>
					Submit
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.DailyUpdates}>
				{/* <FontAwesomeIcon icon={faCoffee} /> */}
				<div className={classes.FormContainer}>{form} </div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		loading: state.dailyUpdates.loading,
		error: state.dailyUpdates.error,
		message: state.dailyUpdates.message,
		dailyUpdates: state.dailyUpdates.dailyUpdates,
		teamRooms: state.teamRooms.teamRooms,
		token: state.auth.token,
		accountName: state.auth.accountName,
		displayName: state.auth.displayName
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onDataSubmit: (postData, token) => dispatch(actions.submitDailyUpdates(postData, token)),
		onDailyUpdatesFetch: (token, accountName, createdAt, team) =>
			dispatch(actions.fetchDailyUpdates({ token, accountName, createdAt, team })),
		onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id })),
		onDailyUpdatesReset: () => dispatch(actions.dailyUpdatesReset())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(DailyUpdates, axios));
