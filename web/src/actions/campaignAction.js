import axios from "axios";

const apiRoute = '/campaigns'

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

export const GetDataById = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "REQUEST"
        })

        const res = await axios.get(apiRoute + '/' + id)

        // dispatch({
        //     type: "FETCH_SUCCESS",
        //     payload: res.data.data
        // })
        
    } catch (error) {

        dispatch({
            type: "FAIL",
            payload: error.response.data.data
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
    try {

        dispatch({
            type: "REQUEST"
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