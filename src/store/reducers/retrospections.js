import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utility';

const INITIAL_STATE = {
	retrospections: [],
	loading: false,
	error: false,
	message: ''
};

const retrospectionReset = (state, action) => {
	return updateObject(state, { error: false, loading: false, message: '' });
};

const fetchRetrospectionsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};
const fetchRetrospectionsSuccess = (state, action) => {
	return updateObject(state, { retrospections: action.payload.retrospections, loading: false });
};
const fetchRetrospectionsFail = (state, action) => {
	return updateObject(state, { loading: false });
};

const submitRetrospectionsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true, message: '' });
};
const submitRetrospectionsSuccess = (state, action) => {
	return updateObject(state, { loading: false, message: action.payload.message });
};
const submitRetrospectionsFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};
const deleteRetrospectionSuccess = (state, action) => {
	return updateObject(state, { loading: false });
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.RETROSPECTION_RESET:
			return retrospectionReset(state, action);
		case actionTypes.FETCH_RETROSPECTION_START:
			return fetchRetrospectionsStart(state, action);
		case actionTypes.FETCH_RETROSPECTION_SUCCESS:
			return fetchRetrospectionsSuccess(state, action);
		case actionTypes.FETCH_RETROSPECTION_FAIL:
			return fetchRetrospectionsFail(state, action);

		case actionTypes.SUBMIT_RETROSPECTION_START:
			return submitRetrospectionsStart(state, action);
		case actionTypes.SUBMIT_RETROSPECTION_SUCCESS:
			return submitRetrospectionsSuccess(state, action);
		case actionTypes.SUBMIT_RETROSPECTION_FAIL:
			return submitRetrospectionsFail(state, action);

		case actionTypes.DELETE_DAILY_UPDATE_START:
			return submitRetrospectionsStart(state, action);
		case actionTypes.DELETE_DAILY_UPDATE_SUCCESS:
			return deleteRetrospectionSuccess(state, action);
		case actionTypes.DELETE_DAILY_UPDATE_FAIL:
			return submitRetrospectionsFail(state, action);

		default:
			return state;
	}
};
