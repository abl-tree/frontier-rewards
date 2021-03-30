import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Button, Col, Form, Row } from 'react-bootstrap';
import QRCode from "qrcode.react";
import { Register } from "../actions/userAction";

const User = (props) => {

    const dispatch = useDispatch();
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const fields = [
        {
            'key': 'first_name',
            'title': 'First name',
            'type': 'text',
            'placeholder': 'Enter first name',
            'control_id': 'formFirstName',
            'required': true
        },
        {
            'key': 'middle_name',
            'title': 'Middle name',
            'type': 'text',
            'placeholder': 'Enter middle name',
            'control_id': 'formMiddleName'
        },
        {
            'key': 'last_name',
            'title': 'Last name',
            'type': 'text',
            'placeholder': 'Enter last name',
            'control_id': 'formLastName',
            'required': true
        },
        {
            'key': 'email',
            'title': 'Email',
            'type': 'email',
            'placeholder': 'Enter email',
            'control_id': 'formEmail',
            'required': true
        }
    ];

    const customerFields = [
        {
            'key': 'Address',
            'title': 'Address',
            'type': 'text',
            'placeholder': 'Enter address',
            'control_id': 'formAddress',
            'required': true
        },
        {
            'key': 'vehicle_year',
            'title': 'Vehicle Year',
            'type': 'text',
            'placeholder': 'Enter vehicle year',
            'control_id': 'formVehicleYear',
            'required': true
        },
        {
            'key': 'vehicle_make',
            'title': 'Vehicle Make',
            'type': 'text',
            'placeholder': 'Enter vehicle make',
            'control_id': 'formVehicleMake',
            'required': true
        },
        {
            'key': 'vehicle_model',
            'title': 'Vehicle Model',
            'type': 'text',
            'placeholder': 'Enter vehicle model',
            'control_id': 'formVehicleModel',
            'required': true
        },
        {
            'key': 'vehicle_trim',
            'title': 'Vehicle Trim',
            'type': 'text',
            'placeholder': 'Enter vehicle trim',
            'control_id': 'formVehicleTrim',
            'required': true
        },
        {
            'key': 'vehicle_color',
            'title': 'Vehicle Color',
            'type': 'text',
            'placeholder': 'Enter vehicle color',
            'control_id': 'formVehicleColor',
            'required': true
        },
        {
            'key': 'vehicle_vin_no',
            'title': 'Vehicle Vin No.',
            'type': 'text',
            'placeholder': 'Enter vehicle vin no.',
            'control_id': 'formVehicleVin',
            'required': true
        }
    ]

    const addUser = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {

            // var data = {};

            // fields.map((field) => {
            //     data[field.key] = field.value
            // });

            console.log(data);
    
            // dispatch(Register(props, data));

        }

    }

    return (
        <Col md="8">
            <Form noValidate validated={validated} onSubmit={addUser}>
                {fields.map((field) => {
                    return <Form.Group as={Row} controlId={field.control_id}>
                        <Form.Label column sm={3}>{field.title}</Form.Label>
                        <Col sm={9}>
                            <Form.Control 
                                required={field.required}
                                type={field.type} 
                                placeholder={field.placeholder}
                                onChange={ e => setData(prev => ({...prev, [field.key] : e.target.value})) }
                            />
                        </Col>
                    </Form.Group>
                })}

                {/* <Form.Group as={Row}>
                    <Form.Label as="legend" column sm={3}>Gender</Form.Label>
                    <Col sm={9}>
                        <Form.Check inline name="gender" type="radio" id="radio-male" name="gender" label="Male" checked/>
                        <Form.Check inline name="gender" type="radio" id="radio-female" name="gender" label="Female" />
                    </Col>
                </Form.Group> */}

                <Button 
                    variant="primary" 
                    type="submit"
                >
                    Add user
                </Button>

            </Form>

            {/* <Row>
                <Col>
                    <QRCode value="FR-1234" />
                </Col>
            </Row> */}
        </Col>
    )

}

export default User;