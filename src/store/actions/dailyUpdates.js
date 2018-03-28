import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates';

export const submitDailyUpdatesSuccess = (storedData, postData) => {
	return {
		type: actionTypes.SUBMIT_DAILY_UPDATES_SUCCESS,
		payload: { storedData: storedData, postData }
	};
};
export const submitDailyUpdatesFail = (e) => {
	return {
		type: actionTypes.SUBMIT_DAILY_UPDATES_FAIL,
		payload: { error: e }
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
		axios
			.post('/dailyUpdate/create?auth=' + token, postData)
			.then((response) => {
				console.log(response.data);
				dispatch(submitDailyUpdatesSuccess(response.data, postData));
				// this.props.history.push('/');
			})
			.catch((e) => {
				dispatch(submitDailyUpdatesFail(e));
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
export const fetchDailyUpdates = ({ token, userId, createdAt, team }) => {
	return (dispatch) => {
		dispatch(fetchDailyUpdatesStart());
		axios
			.post(`/dailyUpdate/get?createdAt=${createdAt}&team="${team}"&userId=${userId}`)
			.then((response) => {
				// console.log(response.data);
				let fetchedOrders = [];
				for (let key in response.data) {
					fetchedOrders.push({ ...response.data[key], id: key });
				}
				dispatch(fetchDailyUpdatesSuccess(fetchedOrders));
			})
			.catch((e) => {
				console.log('Failed to get orders from firebase', e);
				dispatch(fetchDailyUpdatesFail(e));
			});
	};
};
