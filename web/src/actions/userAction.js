import axios from "axios";

export const Auth = (data) => async dispatch => {
    try {

        dispatch({
            type: "LOGIN_REQUEST"
        })

        console.log('request');

        const res = await axios.post('http://localhost:8000/v1/login', data)

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        console.log('error');

        dispatch({
            type: "LOGIN_FAIL",
            payload: error.response.data.data
        })
        
    }
}