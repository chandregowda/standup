import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';

export const fetchTeamRoomsStart = () => {
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_START
	};
};
export const fetchTeamRoomsSuccess = (teamRooms) => {
	let options = [];
	teamRooms.forEach((room) => {
		options.push({ owner: room.owner, value: room.teamRoom, displayValue: room.displayName, id: room._id });
	});
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_SUCCESS,
		payload: { teamRooms: options }
	};
};
export const fetchTeamRoomsFail = (error) => {
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_FAIL,
		payload: error
	};
};
export const fetchTeamRooms = ({ owner, id }) => {
	return (dispatch) => {
		dispatch(fetchTeamRoomsStart());
		let queryList = [];
		if (id && id.trim()) {
			queryList.push(`id="${id}"`);
		}
		if (owner && owner.trim()) {
			queryList.push(`owner=${owner}`);
		}

		const token = localStorage.getItem('token');
		axios
			.post(`/teamRoom/get?${queryList.join('&')}`, { token })
			.then((response) => {
				// console.log(response.data);
				dispatch(fetchTeamRoomsSuccess(response.data));
			})
			.catch((e) => {
				console.log('Failed to get orders from firebase', e);
				dispatch(fetchTeamRoomsFail(e));
			});
	};
};
