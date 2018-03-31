import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utility';

const INITIAL_STATE = {
	teamRoomsMap: {},
	teamRooms: [],
	loading: false,
	error: false,
	message: ''
};

const teamRoomReset = (state, action) => {
	return updateObject(state, { error: false, loading: false, message: '' });
};
const fetchTeamRoomsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};
const fetchTeamRoomsSuccess = (state, action) => {
	return updateObject(state, {
		teamRooms: action.payload.teamRooms,
		teamRoomsMap: action.payload.teamRoomsMap,
		loading: false
	});
};
const fetchTeamRoomsFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};

const addTeamRoomsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true, message: '' });
};
const addTeamRoomsSuccess = (state, action) => {
	return updateObject(state, { loading: false, message: action.payload.message });
};
const addTeamRoomsFail = (state, action) => {
	console.log('addTeamRoomsFail', action.payload.error);
	return updateObject(state, { loading: false, error: action.payload.error });
};

/**
* @param {Object} state - Default application state
* @param {Object} action - Action from action creator
* @returns {Object} New state
*/
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.FETCH_TEAM_ROOMS_START:
			return fetchTeamRoomsStart(state, action);
		case actionTypes.FETCH_TEAM_ROOMS_SUCCESS:
			return fetchTeamRoomsSuccess(state, action);
		case actionTypes.FETCH_TEAM_ROOMS_FAIL:
			return fetchTeamRoomsFail(state, action);

		case actionTypes.ADD_TEAM_ROOMS_START:
			return addTeamRoomsStart(state, action);
		case actionTypes.ADD_TEAM_ROOMS_SUCCESS:
			return addTeamRoomsSuccess(state, action);
		case actionTypes.ADD_TEAM_ROOMS_FAIL:
			return addTeamRoomsFail(state, action);

		case actionTypes.TEAM_ROOMS_RESET:
			return teamRoomReset(state, action);

		default:
			return teamRoomReset(state, action);
	}
};
