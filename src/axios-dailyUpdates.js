import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://localhost:3100'
	// baseURL: 'https://rti.corp.yodlee.com'
});

axios.interceptors.response.use(
	(response) => {
		return response;
	},
	function(error) {
		// Do something with response error
		if (error.response.status === 401) {
			console.log('Unauthorized...');
			// auth.logout();
			// router.replace('/auth/login');
		}
		return Promise.reject(error.response);
	}
);

export default instance;
