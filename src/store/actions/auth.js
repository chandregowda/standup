import * as actionTypes from './actionTypes';
import axios from '../../axios-dailyUpdates'; // URL is different, so use new one

const setLocalStorage = ({ token, expiryDate, accountName, displayName }) => {
	localStorage.setItem('token', token);
	localStorage.setItem('expiryDate', expiryDate);
	localStorage.setItem('accountName', accountName);
	localStorage.setItem('displayName', displayName);
};

const clearLocalStorage = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expiryDate');
	localStorage.removeItem('accountName');
	localStorage.removeItem('displayName');
};

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (authData) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		payload: { token: authData.token, accountName: authData.accountName, displayName: authData.displayName }
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		payload: { error }
	};
};

export const authLogout = () => {
	clearLocalStorage();
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const checkAuthTimeout = (timeOut = 3600) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(authLogout());
		}, timeOut * 1000);
	};
};

export const auth = (email, password, isSignIn) => {
	return (dispatch) => {
		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			function(error) {
				if (!error.response) {
					console.log(error);
					return Promise.reject(error);
				} else if (!error.response.data) {
					error.response.data = { error: { message: `ERROR: Status ${error.response.status}` } };
					return Promise.reject(error);
				}

				// Do something with response error
				if (error.response.status === 404) {
					error.response.data.error.message = 'Authenitcation Server down';
					dispatch(authFail(error.response.data.error));
					// router.replace('/auth/login');
				}
				return Promise.reject(error);
			}
		);

		dispatch(authStart());

		// Call Server Authentication and dispatch

		/** Dummy Login */
		// setTimeout(() => {
		// 	const token = 'RANDOM_ID_12321312312312';
		// 	const expiresIn = 3600;
		// 	const accountName = 1476;
		// 	const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);

		// 	setLocalStorage({ token, expiryDate, accountName });
		// 	dispatch(authSuccess({ token, expiryDate, accountName }));
		// 	dispatch(checkAuthTimeout(expiresIn));
		// }, 1000);

		const validEmail = email.trim().replace(/@.*/, '') + '@yodlee.com'; // Allow only Yodlee email

		// const validEmail = /@yodlee.com$/i.test(email) ? email : `${email}@yodlee.com`;

		const authData = {
			email: validEmail,
			password
		};

		let hostURL = '/login';
		axios
			.post(hostURL, authData)
			.then((response) => {
				// console.log('Successful Sign in/up');
				// console.log(response.data);
				const data = response.data;
				if (data.message && data.message === 'LOGIN_SUCCESSFUL') {
					const expiresIn = data.expiresIn || 3600; // 1 hour
					const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);

					const token = data.token;
					const accountName = data.details.sAMAccountName || data.details.mail.replace(/@.*$/, '');
					const displayName = data.details.displayName;

					setLocalStorage({ token, expiryDate, accountName, displayName });

					dispatch(authSuccess({ token, accountName, displayName }));
					dispatch(checkAuthTimeout(expiresIn));
				} else {
					// console.log('Failed to login');
					// console.log(response.data.error);
					dispatch(authFail(response.data.error));
				}
			})
			.catch((e) => {
				console.log('Authentication failed with error', e);
				console.log(e);
				let error =
					e.response && e.response.data ? e.response.data.error : { message: 'Internal Server Error' };
				dispatch(authFail(error));
			});

		// let URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';
		// if (!isSignIn) {
		// 	URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=';
		// }
		// const API_KEY = 'AIzaSyC808_oQUFgBM_SM9XKU-81ncTM5rvuxlE';
		// const hostURL = URL + API_KEY;
		// axios
		// 	.post(hostURL, authData)
		// 	.then((response) => {
		// 		// console.log('Successful Sign in/up');
		// 		// console.log(response.data);

		// 		const expiryDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);

		// 		localStorage.setItem('token', response.data.idToken);
		// 		localStorage.setItem('expiryDate', expiryDate);
		// 		localStorage.setItem('accountName', response.data.localId);
		// 		dispatch(authSuccess(response.data));
		// 		dispatch(checkAuthTimeout(response.data.expiresIn));
		// 	})
		// 	.catch((e) => {
		// 		console.log('Authentication failed with error');
		// 		console.log(e.response.data);
		// 		dispatch(authFail(e.response.data.error));
		// 	});
	};
};

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(authLogout());
		} else {
			const expiryDate = new Date(localStorage.getItem('expiryDate'));
			if (expiryDate < new Date()) {
				dispatch(authLogout());
			} else {
				const accountName = localStorage.getItem('accountName');
				const displayName = localStorage.getItem('displayName');
				dispatch(authSuccess({ token: token, accountName: accountName, displayName: displayName }));
				const remainingTime = (expiryDate.getTime() - new Date().getTime()) / 1000;
				// console.log('Number of seconds remaining is: ', remainingTime);
				dispatch(checkAuthTimeout(remainingTime));
			}
		}
	};
};
