import axios from "axios";

export const Auth = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "LOGIN_REQUEST"
        })

        const res = await axios.post('http://localhost:8000/v1/login', data)

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data.data
        })

        props.history.push("/");
        
    } catch (error) {

        console.log('error');

        dispatch({
            type: "LOGIN_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const Register = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "REGISTER_REQUEST"
        })

        const res = await axios.post('http://localhost:8000/v1/register', data)

        dispatch({
            type: "REGISTER_SUCCESS",
            payload: res.data.data
        })

        // props.history.push("/");
        
    } catch (error) {

        console.log('error');

        dispatch({
            type: "REGISTER_FAIL",
            payload: error.response.data.data
        })
        
    }
}