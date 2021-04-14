import axios from "axios";

export const Auth = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "LOGIN_REQUEST"
        })

        const res = await axios.post('/login', data)

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
            type: "REQUEST"
        })

        const res = await axios.post('/register', data)

        dispatch({
            type: "ADD_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.data
        })
        
    }
}

const apiRoute = '/users'

export const GetData = (props, url = apiRoute) => async dispatch => {
    try {

        dispatch({
            type: "REQUEST"
        })

        const res = await axios.get(url)

        dispatch({
            type: "FETCH_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const EditData = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE"
        })

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "UPDATE_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const DeleteData = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "DELETE_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.data
        })
        
    }
}