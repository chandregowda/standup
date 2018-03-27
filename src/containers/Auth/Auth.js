import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import homeImage from '../../assets/images/DailyStandup3Ds.png';

class Auth extends Component {
	state = {
		formIsValid: false,
		isSignUp: false,
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: '@yodlee.com'
				},
				value: '',
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 3,
					required: true
				}
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Your Password'
				},
				value: '',
				isValid: false,
				touched: false,
				validation: {
					required: true,
					minimumLength: 3,
					maximumLength: 24
				}
			}
		}
	};

	switchSignMethod = () => {
		this.setState((prevState) => {
			return { isSignUp: !prevState.isSignUp };
		});
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
		const updatedFormData = { ...this.state.controls };
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
		this.setState({ controls: updatedFormData, formIsValid: formIsValid });
	};

	signInHandler = (event) => {
		event.preventDefault();
		this.props.onFormSubmit(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignUp
		);
	};

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/dailyUpdates" />;
		}

		let formElements = [];
		for (let key in this.state.controls) {
			formElements.push({
				id: key,
				config: this.state.controls[key]
			});
		}
		let form = (
			<form className={classes.Form} onSubmit={this.signInHandler}>
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
						/>
					);
				})}

				<Button btnType="Success" disabled={!this.state.formIsValid}>
					{this.state.isSignUp ? 'Sign Up' : 'Login'}
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}
		let errorMessage = '';
		if (this.props.error) {
			if (this.props.error.message === 'INVALID_CREDS') {
				errorMessage = <p className={classes.ERROR}>Invalid Credientials, Failed to login</p>;
			} else {
				errorMessage = <p className={classes.ERROR}>{this.props.error.message}</p>;
			}
		}
		return (
			<div className={classes.Auth}>
				<div className={classes.Logo}>
					<img src={homeImage} alt="Home" />
				</div>
				{form}
				{errorMessage}
				{1 === 2 && (
					<Button btnType="Danger" clicked={this.switchSignMethod}>
						Switch to {this.state.isSignUp ? 'Sign In' : 'Sign Up'}
					</Button>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFormSubmit: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
