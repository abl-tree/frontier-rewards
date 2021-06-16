import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import _ from "lodash";
import axios from "axios";
import { Logout } from "../actions/userAction";
import { config } from '../utils/Constants';
import Pusher from "pusher-js"
import Echo from 'laravel-echo';
import {SuperAdminHeader, SuperAdminSidebar} from "../components/SuperAdminLayout"
import {AdminHeader, AdminSidebar} from "../components/AdminLayout"
import {CustomerHeader, CustomerSidebar} from "../components/CustomerLayout"
import '../css/style.css'
import moment from 'moment-timezone';
moment.tz.setDefault(moment.tz.guess(true));

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);

    if(!_.isEmpty(auth.user)){
        axios.defaults.headers['Authorization'] = "Bearer " + auth.user.token;

        // axios.defaults.headers['X-Socket-Id'] = "Bearer " + auth.user.token;

        const initEchoB = () => { // own websockets

            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: 'FRPUSHERKEY',
                wsHost: config.url.BROADCAST_URL,
                wsPort: 6001,
                disableStats: true,
                forceTLS: false,
                authorizer: (channel, options) => {
                    return {
                        authorize: (socketId, callback) => {
    
                            axios.post('/broadcasting/auth', {
                                socket_id: socketId,
                                channel_name: channel.name
                            })
                            .then(response => {
                                axios.defaults.headers['X-Socket-ID'] = socketId
                                callback(false, response.data);
                            })
                            .catch(error => {
                                callback(true, error);
                            });
                        }
                    };
                },
            });
            
            window.Echo.private(`notification`)
            .listen('UserRegistered', (e) => {
                console.log('channel', e);
            });
        }

        const initEcho = () => {

            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: '658ad8bb2f982c7fa645',
                cluster: 'ap1',
                wsHost: config.url.BROADCAST_URL,
                wsPort: 6001,
                forceTLS: true,
                authorizer: (channel, options) => {
                    return {
                        authorize: (socketId, callback) => {
    
                            axios.post('/broadcasting/auth', {
                                socket_id: socketId,
                                channel_name: channel.name
                            })
                            .then(response => {
                                axios.defaults.headers['X-Socket-ID'] = socketId
                                callback(false, response.data);
                            })
                            .catch(error => {
                                callback(true, error);
                            });
                        }
                    };
                },
                // wsHost: config.url.BROADCAST_URL,
                // wsPort: 6001,
                //authEndpoint is your apiUrl + /broadcasting/auth
                // authEndpoint: config.url.API_URL + '/broadcasting/auth', 
                // As I'm using JWT tokens, I need to manually set up the headers.
                auth: {
                  headers: {
                    Authorization: `Bearer ${auth.user.token}`,
                    Accept: 'application/json',
                  },
                },
            });
            
            window.Echo.private(`notification`)
            .listen('UserRegistered', (e) => {
                console.log('channel', e);
            });
        }

        initEcho();
    }

    return (
        <Route
            {...rest}
            render = { props => {

                if(!_.isEmpty(auth.user)) {

                    const onLogout = (e) => {
                        
                        dispatch(Logout(props));
                
                        props.history.push("/login");
                    }

                    if(_.indexOf(rest.allowed, auth.user.type) == -1) {
    
                        return (
    
                            <>Not Allowed</>
                            
                        )
    
                    }

                    if(auth.user.type == 1) {

                        return (
    
                            <div className="superadmin-page">
                                <SuperAdminHeader onLogout={onLogout}/>
                                <Container fluid>
                                    <div className="row">
                                        <SuperAdminSidebar/>
                                        <main role="main" className="col-md-8 col-lg-9 ml-sm-auto px-md-4">
                                            <Component { ...props }/>
                                        </main>
                                    </div>
                                </Container>
                            </div>
                            
                        )

                    } else if(auth.user.type == 2) {

                        return (
    
                            <div className="admin-page">
                                <AdminHeader onLogout={onLogout}/>
                                <Container fluid>
                                    <div className="row">
                                        <AdminSidebar/>
                                        <main role="main" className="col-md-8 col-lg-9 ml-sm-auto px-md-4">
                                            <Component { ...props }/>
                                        </main>
                                    </div>
                                </Container>
                            </div>
                            
                        )

                    } else {

                        return (
                            <div className="customer-page">
                                <CustomerHeader onLogout={onLogout}/>
                                <Container fluid>
                                    <div className="row">
                                        <CustomerSidebar userid={auth.user.id}/>
                                        <main role="main" className="col-md-8 col-lg-9 ml-sm-auto px-md-4">
                                            <Component { ...props }/>
                                        </main>
                                    </div>
                                </Container>
                            </div>
                        )

                    }

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