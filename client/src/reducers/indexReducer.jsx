import {combineReducers } from 'redux';
import authReducer from './loginReducer';

const rootReducer=combineReducers({
     auth:authReducer,
})

export default rootReducer;