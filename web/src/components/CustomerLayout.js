import React, {useState} from 'react';
import {useSelector} from "react-redux";
import { Link, Route, Redirect } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import axios from 'axios';
import _ from 'lodash';
import '../css/notifications.css'
import NotifyMe from 'react-notification-timeline';
import moment from 'moment';

export const CustomerHeader = (props) => {

    const [notifications, setNotifications] = useState({
        loading: false,
        data: []
    })
    const auth = useSelector(state => state.Auth);

    React.useEffect(() => {
        fetchNotification()
        initEcho()
    }, [])

    // Start Laravel Echo

    const initEcho = () => {
        window.Echo.private('App.Models.User.' + auth.user.id)
        .notification((notification) => {
            let newNotification = {
                'data' : {
                    'data': notification.data,
                    'title': notification.title
                },
                'created_at': moment()
            }

            setNotifications(prev => ({...prev, data: [...prev.data, newNotification]}))
        });
    }

    // End Laravel Echo

    const fetchNotification = async () => {
        const res = await axios.get('notifications');

        let data = res.data.data;

        setNotifications(prev => ({...prev, data: data, loading: false}));
    }

    const showNotifications = () => {

        return notifications.data.map((el, key) => {
            return {
                message: el.data.title,
                timestamp: parseInt(moment.parseZone(el.created_at).format('x'))
            }
        })

    }

    return (
        <Navbar collapseOnSelect className="sticky-top" expand="*" bg="dark" variant="dark">
            <Navbar.Brand className="col-sm-3 col-md-2 mr-0 px-3" href="#home">
            {/* <img
                alt=""
                src="/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
            /> */}
            Frontier Rewards
            </Navbar.Brand>

            <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <NotifyMe
                data={showNotifications()}
                storageKey='notific_key'
                notific_key='timestamp'
                notific_value='message'
                heading='Notification Alerts'
                sortedByKey={false}
                showDate={false}
                size={30}
                color="yellow"
                getDayDiff={(e) => {
                    return ''
                }}
            />

            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <Link className="nav-link" onClick={ e => props.onLogout() }>Logout</Link>
                </li>
            </ul>
        </Navbar>
    );

}

export const CustomerSidebar = (props) => {

    return (
        
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
                        <Link className="nav-link" to="/transactions">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Transactions
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            Profile
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="/setting">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            Setting
                        </Link>
                    </li> */}
                </ul>
            </div>
        </Navbar.Collapse>

    );

}
