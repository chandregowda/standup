import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utility';

const INITIAL_STATE = {
	usersMap: {},
	users: [],
	loading: false,
	error: false,
	message: ''
};

const userReset = (state, action) => {
	return updateObject(state, { error: false, loading: false, message: '' });
};
const fetchUsersStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};
const fetchUsersSuccess = (state, action) => {
	return updateObject(state, {
		users: action.payload.users,
		usersMap: action.payload.usersMap,
		loading: false
	});
};
const fetchUsersFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};

const addUsersStart = (state, action) => {
	return updateObject(state, { error: false, loading: true, message: '' });
};
const addUsersSuccess = (state, action) => {
	return updateObject(state, { loading: false, message: action.payload.message });
};
const addUsersFail = (state, action) => {
	console.log('addUsersFail', action.payload.error);
	return updateObject(state, { loading: false, error: action.payload.error });
};

/**
* @param {Object} state - Default application state
* @param {Object} action - Action from action creator
* @returns {Object} New state
*/
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.FETCH_USERS_START:
			return fetchUsersStart(state, action);
		case actionTypes.FETCH_USERS_SUCCESS:
			return fetchUsersSuccess(state, action);
		case actionTypes.FETCH_USERS_FAIL:
			return fetchUsersFail(state, action);

		case actionTypes.ADD_USERS_START:
			return addUsersStart(state, action);
		case actionTypes.ADD_USERS_SUCCESS:
			return addUsersSuccess(state, action);
		case actionTypes.ADD_USERS_FAIL:
			return addUsersFail(state, action);

		case actionTypes.USERS_RESET:
			return userReset(state, action);

		default:
			return userReset(state, action);
	}
};
