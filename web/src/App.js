import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import ProductList from './containers/ProductList';
import Product from './containers/Product';
import User from './containers/User';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from "react-bootstrap";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { ProtectedLogin } from "./router/ProtectedLogin";
 
function App() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Switch>
                    {/* <Route path={"/"} exact component={Dashboard}/> */}
                    <ProtectedLogin path={"/login"} exact component={Login}/>
                    <ProtectedRoute path={"/products"} exact component={ProductList}/>
                    <ProtectedRoute path={"/product/:product"} exact component={Product}/>
                    <ProtectedRoute path={"/users"} exact component={User}/>
                    <ProtectedRoute
                        exact
                        path={"/"}
                        component={Dashboard}
                    />
                    {/* <Redirect to={"/"}/> */}
                    <Route path="*" component={ () => "404 NOT FOUND" }/>
                </Switch>
            </Row>
        </Container>
    );
}

export default App;
