import axios from "axios";

const apiRoute = '/profile'

export const GetData = (url = apiRoute, params = {}) => async dispatch => {    
    try {

        dispatch({
            type: "USER_PROFILE_REQUEST"
        })

        const res = await axios.get(url)

        dispatch({
            type: "USER_PROFILE_FETCH",
            payload: res.data.data
        })

        return Promise.resolve(res.data.data)
        
    } catch (error) {

        dispatch({
            type: "USER_PROFILE_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error.response.data.data)
        
    }
}

export const EditData = (data) => async dispatch => {
    try {

        dispatch({
            type: "USER_PROFILE_REQUEST"
        })

        const res = await axios.post('/settings', data)

        dispatch({
            type: "USER_PROFILE_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve(res.data.data)
        
    } catch (error) {

        dispatch({
            type: "USER_PROFILE_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error.response.data.data)
        
    }
}