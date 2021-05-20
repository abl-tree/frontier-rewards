import {combineReducers} from "redux";
import ActionReducer from "./ActionReducer";
import AuthReducer from "./AuthReducer";
import PackageReducer from "./PackageReducer";
import RewardReducer from "./RewardReducer";

const RootReducer = combineReducers({
    Auth: AuthReducer,
    Action: ActionReducer,
    Package: PackageReducer,
    Reward: RewardReducer
});

export default RootReducer;