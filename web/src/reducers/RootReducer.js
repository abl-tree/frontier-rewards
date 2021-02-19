import {combineReducers} from "redux";
import ProductListReducer from "./ProductListReducer";
import AuthReducer from "./AuthReducer";

const RootReducer = combineReducers({
    Auth: AuthReducer,
    ProductList: ProductListReducer
});

export default RootReducer;