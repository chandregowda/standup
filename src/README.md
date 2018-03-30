Steps to Add new store / reducer, Example new TeamRoom actions has be handled.
Below steps explains how to add new TeamRoom functionalities in RedUx concept

1. Create Actions mapping in store/actions/actionTypes.js
        export const FETCH_TEAM_ROOM_SUCCESS = 'FETCH_TEAM_ROOM_SUCCESS';
        export const FETCH_TEAM_ROOM_FAIL = 'FETCH_TEAM_ROOM_FAIL';
        export const FETCH_TEAM_ROOM_START = 'FETCH_TEAM_ROOM_START';

2. Create Action Creators (who triggers) in store/actions/teamRoom.js
        export const fetchTeamRoomsStart = () => {
          return {
            type: actionTypes.FETCH_TEAM_ROOM_START
          };
        };
        export const fetchTeamRoomsSuccess = (teamRooms) => {
          return {
            type: actionTypes.FETCH_TEAM_ROOM_SUCCESS,
            payload: { teamRooms }
          };
        };
        export const fetchTeamRoomsFail = (error) => {
          return {
            type: actionTypes.FETCH_TEAM_ROOM_FAIL,
            payload: error
          };
        };
        export const fetchTeamRooms = ({ token, owner, id }) => {
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
                console.log(response.data);
                dispatch(fetchTeamRoomsSuccess(response.data));
              })
              .catch((e) => {
                console.log('Failed to get orders from firebase', e);
                dispatch(fetchTeamRoomsFail(e));
              });
          };
        };

3. Add entry in store/index.js
        export { submitTeamRoomUpdates, fetchTeamRooms } from './teamRooms';

4. Create Reducer who's purpose is to maintain States related to teamRoom and updating the State values based on ACTION dispatched from action creators.
In fine store/reducers/teamRooms.js add below content:
        import * as actionTypes from '../actions/actionTypes';
        import updateObject from '../utility';

        const INITIAL_STATE = {
          teamRooms: [],
          loading: false,
          error: false,
          message: ''
        };

        const fetchTeamRoomsStart = (state, action) => {
          return updateObject(state, { error: false, loading: true });
        };
        const fetchTeamRoomsSuccess = (state, action) => {
          return updateObject(state, { teamRooms: action.payload.teamRooms, loading: false });
        };
        const fetchTeamRoomsFail = (state, action) => {
          return updateObject(state, { loading: false, error: action.payload.error });
        };

        const submitTeamRoomsStart = (state, action) => {
          return updateObject(state, { error: false, loading: true, message: '' });
        };
        const submitTeamRoomsSuccess = (state, action) => {
          return updateObject(state, { loading: false, message: action.payload.message });
        };
        const submitTeamRoomsFail = (state, action) => {
          return updateObject(state, { loading: false, error: action.payload.error });
        };

        export default (state = INITIAL_STATE, action) => {
          switch (action.type) {
            case actionTypes.FETCH_TEAM_ROOMS_START:
              return fetchTeamRoomsStart(state, action);
            case actionTypes.FETCH_TEAM_ROOMS_SUCCESS:
              return fetchTeamRoomsSuccess(state, action);
            case actionTypes.FETCH_TEAM_ROOMS_FAIL:
              return fetchTeamRoomsFail(state, action);

            case actionTypes.SUBMIT_TEAM_ROOMS_START:
              return submitTeamRoomsStart(state, action);
            case actionTypes.SUBMIT_TEAM_ROOMS_SUCCESS:
              return submitTeamRoomsSuccess(state, action);
            case actionTypes.SUBMIT_TEAM_ROOMS_FAIL:
              return submitTeamRoomsFail(state, action);

            default:
              return state;
          }
        };

5. During Store creation in application index.js we need to use the newly created store
        import { BrowserRouter } from 'react-router-dom';
        import { Provider } from 'react-redux';
        import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
        import thunk from 'redux-thunk';

        import teamRoomsReducer from './store/reducers/teamRooms';
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

        // Multiple reducers are mapped here
        const rootReducer = combineReducers({
          teamRooms: teamRoomsReducer
        });
        const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

6. Pass the store as pops to Producer
        const app = (
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        );
7. Now in one of the Containers (class) componentDidMount function trigger the load action for initial state (if required)
  Ex TeamRooms should be loaded to show in DailyUpdates or Reports page. In any or both of the model container trigger the action.
  7.a You need to map the teamRoom store state to props, that is named as in index.js of application during store creation
  Ex: containers/DailyUpdates/DailyUpdates.js
          const mapStateToProps = (state) => {
            return {
              teamRooms: state.teamRooms.teamRooms,
            }
          }
  7.b You need to map the dispatch action to trigger initial load
          const mapDispatchToProps = (dispatch) => {
            return {
              onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id }))
            };
          };
          export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(DailyUpdates, axios));
  7.c Call the function mapped to load the initial teamRooms
          componentDidMount() {
            this.props.onTeamRoomsFetch();
          }
