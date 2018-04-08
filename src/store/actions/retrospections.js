import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';
import moment from 'moment';

export const retrospectionsReset = () => {
	return {
		type: actionTypes.RETROSPECTION_RESET
	};
};
export const submitRetrospectionsSuccess = (storedData, postData) => {
	return {
		type: actionTypes.SUBMIT_RETROSPECTION_SUCCESS,
		payload: { storedData: storedData, postData, message: 'Successfully Added' }
	};
};
export const submitRetrospectionsFail = (message) => {
	return {
		type: actionTypes.SUBMIT_RETROSPECTION_FAIL,
		payload: { error: { message } }
	};
};
export const submitRetrospectionsStart = () => {
	return {
		type: actionTypes.SUBMIT_RETROSPECTION_START
	};
};
export const submitRetrospections = (postData, token) => {
	return (dispatch) => {
		dispatch(submitRetrospectionsStart());

		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			function(error) {
				// console.log('IN INTERCEPTOR');
				if (!error.response) {
					console.log('No error.response');
					console.log(error);
				} else if (error.response.status && error.response.status > 400) {
					console.log('Error Response code:', error.response.status);
					console.log(error.response);
				}
				return Promise.reject(error.response || error);
			}
		);
		axios
			.post('/retrospection/create?token=' + token, { data: postData })
			.then((response) => {
				dispatch(submitRetrospectionsSuccess(response.data, postData));
				// this.props.history.push('/');
			})
			.catch((e) => {
				let message =
					e.data && e.data.error && e.data.error.message
						? e.data.error.message
						: e.data && e.data.errmsg && e.data.errmsg.indexOf('E11000 duplicate key') !== -1
							? `You have already provided updates for '${moment
									.unix(postData.createdAt / 1000)
									.format('MMMM Do YYYY')}' against current team !`
							: e.data.errmsg || 'Some error during saving';
				dispatch(submitRetrospectionsFail(message));
			});
	};
};

export const fetchRetrospectionsStart = () => {
	return {
		type: actionTypes.FETCH_RETROSPECTION_START
	};
};
export const fetchRetrospectionsSuccess = (retrospections) => {
	return {
		type: actionTypes.FETCH_RETROSPECTION_SUCCESS,
		payload: { retrospections }
	};
};
export const fetchRetrospectionsFail = (error) => {
	return {
		type: actionTypes.FETCH_RETROSPECTION_FAIL,
		payload: error
	};
};
export const fetchRetrospections = ({
	token,
	accountName = null,
	createdAt = null,
	team = null,
	startDate,
	endDate
}) => {
	return (dispatch) => {
		dispatch(fetchRetrospectionsStart());
		let queryList = [];
		if (team && team.trim()) {
			queryList.push(`team="${team}"`);
		}
		if (accountName && accountName.trim()) {
			queryList.push(`accountName=${accountName}`);
		}

		if (startDate && endDate) {
			if (typeof startDate === 'object') {
				startDate = startDate.format('x');
			}
			if (typeof endDate === 'object') {
				endDate = endDate.format('x');
			}
			if (startDate && parseInt(startDate, 10)) {
				queryList.push(`startDate=${startDate}`);
			}
			if (endDate && parseInt(endDate, 10)) {
				queryList.push(`endDate=${endDate}`);
			}
		} else if (createdAt && parseInt(createdAt, 10)) {
			queryList.push(`createdAt=${createdAt}`);
		}

		const token = localStorage.getItem('token');
		axios
			.post(`/retrospection/get?${queryList.join('&')}`, { token })
			.then((response) => {
				// console.log(response.data);
				let fetchedOrders = [];
				for (let key in response.data) {
					fetchedOrders.push({ ...response.data[key], id: key });
				}
				dispatch(fetchRetrospectionsSuccess(fetchedOrders));
			})
			.catch((e) => {
				console.log('Failed to get retrospections from db', e);
				dispatch(fetchRetrospectionsFail(e));
			});
	};
};

export const deleteRetrospectionsStart = () => {
	return {
		type: actionTypes.DELETE_RETROSPECTION_START
	};
};

export const deleteRetrospectionsSuccess = (data) => {
	return {
		type: actionTypes.DELETE_RETROSPECTION_SUCCESS,
		payload: data
	};
};

export const deleteRetrospectionsFail = (error) => {
	return {
		type: actionTypes.DELETE_RETROSPECTION_FAIL,
		payload: error
	};
};

export const deleteRetrospection = ({
	id,
	startDate = +moment().startOf('week'),
	endDate = +moment().endOf('week'),
	accountName = localStorage.getItem('accountName')
}) => {
	return (dispatch) => {
		dispatch(deleteRetrospectionsStart());
		const token = localStorage.getItem('token');
		const accountName = localStorage.getItem('accountName');
		axios
			.post(`/retrospection/delete?id=${id}&accountName=${accountName}`, { token })
			.then((response) => {
				dispatch(deleteRetrospectionsSuccess(response.data));
				dispatch(fetchRetrospections({ id, startDate, endDate })); // dont want to filter by user at this moment, so passing null
			})
			.catch((e) => {
				console.log('Failed to delete retrospection from db', e);
				dispatch(deleteRetrospectionsFail(e));
			});
	};
};

// export const deleteRetrospectionsStart = () => {
// 	return {
// 		type: actionTypes.DELETE_RETROSPECTION_START
// 	};
// };

// export const deleteRetrospectionsSuccess = (data) => {
// 	return {
// 		type: actionTypes.DELETE_RETROSPECTION_SUCCESS,
// 		payload: data
// 	};
// };

// export const deleteRetrospectionsFail = (error) => {
// 	return {
// 		type: actionTypes.DELETE_RETROSPECTION_FAIL,
// 		payload: error
// 	};
// };

// export const deleteRetrospection = (id) => {
// 	return (dispatch) => {
// 		dispatch(deleteRetrospectionsStart());
// 		const token = localStorage.getItem('token');
// 		const owner = localStorage.getItem('accountName');
// 		axios
// 			.post(`/teamRoom/delete?id=${id}&owner=${owner}`, { token })
// 			.then((response) => {
// 				dispatch(deleteRetrospectionsSuccess(response.data));
// 				dispatch(fetchRetrospections({}));
// 			})
// 			.catch((e) => {
// 				console.log('Failed to delete team room from db', e);
// 				dispatch(deleteRetrospectionsFail(e));
// 			});
// 	};
// };
