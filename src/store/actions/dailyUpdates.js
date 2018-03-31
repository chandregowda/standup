import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';
import moment from 'moment';

export const submitDailyUpdatesSuccess = (storedData, postData) => {
	return {
		type: actionTypes.SUBMIT_DAILY_UPDATES_SUCCESS,
		payload: { storedData: storedData, postData, message: 'Successfully Added' }
	};
};
export const submitDailyUpdatesFail = (message) => {
	return {
		type: actionTypes.SUBMIT_DAILY_UPDATES_FAIL,
		payload: { error: { message } }
	};
};
export const submitDailyUpdatesStart = () => {
	return {
		type: actionTypes.SUBMIT_DAILY_UPDATES_START
	};
};
export const submitDailyUpdates = (postData, token) => {
	return (dispatch) => {
		// console.log('Submitting daily update with ');
		// console.log(postData);

		dispatch(submitDailyUpdatesStart());

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
			.post('/dailyUpdate/create?token=' + token, postData)
			.then((response) => {
				dispatch(submitDailyUpdatesSuccess(response.data, postData));
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
				dispatch(submitDailyUpdatesFail(message));
			});
	};
};

export const fetchDailyUpdatesStart = () => {
	return {
		type: actionTypes.FETCH_DAILY_UPDATES_START
	};
};
export const fetchDailyUpdatesSuccess = (dailyUpdates) => {
	return {
		type: actionTypes.FETCH_DAILY_UPDATES_SUCCESS,
		payload: { dailyUpdates }
	};
};
export const fetchDailyUpdatesFail = (error) => {
	return {
		type: actionTypes.FETCH_DAILY_UPDATES_FAIL,
		payload: error
	};
};
export const fetchDailyUpdates = ({ token, accountName, createdAt, team }) => {
	return (dispatch) => {
		dispatch(fetchDailyUpdatesStart());
		let queryList = [];
		if (team && team.trim()) {
			queryList.push(`team="${team}"`);
		}
		if (accountName && accountName.trim()) {
			queryList.push(`accountName=${accountName}`);
		}
		if (createdAt && parseInt(createdAt, 10)) {
			queryList.push(`createdAt=${createdAt}`);
		}
		const token = localStorage.getItem('token');
		axios
			.post(`/dailyUpdate/get?${queryList.join('&')}`, { token })
			.then((response) => {
				// console.log(response.data);
				let fetchedOrders = [];
				for (let key in response.data) {
					fetchedOrders.push({ ...response.data[key], id: key });
				}
				dispatch(fetchDailyUpdatesSuccess(fetchedOrders));
			})
			.catch((e) => {
				console.log('Failed to get daily updates from db', e);
				dispatch(fetchDailyUpdatesFail(e));
			});
	};
};
