import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/indexReducer';

const store = configureStore({ 
    reducer: rootReducer, 
});
  
  export default store;