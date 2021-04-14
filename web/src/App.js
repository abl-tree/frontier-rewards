import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import ProductList from './containers/ProductList';
import Product from './containers/Product';
import User from './containers/User';
import Package from './containers/Package';
import Action from './containers/Action';
import Campaign from './containers/Campaign';
import CampaignDetail from './containers/CampaignDetail';
import Reward from './containers/Reward';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import { ProtectedRoute } from "./router/ProtectedRoute";
import { ProtectedLogin } from "./router/ProtectedLogin";
 
function App() {
    return (
        <Switch>
            <ProtectedLogin path={"/login"} exact component={Login}/>
            {/* <ProtectedRoute path={"/products"} exact component={ProductList}/> */}
            {/* <ProtectedRoute path={"/product/:product"} exact component={Product}/> */}
            <ProtectedRoute path={"/users"} exact component={User}/>
            <ProtectedRoute path={"/packages"} exact component={Package}/>
            <ProtectedRoute path={"/actions"} exact component={Action}/>
            <ProtectedRoute path={"/rewards"} exact component={Reward}/>
            <ProtectedRoute path={"/campaigns"} exact component={Campaign}/>
            <ProtectedRoute path={"/campaign/:campaign"} exact component={CampaignDetail}/>
            <ProtectedRoute
                exact
                path={"/"}
                component={Dashboard}
            />

            {/* <Redirect to={"/"}/> */}
            <Route path="*" component={ () => "404 NOT FOUND" }/>
        </Switch>
    );
}

export default App;
