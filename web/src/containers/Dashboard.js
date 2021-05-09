import React, {useState} from "react";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row } from 'react-bootstrap';
import Chart from "react-apexcharts";
import axios from 'axios';

const Dashboard = (props) => {

    const auth = useSelector(state => state.Auth);
    const [transactions, setTransactions] = useState({
        options: {
            title: {
                text: 'Transactions'
            },
            noData: {
                text: 'No data'
            },
            labels: ['Cancelled', 'Pending', 'Confirmed', 'Completed'],
            colors: ['#ff4560', '#008ffb', '#feb019', '#00e396']
        },
        series: []
    })

    React.useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async event => {

        const res = await axios.get('/summary/transactions')
        let data = res.data.data

        if(data.cancelled != 0 || data.pending != 0 || data.confirmed != 0 || data.completed)
        setTransactions(prev => ({...prev, 'series' : [data.cancelled, data.pending, data.confirmed, data.completed]}))

    }

    return (
        <>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <Chart options={transactions.options} series={transactions.series} type="pie"/>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )

}

export default Dashboard;