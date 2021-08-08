import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import ProductList from './containers/ProductList';
import Product from './containers/Product';
import User from './containers/User';
import UserProfile from './containers/UserProfile';
import MyProfile from './containers/MyProfile';
import Notification from './containers/Notification';
import Setting from './containers/Setting';
import Package from './containers/Package';
import Action from './containers/Action';
import Campaign from './containers/Campaign';
import CampaignDetail from './containers/CampaignDetail';
import Reward from './containers/Reward';
import Transaction from './containers/Transaction';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import $ from 'jquery';
import { ProtectedRoute } from "./router/ProtectedRoute";
import { ProtectedLogin } from "./router/ProtectedLogin";
// import 'bootstrap/dist/js/bootstrap.bundle';
 
function App() {
    return (
        <Switch>
            <ProtectedLogin path={"/login"} exact component={Login}/>
            {/* <ProtectedRoute path={"/products"} exact component={ProductList}/> */}
            {/* <ProtectedRoute path={"/product/:product"} exact component={Product}/> */}
            <ProtectedRoute path={"/users"} exact component={User} allowed={[1,2]}/>
            <ProtectedRoute path={"/user/:user"} exact component={UserProfile} allowed={[1,2]}/>
            <ProtectedRoute path={"/profile"} exact component={MyProfile} allowed={[2,3]}/>
            <ProtectedRoute path={"/settings"} exact component={Setting} allowed={[1,2,3]}/>
            <ProtectedRoute path={"/notifications"} exact component={Notification} allowed={[1,2,3]}/>
            <ProtectedRoute path={"/packages"} exact component={Package} allowed={[1,2]}/>
            <ProtectedRoute path={"/actions"} exact component={Action} allowed={[1,2]}/>
            <ProtectedRoute path={"/rewards"} exact component={Reward} allowed={[1,2,3]}/>
            <ProtectedRoute path={"/transactions"} exact component={Transaction} allowed={[1,2,3]}/>
            <ProtectedRoute path={"/campaigns"} exact component={Campaign} allowed={[1,2,3]}/>
            <ProtectedRoute path={"/campaign/:campaign"} exact component={CampaignDetail}/>
            <ProtectedRoute path={"/"} exact component={Dashboard} allowed={[1,2,3]}/>

            {/* <Redirect to={"/"}/> */}
            <Route path="*" component={ () => "404 NOT FOUND" }/>
        </Switch>
    );
}

export default App;
