import {createStore} from "redux";
import {applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import RootReducer from "./reducers/RootReducer";

// const myLogger = (store) => next => action => {

//     // console.log("middleware run", store.getState());
//     return next(action);

// }

const Store = createStore(RootReducer, applyMiddleware(thunk));
// const Store = createStore(RootReducer);

export default Store