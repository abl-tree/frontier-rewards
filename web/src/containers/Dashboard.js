import React from "react";
import { useSelector} from "react-redux";
import { Button } from 'react-bootstrap';

const Dashboard = (props) => {

    const auth = useSelector(state => state.Auth);

    const onLogout = () => {
        // localStorage.removeItem('user');

        auth.user = null

        props.history.push("/login");

        console.log(props.history);
    }

    return (
        <div>
            Dashboard

            <Button 
                variant="primary" 
                type="submit"
                onClick={ e => onLogout() }
            >
                Logout
            </Button>
        </div>
    )

}

export default Dashboard;