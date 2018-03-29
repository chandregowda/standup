import React, { Component } from 'react';
import classes from './DailyUpdates.css';
import standUpImage from '../../assets/images/scrum-daily-standup.jpg';

import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
// import { DateRangePicker } from 'react-dates';
// import uuid from 'uuid';

import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import axios from 'axios';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

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
						{
							value: 'agni',
							displayValue: 'Agni - Team 1'
						},
						{
							value: 'brahmos',
							displayValue: 'Brahmos - Team 2'
						},
						{
							value: 'prithvi',
							displayValue: 'Prithvi - Team 3'
						},
						{
							value: 'prahar',
							displayValue: 'Prahar - Team 4'
						}
					]
				},
				value: 'agni',
				label: { text: "I'm part of Team", color: 'blue' },
				isValid: true,
				validation: {}
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
					minimumLength: 6,
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
					minimumLength: 6,
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
					minimumLength: 6
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
		this.getReports();
	}

	handleDateChange = (createdAt) => {
		if (createdAt) {
			this.setState(
				() => ({
					createdAt
				}),
				() => {
					console.log('Calling Fetch after setstate is completed');
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

	validateFormFields = (value, rules) => {
		let isValid = true;
		if (!rules) {
			return isValid;
		}
		value = value.trim();
		if (rules.required) {
			isValid = value !== '';
		}
		if (isValid && rules.minimumLength) {
			isValid = value.length >= rules.minimumLength;
		}
		if (isValid && rules.maximumLength) {
			isValid = value.length <= rules.maximumLength;
		}
		// console.log(`isValid : ${isValid}`);
		return isValid;
	};

	inputChangeHandler = (event, identifier) => {
		const updatedFormData = { ...this.state.formFields };
		const updatedFormElement = { ...updatedFormData[identifier] };
		updatedFormElement.value = event.target.value;
		updatedFormElement.isValid = this.validateFormFields(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedFormData[identifier] = updatedFormElement;
		// console.log(updatedFormElement);
		let formIsValid = true;
		for (let inputIdentifer in updatedFormData) {
			formIsValid = updatedFormData[inputIdentifer].isValid && formIsValid;
		}
		this.setState({ formFields: updatedFormData, formIsValid: formIsValid });
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
		let form = (
			<form className={classes.Form} onSubmit={this.submitHandler}>
				<SingleDatePicker
					date={this.state.createdAt}
					onDateChange={this.handleDateChange}
					focused={this.state.calendarFocused}
					onFocusChange={this.handleFocusChanged}
					numberOfMonths={1}
					small
					isOutsideRange={() => false}
				/>
				<h4>{this.state.createdAt.format('dddd, MMMM Do YYYY')}</h4>
				{formElements.map((elem) => {
					return (
						<Input
							key={elem.id}
							isValid={elem.config.isValid}
							shouldValidate={elem.config.validation}
							hasTouched={elem.config.touched}
							changed={(event) => this.inputChangeHandler(event, elem.id)}
							elementType={elem.config.elementType}
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
						<p className={classes.Message}>{this.props.message}</p>
					</div>
				)}
				<Button btnType="Success" disabled={!this.state.formIsValid}>
					Submit
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.DailyUpdates}>
				<div className={classes.imgContainer}>
					<img src={standUpImage} className={classes.img} alt="Standup" />
				</div>

				{form}
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
		token: state.auth.token,
		accountName: state.auth.accountName,
		displayName: state.auth.displayName
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onDataSubmit: (postData, token) => dispatch(actions.submitDailyUpdates(postData, token)),
		onDailyUpdatesFetch: (token, accountName, createdAt, team) =>
			dispatch(actions.fetchDailyUpdates({ token, accountName, createdAt, team }))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(DailyUpdates, axios));
