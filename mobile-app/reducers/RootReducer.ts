import {combineReducers} from "redux";
import ActionReducer from "./ActionReducer";
import AuthReducer from "./AuthReducer";
import PackageReducer from "./PackageReducer";
import ProfileReducer from "./ProfleReducer";
import RewardReducer from "./RewardReducer";
import NotificationReducer from "./NotificationReducer";
import UserRewardReducer from "./UserRewardReducer";
import TransactionReducer from "./TransactionReducer";
import UserReducer from "./UserReducer";

const RootReducer = combineReducers({
    Auth: AuthReducer,
    Action: ActionReducer,
    Notification: NotificationReducer,
    Package: PackageReducer,
    Profile: ProfileReducer,
    Reward: RewardReducer,
    UserReward: UserRewardReducer,
    Transaction: TransactionReducer,
    User: UserReducer
});

export default RootReducer;