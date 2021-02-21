import React, { useState } from "react";
import { useSelector} from "react-redux";
import { Button, Col, Form, Row } from 'react-bootstrap';
import QRCode from "qrcode.react";

const User = (props) => {

    // const auth = useSelector(state => state.Auth);

    const [validated, setValidated] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [lastname, setLastname] = useState("");

    const addUser = (e) => {

        const form = e.currentTarget;

        if(form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);
        // localStorage.removeItem('user');
 
        // auth.user = null

        // props.history.push("/login");

        // console.log(props.history);
    }

    return (
        <Col md="8">
            <Form noValidate validated={validated} onSubmit={addUser}>
                <Form.Group as={Row} controlId="formFirstname">
                    <Form.Label column sm={3}>First name</Form.Label>
                    <Col sm={9}>
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Enter first name" 
                            onChange={ e => setFirstname(e.target.value) }
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                        Please add first name.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="formMiddlename">
                    <Form.Label column sm={3}>Middle name</Form.Label>
                    <Col sm={9}>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter middle name" 
                            onChange={ e => setMiddlename(e.target.value) }
                        />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="formLastname">
                    <Form.Label column sm={3}>Last name</Form.Label>
                    <Col sm={9}>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter last name" 
                            onChange={ e => setLastname(e.target.value) }
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label as="legend" column sm={3}>Gender</Form.Label>
                    <Col sm={9}>
                        <Form.Check inline name="gender" type="radio" id="radio-male" name="gender" label="Male" checked/>
                        <Form.Check inline name="gender" type="radio" id="radio-female" name="gender" label="Female" />
                    </Col>
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit"
                >
                    Add user
                </Button>

            </Form>

            <Row>
                <Col>
                    <QRCode value="FR-1234" />
                </Col>
            </Row>
        </Col>
    )

}

export default User;