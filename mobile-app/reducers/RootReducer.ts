import {combineReducers} from "redux";
import ActionReducer from "./ActionReducer";
import AuthReducer from "./AuthReducer";
import PackageReducer from "./PackageReducer";
import RewardReducer from "./RewardReducer";
import TransactionReducer from "./TransactionReducer";
import UserReducer from "./UserReducer";

const RootReducer = combineReducers({
    Auth: AuthReducer,
    Action: ActionReducer,
    Package: PackageReducer,
    Reward: RewardReducer,
    Transaction: TransactionReducer,
    User: UserReducer
});

export default RootReducer;