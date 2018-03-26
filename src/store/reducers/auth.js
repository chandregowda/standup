import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const INITIAL_STATE = {
	error: false,
	loading: false,
	token: null,
	userId: null
};

const authStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};

const authSuccess = (state, action) => {
	return updateObject(state, {
		error: false,
		loading: false,
		token: action.payload.token,
		userId: action.payload.userId
	});
};
const authFail = (state, action) => {
	return updateObject(state, {
		error: action.payload.error,
		loading: false
	});
};

const authLogout = (state, action) => {
	return updateObject(state, { token: null, userId: null });
};

/**
* @param {Object} state - Default application state
* @param {Object} action - Action from action creator
* @returns {Object} New state
*/
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return authStart(state, action);
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action);
		case actionTypes.AUTH_FAIL:
			return authFail(state, action);
		case actionTypes.AUTH_LOGOUT:
			return authLogout(state, action);
		default:
			return state;
	}
};
