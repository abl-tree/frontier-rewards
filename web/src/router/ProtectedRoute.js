import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import _ from "lodash";
import axios from "axios";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    
    const auth = useSelector(state => state.Auth);

    if(!_.isEmpty(auth.user)) axios.defaults.headers['Authorization'] = "Bearer " + auth.user.token;

    return (
        <Route
            {...rest}
            render = { props => {
                if(!_.isEmpty(auth.user)) {

                    const onLogout = (e) => {
                        localStorage.removeItem('user');
                
                        auth.user = null
                
                        props.history.push("/login");
                    }

                    return (

                        <>
                            <Navbar collapseOnSelect expand="*" bg="dark" variant="dark">
                                <Navbar.Brand className="col-sm-3 col-md-2 mr-0 px-3" href="#home">
                                <img
                                    alt=""
                                    src="/logo.svg"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />
                                React Bootstrap
                                </Navbar.Brand>

                                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <ul className="navbar-nav px-3">
                                    <li className="nav-item text-nowrap">
                                        <Link className="nav-link" onClick={ e => onLogout() }>Logout</Link>
                                    </li>
                                </ul>
                            </Navbar>
                            <Container fluid>
                                <div className="row">
                                    <Navbar.Collapse id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                                        <div className="sidebar-sticky pt-3">
                                            <ul className="nav flex-column">
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                        Dashboard <span className="sr-only">(current)</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/actions">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                        Actions
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/packages">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                        Packages
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/rewards">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                        Rewards
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/campaigns">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                        Campaigns
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                    Customers
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                                    Transactions
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </Navbar.Collapse>

                                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                                            <Component { ...props }/>
                                    </main>
                                </div>
                            </Container>
                        </>
                        
                    )

                } else {

                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    } />

                }
            }}
        />
    );
};