import * as actionTypes from './actionTypes';
import axios from 'axios';

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
		dispatch(submitDailyUpdatesStart());
		axios
			.post('http://localhost:3000/dailyUpdates?auth=' + token, postData)
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
