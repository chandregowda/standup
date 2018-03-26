import React, { Component } from 'react';
import classes from './DailyUpdateData.css';
import standUpImage from '../../assets/images/scrum-daily-standup.jpg';

import moment from 'moment';
// import { DateRangePicker } from 'react-dates';
// import uuid from 'uuid';
import { SingleDatePicker } from 'react-dates';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

class DailyUpdateData extends Component {
	state = {
		formIsValid: false,
		createdAt: moment(),
		calendarFocused: false,
		formFields: {
			// name: {
			// 	elementType: 'input',
			// 	elementConfig: {
			// 		type: 'text',
			// 		placeholder: 'Your Name'
			// 	},
			// 	value: '',
			// 	isValid: false,
			// 	touched: false,
			// 	validation: {
			// 		required: true,
			// 		minimumLength: 3,
			// 		maximumLength: 25
			// 	}
			// },
			// email: {
			// 	elementType: 'input',
			// 	elementConfig: {
			// 		type: 'email',
			// 		placeholder: '@'
			// 	},
			// 	value: '',
			// 	isValid: false,
			// 	touched: false,
			// 	validation: {
			// 		minimumLength: 6,
			// 		required: true
			// 	}
			// },
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
				label: { text: 'My obstacles/roadblocks', color: 'red' },
				isValid: true,
				touched: false,
				validation: {
					minimumLength: 6
				}
			}
		}
	};

	handleDateChange = (createdAt) => {
		if (createdAt) {
			this.setState(() => ({
				createdAt
			}));
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

	render() {
		let formElements = [];
		for (let key in this.state.formFields) {
			formElements.push({
				id: key,
				config: this.state.formFields[key]
			});
		}
		let form = (
			<form className={classes.Form} onSubmit={this.orderHandler}>
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

				<Button btnType="Success" disabled={!this.state.formIsValid}>
					Submit
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.DailyUpdateData}>
				<SingleDatePicker
					date={this.state.createdAt}
					onDateChange={this.handleDateChange}
					focused={this.state.calendarFocused}
					onFocusChange={this.handleFocusChanged}
					numberOfMonths={1}
					isOutsideRange={() => false}
				/>
				<div className={classes.imgContainer}>
					<img src={standUpImage} className={classes.img} alt="Standup" />
				</div>

				{form}
			</div>
		);
	}
}

export default DailyUpdateData;
