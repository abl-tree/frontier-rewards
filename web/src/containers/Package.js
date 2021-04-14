import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import {AddPackage, DeletePackage, EditPackage, GetPackages} from "../actions/packageAction";
import AsyncSelect from 'react-select/async';

const Product = (props) => {
    
    const dispatch = useDispatch();
    const packageList = useSelector(state => state.Package);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [reward, setReward] = useState({});
    const fields = [
        {
            'key': 'id',
            'title': 'Name',
            'type': 'hidden',
            'placeholder': 'Package ID',
            'control_id': 'formPackageId',
            'hidden': true
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'placeholder': 'Enter package name',
            'control_id': 'formPackageName',
            'required': true
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'placeholder': 'Enter package description',
            'control_id': 'formPackageDescription',
            'required': true
        },
        {
            'key': 'multiplier',
            'title': 'Multiplier',
            'type': 'text',
            'placeholder': 'Enter package multiplier',
            'control_id': 'formPackageMultiplier',
            'required': true
        }
    ];

    const productName = props.match.params.product;

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = (packageData) => {

        setData({})

        setShow(true);

    }
    const handleEditShow = (packageData) => {

        console.log(packageData);

        setData(packageData)

        setShow(true);

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/packages') => {

        console.log(process.env.NODE_ENV);

        dispatch(GetPackages(props, url));

    }

    const addPackage = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {

            if(data.id) dispatch(EditPackage(props, data))
            else dispatch(AddPackage(props, data))

        }

    }

    const fetchRewards = async () => {

        const res = await axios.get('/rewards')

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }
        
        return options
    }

    const promiseRewardOptions = inputValue => new Promise(resolve => {

        setTimeout(() => {
            resolve(fetchRewards(inputValue));
        }, 1000);

    });

    const handleDelete = id => {
    
        dispatch(DeletePackage(props, id))

    }
    const showPagination = () => {
        if(!_.isEmpty(packageList.data.links))
        return packageList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showData = () => {

        if(!_.isEmpty(packageList.data.data)) {

            return packageList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
                    <td>{el.multiplier}</td>
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

        if(packageList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(packageList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{packageList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">Unable to get data</td></tr>

    }

    return (
        <>
            <Row>
                <Button variant="primary" onClick={handleShow}>
                    Add Package
                </Button>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={addPackage}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Package</Modal.Title>
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
                                            value={data[field.key]}
                                            onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                        />
                                    </Col>
                                </Form.Group>
                            })}
                            <AsyncSelect cacheOptions defaultOptions loadOptions={promiseRewardOptions} onChange={value => setReward(prev => ({...prev, 'reward_id' : value.value}))} placeholder="None" />
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
                            <th>Multiplier</th>
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

export default Product;