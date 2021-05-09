import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Badge, Button, ButtonGroup, Card, Col, Figure, Form, ListGroup, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import QRCode from "qrcode.react";

const AdminProfile = (props) => {
    
    const [user, setUser] = useState({})

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async event => {

        const res = await axios.get('/profile')

        setUser(res.data.data)

    }

    return (
        <>
            <Row>
                <Col md="12">
                    <Card>
                        <Card.Body>
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{user.type_name}</Card.Subtitle>
                            <Card.Text>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Points</Col>
                                    <Col md="9"><Badge variant="info">{user.points}</Badge></Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <Card.Title>Personal Information</Card.Title>
                            <Card.Text>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Firstname</Col>
                                    <Col md="8">{user.firstname || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Middlename</Col>
                                    <Col md="8">{user.middlename || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Lastname</Col>
                                    <Col md="8">{user.lastname || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Email</Col>
                                    <Col md="8">{user.email}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Phone</Col>
                                    <Col md="8">{user.phone_number || '-'}</Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )

}

const CustomerProfile = (props) => {
    
    const auth = useSelector(state => state.Auth);
    const [user, setUser] = useState({})
    const [rewards, setRewards] = useState({
        loading: false,
        data: [],
        errorMsg: ''
    })

    React.useEffect(() => {
        fetchData()
        fetchUserRewards()
    }, [])

    const fetchUserRewards = async ($url = null) => {

        setRewards(prev => ({...prev, 'loading' : true}));

        const res = await axios.get($url ? $url : '/users/' + auth.user.id + '/rewards')

        let result = res.data.data
        
        setRewards(prev => ({...prev, 'loading' : false}));

        setRewards(prev => ({...prev, 'data' : result.rewards}));

    }

    const fetchData = async event => {

        const res = await axios.get('/profile')

        setUser(res.data.data)

    }

    const handleClaim = async (reward_id) => {

        const res = await axios.post('claim', {'reward_id' : reward_id, 'qty' : 1})

        let result = res.data.data
        let reward = result.reward

        if(reward.status == 'completed') {
            let stateData = rewards.data
            let newData = stateData.data.filter((item) => item.id !== reward.id)
            
            stateData.data = newData;

            setRewards(prev => ({...prev, 'data' : stateData}));
        }

    }    

    const showRewardsPagination = () => {
        if(!_.isEmpty(rewards.data.links))
        return rewards.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchUserRewards(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showRewards = () => {

        let dataList = rewards

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {
                return <ListGroup.Item key={key}>{el.reward_name} <Button size="sm" onClick={() => handleClaim(el.id)}>Claim</Button></ListGroup.Item>
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

    const qrCode = () => {
        if(!_.isEmpty(user.info) && !_.isEmpty(user.info.customer_id)) {

            return <Figure>
                        <QRCode value={user.info.customer_id} />
                        <Figure.Caption>{user.info.customer_id}</Figure.Caption>
                    </Figure>

        }
    }

    return (
        <>
            <Row>
                <Col md="6">
                    <Card>
                        <Card.Body>
                            {qrCode()}
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{user.type_name}</Card.Subtitle>
                            <Card.Text>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Points</Col>
                                    <Col md="9"><Badge variant="info">{user.points}</Badge></Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <Card.Title>Personal Information</Card.Title>
                            <Card.Text>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Firstname</Col>
                                    <Col md="8">{user.firstname || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Middlename</Col>
                                    <Col md="8">{user.middlename || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Lastname</Col>
                                    <Col md="8">{user.lastname || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Email</Col>
                                    <Col md="8">{user.email}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Phone</Col>
                                    <Col md="8">{user.phone_number || '-'}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Package</Col>
                                    <Col md="8">{!_.isEmpty(user.info) && !_.isNull(user.info.package) ? user.info.package.name : '' }</Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <Card.Title>Vehicle Info</Card.Title>
                            <Card.Text>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Year</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_year) ? user.info.vehicle_year : '' }</Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Make</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_make) ? user.info.vehicle_make : '' }</Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Model</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_model) ? user.info.vehicle_model : '' }</Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Trim</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_trim) ? user.info.vehicle_trim : '' }</Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Color</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_color) ? user.info.vehicle_color : '' }</Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="font-weight-bold">Vin No.</Col>
                                    <Col md="9">{!_.isEmpty(user.info) && !_.isNull(user.info.vehicle_vin_no) ? user.info.vehicle_vin_no : '' }</Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <Card.Body>
                            <Card.Title>Rewards</Card.Title>
                            <Card.Text>
                                <ListGroup variant="flush">
                                {showRewards()}
                                </ListGroup>
                                
                                <Pagination>                    
                                    {showRewardsPagination()}
                                </Pagination>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )

}

export default (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminProfile(props)

    } else {

        return CustomerProfile(props)

    }
}