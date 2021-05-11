import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Badge, Button, ButtonGroup, Card, Col, Figure, Form, ListGroup, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import QRCode from "qrcode.react";
import AsyncSelect from 'react-select/async';

const AdminProfile = (props) => {
    
    const dispatch = useDispatch();

    const userid = props.match.params.user;
    const [data, setData] = useState({});

    const [user, setUser] = useState({})
    const [rewards, setRewards] = useState({
        loading: false,
        data: [],
        errorMsg: ''
    })

    React.useEffect(() => {
        fetchData()
        fetchUserRewards()
        
        setData(prev => ({...prev, 'type' : 'earn'}))
        setData(prev => ({...prev, 'user_id' : userid}))
    }, [])

    const fetchUserRewards = async ($url = null) => {

        setRewards(prev => ({...prev, 'loading' : true}));

        const res = await axios.get($url ? $url : '/users/' + userid + '/rewards')

        let result = res.data.data
        
        setRewards(prev => ({...prev, 'loading' : false}));

        setRewards(prev => ({...prev, 'data' : result.rewards}));

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
                return <ListGroup.Item key={key}>{el.reward_name}</ListGroup.Item>
            })

        }

        if(dataList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(dataList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{dataList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    const fetchData = async event => {

        const res = await axios.get('/users/' + userid)

        setUser(res.data.data)

    }

    const qrCode = () => {
        if(!_.isEmpty(user.info) && !_.isEmpty(user.info.customer_id)) {

            return <Figure>
                        <QRCode value={user.info.customer_id} />
                        <Figure.Caption>{user.info.customer_id}</Figure.Caption>
                    </Figure>

        }
    }

    const fetchActions = async (search) => {

        const res = await axios.get('/campaigns/'+data.campaign_id+'/actions?search=' + search)

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a].action
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promiseActionOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchActions(inputValue));
        }, 1000);
    });

    const fetchRewards = async (search) => {

        const res = await axios.get('/campaigns/' + data.campaign_id + '/actions/' + data.action_id)

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a].reward
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promiseRewardOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchRewards(inputValue));
        }, 1000);
    });

    const fetchCampaigns = async (search) => {

        const res = await axios.get('/campaigns?search=' + search)

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promiseCampaignOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchCampaigns(inputValue));
        }, 1000);
    });

    const handleRewardSubmit = async () => {
        const res = await axios.post('transactions', data)

        var result = res.data.data

        setUser(prev => ({...prev, 'points' : result.balance}))

        fetchUserRewards()
    }

    return (
        <>
            <Row>
                <Col md="6">
                    <Card>
                        <Card.Body>
                            {qrCode()}
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{!_.isEmpty(user.info) && !_.isEmpty(user.info.address) ? user.info.address : '' }</Card.Subtitle>
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
                                    <Col md="8">{user.firstname}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Middlename</Col>
                                    <Col md="8">{user.middlename}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Lastname</Col>
                                    <Col md="8">{user.lastname}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Email</Col>
                                    <Col md="8">{user.email}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Phone</Col>
                                    <Col md="8">{user.phone_number}</Col>
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
                            <Card.Title>Add User Action</Card.Title>
                            <Card.Text>
                                <AsyncSelect cacheOptions defaultOptions loadOptions={promiseCampaignOptions} onChange={value => setData(prev => ({'type' : 'earn', 'user_id' : userid, 'campaign_id' : value.value, 'campaign_name' : value.label}))} />
                                {data.campaign_id ? <AsyncSelect key={'campaign-' + data.campaign_id} defaultOptions loadOptions={promiseActionOptions} onChange={value => setData(prev => ({...prev, 'action_id' : value.value, 'action_name' : value.label}))} /> : ''}
                                {data.action_id ? <AsyncSelect key={'action-' + data.action_id} isMulti defaultOptions loadOptions={promiseRewardOptions} onChange={value => setData(prev => ({...prev, 'rewards' : value}))} /> : ''}

                                {data.campaign_id && data.action_id  && !_.isEmpty(data.rewards) ? <Button onClick={handleRewardSubmit}>Submit</Button> : ''}
                            </Card.Text>
                        </Card.Body>
                    </Card>
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

const CustomerProfile = (props) => {
    
    const dispatch = useDispatch();

    const userid = props.match.params.user;
    const [data, setData] = useState({});

    const [user, setUser] = useState({})
    const [rewards, setRewards] = useState({
        loading: false,
        data: [],
        errorMsg: ''
    })

    React.useEffect(() => {
        fetchData()
        fetchUserRewards()
        
        setData(prev => ({...prev, 'type' : 'earn'}))
        setData(prev => ({...prev, 'user_id' : userid}))
    }, [])

    const fetchUserRewards = async ($url = null) => {

        setRewards(prev => ({...prev, 'loading' : true}));

        const res = await axios.get($url ? $url : '/users/' + userid + '/rewards')

        let result = res.data.data
        
        setRewards(prev => ({...prev, 'loading' : false}));

        setRewards(prev => ({...prev, 'data' : result.rewards}));

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

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    const fetchData = async event => {

        const res = await axios.get('/users/' + userid)

        setUser(res.data.data)

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
                            <Card.Subtitle className="mb-2 text-muted">{!_.isEmpty(user.info) && !_.isEmpty(user.info.address) ? user.info.address : '' }</Card.Subtitle>
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
                                    <Col md="8">{user.firstname}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Middlename</Col>
                                    <Col md="8">{user.middlename}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Lastname</Col>
                                    <Col md="8">{user.lastname}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Email</Col>
                                    <Col md="8">{user.email}</Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="font-weight-bold">Phone</Col>
                                    <Col md="8">{user.phone_number}</Col>
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