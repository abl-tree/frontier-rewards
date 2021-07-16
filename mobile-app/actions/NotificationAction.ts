import axios from "axios";

const apiRoute = '/notifications'

export const GetData = (url = apiRoute) => async dispatch => {    
    try {

        dispatch({
            type: "NOTIFICATION_REQUEST"
        })

        const res = await axios.get(url)        

        dispatch({
            type: "NOTIFICATION_FETCH",
            payload: res.data.data
        })

        return Promise.resolve(res.data.data);
        
    } catch (error) {

        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error.response.data);
        
    }
}

export const AddData = (data) => async dispatch => {
    try {

        dispatch({
            type: "NOTIFICATION_REQUEST"
        })

        const res = await axios.post(apiRoute, data)

        dispatch({
            type: "NOTIFICATION_ADD",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }
}

export const EditData = (data) => async dispatch => {
    try {

        dispatch({
            type: "NOTIFICATION_REQUEST"
        })

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "NOTIFICATION_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }
}

export const DeleteData = (id) => async dispatch => {
    try {

        dispatch({
            type: "NOTIFICATION_REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "NOTIFICATION_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data.message
        })
        
    }
}