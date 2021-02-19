import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import ProductList from './containers/ProductList';
import Product from './containers/Product';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from "react-bootstrap";
 
function App() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Switch>
                    <Route path={"/"} exact component={Dashboard}/>
                    <Route path={"/login"} exact component={Login}/>
                    <Route path={"/products"} exact component={ProductList}/>
                    <Route path={"/product/:product"} exact component={Product}/>
                    <Redirect to={"/"}/>
                </Switch>
            </Row>
        </Container>
    );
}

export default App;
