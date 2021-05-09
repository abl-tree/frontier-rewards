import {combineReducers} from "redux";
import ProductListReducer from "./ProductListReducer";
import ActionReducer from "./ActionReducer";
import AuthReducer from "./AuthReducer";
import CampaignReducer from "./CampaignReducer";
import PackageReducer from "./PackageReducer";
import RewardReducer from "./RewardReducer";
import TransactionReducer from "./TransactionReducer";
import UserReducer from "./UserReducer";

const RootReducer = combineReducers({
    Action: ActionReducer,
    Auth: AuthReducer,
    Campaign: CampaignReducer,
    Package: PackageReducer,
    ProductList: ProductListReducer,
    Reward: RewardReducer,
    Transaction: TransactionReducer,
    User: UserReducer
});

export default RootReducer;