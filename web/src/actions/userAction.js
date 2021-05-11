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

        dispatch({
            type: "LOGIN_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const Register = (props, data) => async dispatch => {
    dispatch({
        type: "USER_REQUEST"
    })

    await axios.post('/register', data)
    .then((res) => {

        dispatch({
            type: "USER_ADD",
            payload: res.data.data
        })

        return Promise.resolve();

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "USER_FAIL",
                payload: error.response.data
            })
        }

        return Promise.reject(error);
    })
}

export const Logout = (props) => async dispatch => {
    try {

        dispatch({
            type: "USER_REQUEST"
        })

        const res = await axios.post('/logout')

        window.Echo.disconnect();

        dispatch({
            type: "LOGOUT_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "USER_FAIL",
            payload: error.response.data.data
        })
        
    }
}

const apiRoute = '/users'

export const GetData = (props, url = apiRoute, params = {}) => async dispatch => {
    try {

        dispatch({
            type: "USER_REQUEST"
        })

        const res = await axios.get(url, {params: params})

        dispatch({
            type: "USER_FETCH",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "USER_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const EditData = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "USER_REQUEST"
        })

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "USER_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve()
        
    } catch (error) {

        dispatch({
            type: "USER_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error)
        
    }
}

export const DeleteData = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "USER_REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "USER_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "USER_FAIL",
            payload: error.response.data.data
        })
        
    }
}