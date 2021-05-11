import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, Row, Modal, Pagination, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import { Register, GetData, EditData, DeleteData } from "../actions/userAction";
import { ToastContainer, toast } from 'react-toastify';

const User = (props) => {

    const dispatch = useDispatch();
    const userList = useSelector(state => state.User);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({});
    const [show, setShow] = useState(false);  
    const dmsAxios = axios.create({
        baseURL: 'https://stage.apigw.cdkapps.eu',
        headers: {"Access-Control-Allow-Origin": "http://localhost:3000"}
    });
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
            'key': 'firstname',
            'title': 'First name',
            'type': 'text',
            'placeholder': 'Enter first name',
            'control_id': 'formFirstName',
            'required': true
        },
        {
            'key': 'middlename',
            'title': 'Middle name',
            'type': 'text',
            'placeholder': 'Enter middle name',
            'control_id': 'formMiddleName'
        },
        {
            'key': 'lastname',
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
        },
        {
            'key': 'phone_number',
            'title': 'Phone number',
            'type': 'text',
            'placeholder': 'Enter phone number',
            'control_id': 'formPhone',
            'required': true
        }
    ];
    const customerFields = [
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
            'key': 'customer_id',
            'title': 'Customer ID',
            'type': 'text',
            'placeholder': 'Enter customer ID',
            'control_id': 'formCustomerId',
            'required': true
        },
        {
            'key': 'firstname',
            'title': 'First name',
            'type': 'text',
            'placeholder': 'Enter first name',
            'control_id': 'formFirstName',
            'required': true
        },
        {
            'key': 'middlename',
            'title': 'Middle name',
            'type': 'text',
            'placeholder': 'Enter middle name',
            'control_id': 'formMiddleName'
        },
        {
            'key': 'lastname',
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
        },
        {
            'key': 'phone_number',
            'title': 'Phone number',
            'type': 'text',
            'placeholder': 'Enter phone number',
            'control_id': 'formPhone',
            'required': true
        },
        {
            'key': 'package_id',
            'title': 'Search name',
            'type': 'asyncselect',
            'placeholder': 'Enter name',
            'control_id': 'formName',
            'required': true
        }
    ];
    

    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({user_type_id: 3})

        setShow(true);

    }

    const addUser = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {
    
            if(data.id) {
                dispatch(EditData(props, data))
                .then(() => {
                    setShow(false)

                    toast.success("User updated successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch((error) => {
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
        
                })
            } else {
                dispatch(Register(props, data))
                .then(() => {
                    setShow(false);

                    toast.success("User added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch((error) => {
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
        
                })
            }

        }

    }

    const fetchUsers = (url = '/users', $params = {}) => {

        dispatch(GetData(props, url, $params));

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
                    <td><Link to={'user/' + el.id}>{el.info ? el.info.customer_id : '-'}</Link></td>
                    <td><Link to={'user/' + el.id}>{el.name}</Link></td>
                    <td>{el.type_name}</td>
                    <td>{el.email}</td>
                    <td>{el.phone_number}</td>
                    <td>{el.info && el.info.package ? el.info.package.name : 'None'}</td>
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

            return <tr><td colSpan="9" className="text-center">Loading...</td></tr>

        }

        if(userList.errorMsg !== "") {

            return <tr><td colSpan="9" className="text-center">{userList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="9" className="text-center">No data available</td></tr>

    }

    const handleEditShow = (val) => {

        val.customer_id = val.info ? val.info.customer_id : ''
        val.package_id = val.info ? {'value' : val.info.package.id, 'label' : val.info.package.name} : ''

        setData(val)

        setShow(true);

    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }

    const fetchPackages = async (search) => {

        const res = await axios.get('/packages?search=' + search)

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promisePackagesOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchPackages(inputValue));
        }, 1000);
    });

    const searchCustomer = async (email) => {

        const res = await dmsAxios.get('/sample/sample/v3/customers?email='+email+'&page=1&pageSize=50')

        console.log(res);
    }

    const promiseCustomersOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(searchCustomer(inputValue));
        }, 1000);
    });

    const userForm = () => {
        let form = fields

        if(data.user_type_id == 3) form = customerFields

        return form.map((field, i) => {
            if(field.type === 'text' || field.type === 'email') {
                return <Form.Group as={Row} key={i} controlId={field.control_id}>
                    <Form.Label column sm={3}>{field.title}</Form.Label>
                    <Col sm={9}>
                        <Form.Control 
                            required={field.required}
                            type={field.type} 
                            placeholder={field.placeholder}
                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
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
                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                            onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }>

                            {field.options.map((option, i) => {
                                return <option key={i} value={option.key}>{option.label}</option>
                            })}

                        </Form.Control>
                    </Col>
                </Form.Group>
            } else if(field.type === 'asyncselect') {
                if(field.key == 'package_id') {
                    return <AsyncSelect defaultOptions defaultValue={!_.isUndefined(data[field.key]) ? data[field.key] : ''} loadOptions={promisePackagesOptions} onChange={value => setData(prev => ({...prev, [field.key] : value}))} /> 
                }
            }
        })
    }

    const handleTypeChange = (val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, type : val};
        setFilters(tmpFilter)

        fetchUsers('/users', tmpFilter)
    }

    const handleFilterInputChange = (key, val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, [key] : val};
        setFilters(tmpFilter)

        fetchUsers('/users', tmpFilter)
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
                            <Modal.Title>{!_.isUndefined(data.id) ? 'Edit User' : 'Add User'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>                            
                            {userForm()}
                            {/* <AsyncSelect cacheOptions defaultOptions loadOptions={promisePackagesOptions} onChange={value => setData(prev => ({...prev, 'test' : value.value}))} /> */}

                            {/* <AsyncSelect loadOptions={promiseCustomersOptions} onChange={value => searchCustomer(value.value)} />     */}
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
                <Col md={12}>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>Type</Form.Label>
                            <Col lg={3}>
                                <Form.Control as="select" size="sm" custom defaultValue={!_.isEmpty(filters) && !_.isEmpty(filters.type) ? filters.type : 'all'} onChange={(e) => handleTypeChange(e.target.value)}>
                                <option value="all">All</option>
                                <option value="3">Customers</option>
                                <option value="2">Admins</option>
                                <option value="1">Super Admins</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Customer ID
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g ABC123" onChange={(e) => handleFilterInputChange('customer_id', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Name
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g John Doe" onChange={(e) => handleFilterInputChange('search', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Email
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g example@example.com" onChange={(e) => handleFilterInputChange('email', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
            </Row>

            <Row>                
                <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Package</th>
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

            <ToastContainer />
        </>
    )

}

export default User;