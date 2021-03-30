import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import {AddData, DeleteData, EditData, GetData} from "../actions/rewardAction";

const Reward = (props) => {
    
    const dispatch = useDispatch();
    const dataList = useSelector(state => state.Reward);
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
        },
        {
            'key': 'type',
            'title': 'Type',
            'type': 'select',
            'placeholder': 'Enter action type',
            'options': [
                {
                    'label': 'Item',
                    'key': 'item'
                }, 
                {
                    'label': 'Discount',
                    'key': 'discount'
                },
                {
                    'label': 'Points',
                    'key': 'points'
                }
            ],
            'control_id': 'formActionType',
            'required': true
        }
    ];

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({
            'type': 'item'
        })

        setShow(true);

    }
    const handleEditShow = (val) => {

        setData(val)

        setShow(true);

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/rewards') => {

        dispatch(GetData(props, url));

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {

            if(data.id) dispatch(EditData(props, data))
            else dispatch(AddData(props, data))

        }

    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }
    const showPagination = () => {
        if(!_.isEmpty(dataList.data.links))
        return dataList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showData = () => {

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
                    <td>{el.type}</td>
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

        if(dataList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(dataList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{dataList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">Unable to get data</td></tr>

    }

    return (
        <>
            <Row>
                <Button variant="primary" onClick={handleShow}>
                    Add Reward
                </Button>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Reward</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {fields.map((field, i) => {
                                if(field.type === 'text') {
                                    return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{field.title}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                required={field.required}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={data[field.key]}
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
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
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }>

                                                {field.options.map((option, i) => {
                                                    return <option key={i} value={option.key}>{option.label}</option>
                                                })}

                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                }
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
                            <th>Type</th>
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

export default Reward;