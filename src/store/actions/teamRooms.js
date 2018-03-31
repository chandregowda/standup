import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';

export const teamRoomReset = () => {
	return {
		type: actionTypes.TEAM_ROOMS_RESET
	};
};
export const fetchTeamRoomsStart = () => {
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_START
	};
};
export const fetchTeamRoomsSuccess = (teamRooms) => {
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_SUCCESS,
		payload: { teamRooms }
	};
};
export const fetchTeamRoomsFail = (error) => {
	return {
		type: actionTypes.FETCH_TEAM_ROOMS_FAIL,
		payload: error
	};
};

export const fetchTeamRooms = ({ owner = null, id = null }) => {
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
				console.log('Failed to get team rooms from database', e);
				dispatch(fetchTeamRoomsFail(e));
			});
	};
};

export const deleteTeamRoomStart = () => {
	return {
		type: actionTypes.DELETE_TEAM_ROOMS_START
	};
};

export const deleteTeamRoomSuccess = (data) => {
	return {
		type: actionTypes.DELETE_TEAM_ROOMS_SUCCESS,
		payload: data
	};
};

export const deleteTeamRoomFail = (error) => {
	return {
		type: actionTypes.DELETE_TEAM_ROOMS_FAIL,
		payload: error
	};
};

export const deleteTeamRoom = (id) => {
	return (dispatch) => {
		dispatch(deleteTeamRoomStart());
		const token = localStorage.getItem('token');
		const owner = localStorage.getItem('accountName');
		axios
			.post(`/teamRoom/delete?id=${id}&owner=${owner}`, { token })
			.then((response) => {
				dispatch(deleteTeamRoomSuccess(response.data));
				dispatch(fetchTeamRooms({}));
			})
			.catch((e) => {
				console.log('Failed to delete team room from db', e);
				dispatch(deleteTeamRoomFail(e));
			});
	};
};

export const addTeamRoomStart = () => {
	return {
		type: actionTypes.ADD_TEAM_ROOMS_START
	};
};
export const addTeamRoomSuccess = () => {
	return {
		type: actionTypes.ADD_TEAM_ROOMS_SUCCESS,
		payload: { message: 'Success' }
	};
};
export const addTeamRoomFail = (error) => {
	return {
		type: actionTypes.ADD_TEAM_ROOMS_FAIL,
		payload: { error }
	};
};
export const addTeamRoom = (data) => {
	return (dispatch) => {
		dispatch(addTeamRoomStart());
		const token = localStorage.getItem('token');
		const owner = localStorage.getItem('accountName');
		const ownerName = localStorage.getItem('displayName');
		data.owner = owner;
		data.ownerName = ownerName;

		// console.log(data);
		axios({
			method: 'post',
			url: `/teamRoom/create?token=${token}`,
			data: {
				data: { ...data }
			},
			validateStatus: (status) => {
				return true; // I'm always returning true, you may want to do it depending on the status received
			}
		})
			.catch((e) => {
				dispatch(addTeamRoomFail(e));
			})
			.then((response) => {
				// console.log('Now we have response..');
				// console.log(response);
				if (response && response.status >= 400) {
					dispatch(addTeamRoomFail(response.data));
				} else if (response) {
					dispatch(addTeamRoomSuccess());
					dispatch(fetchTeamRooms({}));
				}
			});

		// axios
		// 	.post(`/teamRoom/create`, { token, data })
		// 	.then((response) => {
		// 		dispatch(addTeamRoomSuccess());
		// 		dispatch(fetchTeamRooms({}));
		// 	})
		// 	.catch((e) => {
		// 		console.log('Failed to add team room from db', e);
		// 		dispatch(addTeamRoomFail(e));
		// 	});
	};
};
