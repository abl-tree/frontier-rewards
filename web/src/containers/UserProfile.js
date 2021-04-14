import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";

const CampaignDetail = (props) => {
    
    const dispatch = useDispatch();

    const userid = props.match.params.user;

    const [search, setSearch] = useState("");

    const [user, setUser] = useState({})

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async event => {

        const res = await axios.get('/users/' + userid)

        setUser(res.data.data)

    }

    return (
        <>
            <Row>
                <Col md="12">{user.name}</Col>
                <Col md="12">{!_.isEmpty(user.info) && !_.isEmpty(user.info.address) ? user.info.address : '' }</Col>
            </Row>
        </>
    )

}

export default CampaignDetail;