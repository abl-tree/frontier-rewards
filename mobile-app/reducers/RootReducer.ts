import {combineReducers} from "redux";
import ActionReducer from "./ActionReducer";
import AuthReducer from "./AuthReducer";
import RewardReducer from "./RewardReducer";
const RootReducer = combineReducers({
    Auth: AuthReducer,
    Action: ActionReducer,
    Reward: RewardReducer
});

export default RootReducer;