import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import {AddData, DeleteData, EditData, GetData} from "../actions/actionAction";

const AdminAction = (props) => {
    
    const dispatch = useDispatch();
    const actionList = useSelector(state => state.Action);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const fields = [
        {
            'key': 'id',
            'title': 'Name',
            'type': 'hidden',
            'placeholder': 'Action ID',
            'control_id': 'formActionId',
            'hidden': true
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'placeholder': 'Enter action name',
            'control_id': 'formActionName',
            'required': true
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'placeholder': 'Enter action description',
            'control_id': 'formActionDescription',
            'required': true
        }
    ];

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({})

        setShow(true);

    }
    const handleEditShow = (val) => {

        setData(val)

        setShow(true);

    }

    const fetchData = (url = '/actions') => {

        dispatch(GetData(props, url));

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {

            if(data.id) dispatch(EditData(props, data))
            else {
                dispatch(AddData(props, data)).then(() => {
                    setShow(false)
                }).catch(() => {
                    alert('error')
                })
            }

        }

    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }

    const showPagination = () => {
        if(!_.isEmpty(actionList.data.links))
        return actionList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showData = () => {

        if(!_.isEmpty(actionList.data.data)) {

            return actionList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
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

        if(actionList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(actionList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{actionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">Unable to get data</td></tr>

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Row>
                <Button variant="primary" onClick={handleShow}>
                    Add Action
                </Button>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Action</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {fields.map((field, i) => {
                                return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                    <Form.Label column sm={3}>{field.title}</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control 
                                            required={field.required}
                                            type={field.type} 
                                            placeholder={field.placeholder}
                                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                                            onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                        />
                                    </Col>
                                </Form.Group>
                            })}
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
                            <th>Description</th>
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

const UserAction = (props) => {
    
    const dispatch = useDispatch();
    const actionList = useSelector(state => state.Action);

    const showData = () => {

        if(!_.isEmpty(actionList.data.data)) {

            return actionList.data.data.map((el, key) => {

                return <Col md={4} className="mb-3">
                    <Card key={key}>
                        <Card.Body>
                            <Card.Title>{el.name}</Card.Title>
                            <Card.Text>{el.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            })

        }

        if(actionList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(actionList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{actionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">Unable to get data</td></tr>

    }

    React.useEffect(() => {

        fetchData()

    }, [])

    const fetchData = (url = '/actions') => {

        dispatch(GetData(props, url));

    }

    return (
        <>
            <Row className="pt-3">
                {showData()}
            </Row>
        </>
    )

}

const Init  = (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminAction(props)

    } else {

        return UserAction(props)

    }

}

export default AdminAction