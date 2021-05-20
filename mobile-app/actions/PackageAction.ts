import axios from "axios";

export const GetData = (url = '/packages') => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.get(url)

        dispatch({
            type: "PACKAGE_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const AddData = (data) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.post('/packages', data)

        dispatch({
            type: "PACKAGE_ADDED",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}

export const EditData = (data) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.put('/packages/' + data.id, data)

        dispatch({
            type: "PACKAGE_UPDATED",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}

export const DeleteData = (id) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.delete('/packages/' + id)

        dispatch({
            type: "PACKAGE_DELETED",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })
        
    }
}