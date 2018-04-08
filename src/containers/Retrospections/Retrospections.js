import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

import classes from './Retrospections.css';

import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import { inputChangeHandler } from '../../utility';

class Retrospections extends Component {
	state = {
		formIsValid: false,
		createdAt: moment(),
		calendarFocused: false,
		formFields: {
			teamRoom: {
				elementType: 'select',
				elementConfig: {
					options: []
				},
				value: '',
				label: { text: "I'm part of Team", color: 'blue' },
				isValid: false,
				validation: {
					required: true
				}
			},
			right: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					rows: 4,
					placeholder: 'What worked well?'
				},
				value: '',
				label: { text: 'What worked or went well?', color: 'green' },
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 10,
					required: true
				}
			},
			wrong: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					rows: 4,
					placeholder: 'What could be improved?'
				},
				value: '',
				label: { text: 'What caused problems, failed to work properly or did not go well?', color: 'red' },
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 10,
					required: true
				}
			},
			suggestion: {
				elementType: 'textarea',
				elementConfig: {
					type: 'text',
					placeholder: 'What will we commit to doing in the next sprint?'
				},
				value: '',
				label: {
					text: 'What can be done differently in the next sprint to imporve the process?',
					color: 'orange'
				},
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 10,
					required: true
				}
			}
		}
	};

	getReports = () => {
		this.props.onRetrospectionsFetch(
			this.props.token,
			this.props.accountName,
			+this.state.createdAt.startOf('date'),
			this.state.formFields.teamRoom.value
		);
	};

	componentDidMount() {
		if (this.props.retrospections.length === 0) {
			this.getReports();
		}
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
		this.props.onRetrospectionsReset();
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
				<h2>Retrospection for {this.state.createdAt.format('dddd, MMMM Do YYYY')}</h2>

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
			<div className={classes.Retrospections}>
				<div className={classes.FormContainer}>{form} </div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		loading: state.retrospections.loading,
		error: state.retrospections.error,
		message: state.retrospections.message,
		retrospections: state.retrospections.retrospections,
		teamRooms: state.teamRooms.teamRooms,
		token: state.auth.token,
		accountName: state.auth.accountName,
		displayName: state.auth.displayName
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onDataSubmit: (postData, token) => dispatch(actions.submitRetrospections(postData, token)),
		onRetrospectionsFetch: (token, accountName, createdAt, team) =>
			dispatch(actions.fetchRetrospections({ token, accountName, createdAt, team })),
		onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id })),
		onRetrospectionsReset: () => dispatch(actions.retrospectionsReset())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(Retrospections, axios));
