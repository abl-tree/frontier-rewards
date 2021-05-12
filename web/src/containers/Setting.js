import React, {useState} from "react";
import { Badge, Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";

const Setting = (props) => {
    
    const [user, setUser] = useState({})

    React.useEffect(() => {
        fetchProfile(1)
    }, [])

    const fetchProfile = async event => {

        const res = await axios.get('/profile')

        setUser(res.data.data)

        console.log(res.data.data);

    }

    return (
        <>
        <Card>
            <Card.Body>
                <Card.Title>Personal Information</Card.Title>
                <Card.Text>
                    <Form>
                        <Row><Col>Name</Col></Row>
                        <Row>
                            <Col>
                                <Form.Control placeholder="First name" />
                            </Col>
                            <Col>
                                <Form.Control placeholder="Middle name" />
                            </Col>
                            <Col>
                                <Form.Control placeholder="Last name" />
                            </Col>
                        </Row>

                        <Row>
                            <Col ></Col>
                        </Row>
                        <Form.Group controlId="formGridAddress1">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control placeholder="1234 Main St" />
                        </Form.Group>
                    </Form>
                </Card.Text>
            </Card.Body>
        </Card>
        </>
    )

}

export default Setting;