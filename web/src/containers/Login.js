import React, { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, Form, Col } from 'react-bootstrap';
import { Auth } from "../actions/userAction";
import '../css/signin.css'

const Login = (props) => {
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);

    const onLogin = async (event) => {

        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
    
        setValidated(true);

        if (form.checkValidity() === false) {

            return;

        }

        const data = {
            email: username,
            password: password
        }

        dispatch(Auth(props, data));
        
    }

    return (
        <div className="login-container text-center">
            <Form className="form-signin" noValidate validated={validated} onSubmit={onLogin}>

                <h1 className="h3 mb-3 font-weight-normal">Login</h1>

                <Form.Control 
                    type="email" 
                    placeholder="Email address" 
                    onChange={ e => setUsername(e.target.value) }
                    isInvalid={auth.errorMsg}
                    required
                />
        
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    onChange={ e => setPassword(e.target.value) }
                    isInvalid={auth.errorMsg}
                    required
                />

                <Form.Control.Feedback type="invalid">
                    {auth.errorMsg && (
                        <div>{auth.errorMsg}</div>
                    )}
                </Form.Control.Feedback>

                <Button 
                    className="btn-block"
                    variant="primary" 
                    type="submit"
                >
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login;