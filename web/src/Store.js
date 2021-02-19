import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware} from "redux";
import thunk from "redux-thunk";
import RootReducer from "./reducers/RootReducer";

const myLogger = (store) => next => action => {

    // console.log("middleware run", store.getState());
    return next(action);

}

const Store = createStore(RootReducer, composeWithDevTools(applyMiddleware(myLogger, thunk)));

export default Store