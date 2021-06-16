import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";

export const ProtectedLogin = ({ component: Component, ...rest }) => {
    
    const auth = useSelector(state => state.Auth);

    return (
        <Route
            {...rest}
            render = { props => {
                if(_.isEmpty(auth.user)) {

                    return <div className="login-page">
                        <span className="top-shape"></span>
                        <span className="bottom-shape"></span>
                        <Component { ...props }/>
                    </div>

                } else {

                    return <Redirect to={
                        {
                            pathname: "/",
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