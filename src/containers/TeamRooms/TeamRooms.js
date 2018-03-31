import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import classes from './TeamRooms.css';
// import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import TeamRoom from '../../components/TeamRoom/TeamRoom';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import Input from '../../components/UI/Input/Input';
import { inputChangeHandler } from '../../utility';

class TeamRooms extends Component {
	state = {
		toggleClicked: false,
		formIsValid: false,
		formFields: {
			displayName: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Enter New Team Name'
				},
				value: '',
				label: { text: 'New Team Name', color: 'inherit' },
				isValid: false,
				touched: false,
				validation: {
					minimumLength: 6,
					required: true
				}
			}
		}
	};
	componentDidMount() {
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
		this.props.onTeamRoomReset();
	}
	onInputChange = (event, identifier) => {
		let { formFields, formIsValid } = inputChangeHandler({
			state: this.state,
			value: event.target.value,
			identifier
		});
		this.setState({ formFields, formIsValid });
	};

	onAddTogglerClick = () => {
		this.setState((prevState) => ({ toggleClicked: !prevState.toggleClicked }));
	};
	submitHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIdentifier in this.state.formFields) {
			formData[formElementIdentifier] = this.state.formFields[formElementIdentifier].value;
			formData['value'] = this.state.formFields[formElementIdentifier].value.replace(/\s/g, '_').toLowerCase(); // Space to _
		}
		const data = { ...formData };
		this.props.onTeamRoomAdd(data);
	};
	render() {
		let teamRoomsList = null;
		let addForm = null;

		let formElements = [];
		for (let key in this.state.formFields) {
			formElements.push({
				id: key,
				config: this.state.formFields[key]
			});
		}
		let form = (
			<form className={classes.Form} onSubmit={this.submitHandler}>
				{formElements.map((elem) => {
					return (
						<Input
							key={elem.id}
							isValid={elem.config.isValid}
							shouldValidate={elem.config.validation}
							hasTouched={elem.config.touched}
							changed={(event) => this.onInputChange(event, elem.id)}
							elementType={elem.config.elementType}
							options={this.props.teamRooms}
							elementConfig={elem.config.elementConfig}
							value={elem.config.value}
							label={elem.config.label}
						/>
					);
				})}
				{this.props.error && (
					<div>
						<p className={classes.Error}>{this.props.error.message || this.props.error.errmsg}</p>
					</div>
				)}
				{this.props.message && (
					<div>
						<p className={classes.Message}>&#10004; {this.props.message}</p>
					</div>
				)}
				<Button btnType="Success-big" disabled={!this.state.formIsValid}>
					Add New Team
				</Button>
			</form>
		);

		if (this.props.loading) {
			teamRoomsList = <Spinner />;
		} else {
			teamRoomsList = this.props.teamRooms.map((tr, index) => {
				return <TeamRoom data={tr} key={tr._id} accountName={this.props.accountName} />;
			});
		}

		if (this.state.toggleClicked) {
			addForm = <div>{form}</div>;
		}

		return (
			<div className={classes.TeamRooms}>
				<h2 className={classes.Title}>Team Rooms</h2>
				<div>
					<Button btnType="Success" clicked={this.onAddTogglerClick}>
						&#10010; Add Team
					</Button>
					{addForm}
				</div>
				<div className={classes.TeamRoomsContainer}>{teamRoomsList}</div>
				<footer className={classes.Disclaimer}>* You can delete team rooms owned by you.</footer>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.teamRooms.loading,
		error: state.teamRooms.error,
		message: state.teamRooms.message,
		teamRooms: state.teamRooms.teamRooms,
		accountName: state.auth.accountName
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id })),
		onTeamRoomAdd: (data) => dispatch(actions.addTeamRoom(data)),
		onTeamRoomReset: (data) => dispatch(actions.teamRoomReset())
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(TeamRooms, axios));
