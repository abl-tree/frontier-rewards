import axios from "axios";

const apiRoute = '/transactions'

export const GetData = (props, url = apiRoute, params = {}) => async dispatch => {
    try {

        dispatch({
            type: "REQUEST"
        })

        const res = await axios.get(url, {params: params})

        dispatch({
            type: "FETCH_SUCCESS",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.message
        })
        
    }
}

export const AddData = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "REQUEST"
        })

        const res = await axios.post(apiRoute, data)

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

export const EditData = (props, data) => async dispatch => {

    dispatch({
        type: "REQUEST"
    })

    await axios.put(apiRoute + '/' + data.id, data)
    .then((res) => {

        dispatch({
            type: "UPDATE_SUCCESS",
            payload: res.data.data
        })

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "FAIL",
                payload: error.response.data.message
            })
        }
    })
    
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