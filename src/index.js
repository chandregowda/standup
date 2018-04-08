import React from 'react';
import ReactDOM from 'react-dom';
import './index.vendor.css?raw';

import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import dailyUpdatesReducer from './store/reducers/dailyUpdates';
import retrospectionsReducer from './store/reducers/retrospections';
import teamRoomsReducer from './store/reducers/teamRooms';
import usersReducer from './store/reducers/users';
import authReducer from './store/reducers/auth';
import filtersReducer from './store/reducers/filters';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// Multiple reducers are mapped here
const rootReducer = combineReducers({
	dailyUpdates: dailyUpdatesReducer,
	retrospections: retrospectionsReducer,
	auth: authReducer,
	teamRooms: teamRoomsReducer,
	users: usersReducer,
	filters: filtersReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
const app = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
