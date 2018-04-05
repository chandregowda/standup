import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';

export const userReset = () => {
	return {
		type: actionTypes.USERS_RESET
	};
};
export const fetchUsersStart = () => {
	return {
		type: actionTypes.FETCH_USERS_START
	};
};
export const fetchUsersSuccess = (users) => {
	let usersMap = {};
	users.forEach((user) => {
		usersMap[user.accountName] = user.displayName;
	});
	return {
		type: actionTypes.FETCH_USERS_SUCCESS,
		payload: { users, usersMap }
	};
};
export const fetchUsersFail = (error) => {
	return {
		type: actionTypes.FETCH_USERS_FAIL,
		payload: error
	};
};

export const fetchUsers = ({ accountName = null, id = null }) => {
	return (dispatch) => {
		dispatch(fetchUsersStart());
		let queryList = [];
		if (id && id.trim()) {
			queryList.push(`id="${id}"`);
		}
		if (accountName && accountName.trim()) {
			queryList.push(`accountName=${accountName}`);
		}

		const token = localStorage.getItem('token');
		axios
			.post(`/user/get?${queryList.join('&')}`, { token })
			.then((response) => {
				// console.log(response.data);
				dispatch(fetchUsersSuccess(response.data));
			})
			.catch((e) => {
				console.log('Failed to get user details from database', e);
				dispatch(fetchUsersFail(e));
			});
	};
};

export const deleteUsersStart = () => {
	return {
		type: actionTypes.DELETE_USERS_START
	};
};

export const deleteUsersSuccess = (data) => {
	return {
		type: actionTypes.DELETE_USERS_SUCCESS,
		payload: data
	};
};

export const deleteUsersFail = (error) => {
	return {
		type: actionTypes.DELETE_USERS_FAIL,
		payload: error
	};
};

export const deleteUsers = (id) => {
	return (dispatch) => {
		dispatch(deleteUsersStart());
		const token = localStorage.getItem('token');
		const owner = localStorage.getItem('accountName');
		axios
			.post(`/user/delete?id=${id}&owner=${owner}`, { token })
			.then((response) => {
				dispatch(deleteUsersSuccess(response.data));
				dispatch(fetchUsers({}));
			})
			.catch((e) => {
				console.log('Failed to delete team room from db', e);
				dispatch(deleteUsersFail(e));
			});
	};
};

export const addUsersStart = () => {
	return {
		type: actionTypes.ADD_USERS_START
	};
};
export const addUsersSuccess = () => {
	return {
		type: actionTypes.ADD_USERS_SUCCESS,
		payload: { message: 'Success' }
	};
};
export const addUsersFail = (error) => {
	return {
		type: actionTypes.ADD_USERS_FAIL,
		payload: { error }
	};
};
export const addUsers = (data) => {
	return (dispatch) => {
		dispatch(addUsersStart());
		const token = localStorage.getItem('token');
		const owner = localStorage.getItem('accountName');
		const ownerName = localStorage.getItem('displayName');
		data.owner = owner;
		data.ownerName = ownerName;

		// console.log(data);
		axios({
			method: 'post',
			url: `/user/create?token=${token}`,
			data: {
				data: { ...data }
			},
			validateStatus: (status) => {
				return true; // I'm always returning true, you may want to do it depending on the status received
			}
		})
			.catch((e) => {
				dispatch(addUsersFail(e));
			})
			.then((response) => {
				// console.log('Now we have response..');
				// console.log(response);
				if (response && response.status >= 400) {
					dispatch(addUsersFail(response.data));
				} else if (response) {
					dispatch(addUsersSuccess());
					dispatch(fetchUsers({}));
				}
			});

		// axios
		// 	.post(`/user/create`, { token, data })
		// 	.then((response) => {
		// 		dispatch(addUsersSuccess());
		// 		dispatch(fetchUsers({}));
		// 	})
		// 	.catch((e) => {
		// 		console.log('Failed to add team room from db', e);
		// 		dispatch(addUsersFail(e));
		// 	});
	};
};
