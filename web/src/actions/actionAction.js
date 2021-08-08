import axios from "axios";

const apiRoute = '/actions'

export const GetData = (props, url = apiRoute) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    try {

        const res = await axios.get(url)

        dispatch({
            type: "ACTION_FETCH",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "ACTION_FAIL",
            payload: error.response.data
        })
        
    }

}

export const AddData = (props, data) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    try {
        
        const res = await axios.post(apiRoute, data)

        dispatch({
            type: "ACTION_ADD",
            payload: res.data.data
        })

        return Promise.resolve();

    } catch (error) {

        dispatch({
            type: "ACTION_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }

}

export const EditData = (props, data) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    try {

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "ACTION_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {
        
        dispatch({
            type: "ACTION_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }

}

export const DeleteData = (props, id) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    try {

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "ACTION_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {
        
        dispatch({
            type: "ACTION_FAIL",
            payload: error.response.data
        })
        
    }
        
}