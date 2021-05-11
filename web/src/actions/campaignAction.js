import axios from "axios";

const apiRoute = '/campaigns'

export const GetData = (props, url = apiRoute) => async dispatch => {
    try {

        dispatch({
            type: "CAMPAIGN_REQUEST"
        })

        const res = await axios.get(url)

        dispatch({
            type: "CAMPAIGN_FETCH",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "CAMPAIGN_FAIL",
            payload: error.response.data
        })
        
    }
}

export const GetDataById = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "CAMPAIGN_REQUEST"
        })

        const res = await axios.get(apiRoute + '/' + id)

        dispatch({
            type: "CAMPAIGN_FETCH",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "CAMPAIGN_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const AddData = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "CAMPAIGN_REQUEST"
        })

        const res = await axios.post(apiRoute, data)

        dispatch({
            type: "CAMPAIGN_ADD",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "CAMPAIGN_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}

export const EditData = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "CAMPAIGN_REQUEST"
        })

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "CAMPAIGN_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "CAMPAIGN_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}

export const DeleteData = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "CAMPAIGN_REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "CAMPAIGN_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {

        console.log(error.response.data);

        dispatch({
            type: "CAMPAIGN_FAIL",
            payload: error.response.data.data
        })
        
    }
}