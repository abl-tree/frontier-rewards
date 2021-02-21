import React, { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, Form, Col } from 'react-bootstrap';
import { Auth } from "../actions/userAction";

const Login = (props) => {
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async (e) => {

        e.preventDefault();

        const data = {
            email: username,
            password: password
        }

        dispatch(Auth(props, data));
        
    }

    return (
        <Col md="6">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        onChange={ e => setUsername(e.target.value) }
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
            
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        onChange={ e => setPassword(e.target.value) }
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit"
                    onClick={ e => onLogin(e) }
                >
                    Login
                </Button>

                {auth.errorMsg && (
                    <div>{auth.errorMsg}</div>
                )}
            </Form>
        </Col>
    )
}

export default Login;