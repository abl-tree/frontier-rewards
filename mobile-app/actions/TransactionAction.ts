import axios from "axios";

const apiRoute = '/transactions'

export const GetData = (url = apiRoute, params = {}) => async dispatch => {
    try {

        dispatch({
            type: "TRANSACTION_REQUEST"
        })

        const res = await axios.get(url, {params: params})

        dispatch({
            type: "TRANSACTION_FETCH",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "TRANSACTION_FAIL",
            payload: error.response.data.message
        })

        return Promise.reject(error);
        
    }
}

export const AddData = (data) => async dispatch => {
    try {

        dispatch({
            type: "TRANSACTION_REQUEST"
        })

        const res = await axios.post(apiRoute, data)

        dispatch({
            type: "TRANSACTION_ADD",
            payload: res.data.data
        })

        return Promise.reject();
        
    } catch (error) {

        dispatch({
            type: "TRANSACTION_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}

export const EditData = (data) => async dispatch => {

    dispatch({
        type: "TRANSACTION_REQUEST"
    })

    await axios.put(apiRoute + '/' + data.id, data)
    .then((res) => {

        dispatch({
            type: "TRANSACTION_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve();

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "TRANSACTION_FAIL",
                payload: error.response.data.message
            })
        }

        return Promise.reject(error);
    })
    
}

export const DeleteData = (id) => async dispatch => {
    try {

        dispatch({
            type: "TRANSACTION_REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "TRANSACTION_DELETE",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "TRANSACTION_FAIL",
            payload: error.response.data.data
        })

        return Promise.reject(error);
        
    }
}