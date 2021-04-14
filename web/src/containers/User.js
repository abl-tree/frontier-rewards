import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Row, Modal, Pagination, Table } from 'react-bootstrap';
import QRCode from "qrcode.react";
import _ from "lodash";
import { Register, GetData, EditData, DeleteData } from "../actions/userAction";

const User = (props) => {

    const dispatch = useDispatch();
    const userList = useSelector(state => state.User);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);  
    const fields = [
        {
            'key': 'user_type_id',
            'title': 'Type',
            'type': 'select',
            'placeholder': 'Enter action type',
            'options': [
                {
                    'label': 'Customer',
                    'key': '3'
                }, 
                {
                    'label': 'Admin',
                    'key': '2'
                }
            ],
            'default': 2,
            'control_id': 'formActionType',
            'required': true
        },
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

    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({...data, user_type_id: 3})

        setShow(true);

    }

    const addUser = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {
    
            dispatch(Register(props, data));

        }

    }

    const fetchUsers = (url = '/users') => {

        dispatch(GetData(props, url));

    }

    const showPagination = () => {
        if(!_.isEmpty(userList.data.links))
        return userList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchUsers(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showData = () => {

        if(!_.isEmpty(userList.data.data)) {

            return userList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.created_at}</td>
                    <td>{el.updated_at}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => {handleDelete(el.id)}}>Delete</Button>
                            <Button onClick={e => handleEditShow(el)}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            })

        }

        if(userList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(userList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{userList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">Unable to get data</td></tr>

    }

    const handleEditShow = (val) => {

        setData(val)

        setShow(true);

    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }

    // Start Laravel Echo

    const initEcho = () => {
        window.Echo.private(`reward`)
        .listen('RewardCreated', (e) => {
            console.log('channel', e);
        });
    }

    // End Laravel Echo

    React.useEffect(() => {

        // initEcho()

        fetchUsers()

        // fetchRewards()

    }, [])

    return (
        <>
            <Row>
                <Button variant="primary" onClick={handleShow}>
                    Add User
                </Button>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={addUser}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>                            
                            {fields.map((field, i) => {
                                if(field.type === 'text' || field.type === 'email') {
                                    return <Form.Group as={Row} key={i} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{field.title}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                required={field.required}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={data[field.key]}
                                                defaultValue={data[field.key]}
                                                onChange={ e => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                            />
                                        </Col>
                                    </Form.Group>
                                } else if(field.type === 'select') {
                                    return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{field.title}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                size="sm"
                                                required={field.required}
                                                as={field.type} 
                                                placeholder={field.placeholder}
                                                value={data[field.key]}
                                                defaultValue={data[field.key]}
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }>

                                                {field.options.map((option, i) => {
                                                    return <option key={i} value={option.key}>{option.label}</option>
                                                })}

                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                }
                            })}

                            {/* <Row>
                                <Col>
                                    <QRCode value="FR-1234" />
                                </Col>
                            </Row> */}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            Close
                            </Button>
                            <Button variant="primary" type="submit">
                            Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Row>

            <Row>                
                <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showData()}
                    </tbody>
                </Table>

                <Pagination>                    
                    {showPagination()}
                </Pagination>
            </Row>
        </>
    )

}

export default User;