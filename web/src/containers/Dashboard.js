import React from "react";
import { useSelector} from "react-redux";
import { Button } from 'react-bootstrap';

const Dashboard = (props) => {

    const auth = useSelector(state => state.Auth);

    return (
        <div>
            Dashboard

        </div>
    )

}

export default Dashboard;