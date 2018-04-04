import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import homeImage from '../../assets/images/DailyStandup3Ds.png';
import { inputChangeHandler } from '../../utility';

class Auth extends Component {
	state = {
		formIsValid: false,
		isSignUp: false,
		formFields: {
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

	onInputChange = (event, identifier) => {
		let { formFields, formIsValid } = inputChangeHandler({
			state: this.state,
			value: event.target.value,
			identifier
		});
		this.setState({ formFields, formIsValid });
	};

	signInHandler = (event) => {
		event.preventDefault();
		this.props.onFormSubmit(
			this.state.formFields.email.value,
			this.state.formFields.password.value,
			this.state.isSignUp
		);
	};

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/dailyUpdates" />;
		}

		let formElements = [];
		for (let key in this.state.formFields) {
			formElements.push({
				id: key,
				config: this.state.formFields[key]
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
							changed={(event) => this.onInputChange(event, elem.id)}
							elementType={elem.config.elementType}
							options={null}
							elementConfig={elem.config.elementConfig}
							value={elem.config.value}
							label={elem.config.label}
						/>
					);
				})}

				<Button btnType="Success-big" disabled={!this.state.formIsValid}>
					{this.state.isSignUp ? 'Sign Up' : 'Login'}
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}
		let errorMessage, message;
		if (this.props.error) {
			message = 'Invalid Credientials, Failed to login';
			if (this.props.error.message === 'ETIMEDOUT') {
				message = 'API Server down, please inform administrator';
			}
			errorMessage = <p className={classes.ERROR}>{message}</p>;
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
