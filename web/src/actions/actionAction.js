import axios from "axios";

const apiRoute = '/actions/'

export const GetData = (props, url = apiRoute) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    await axios.get(url)
    .then((res) => {

        dispatch({
            type: "ACTION_FETCH",
            payload: res.data.data
        })

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "ACTION_FAIL",
                payload: error.response.data.message
            })
        }
    })

}

export const AddData = (props, data) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    await axios.post(apiRoute, data)
    .then((res) => {

        dispatch({
            type: "ACTION_ADD",
            payload: res.data.data
        })

        return Promise.resolve();

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "ACTION_FAIL",
                payload: error.response.data.message
            })
        }

        return Promise.reject();
    })

}

export const EditData = (props, data) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    await axios.put(apiRoute + data.id, data)
    .then((res) => {

        dispatch({
            type: "ACTION_UPDATE",
            payload: res.data.data
        })

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "ACTION_FAIL",
                payload: error.response.data.message
            })
        }
    })

}

export const DeleteData = (props, id) => async dispatch => {

    dispatch({
        type: "ACTION_REQUEST"
    })

    await axios.delete(apiRoute + id)
    .then((res) => {

        dispatch({
            type: "ACTION_DELETE",
            payload: res.data.data
        })

    })
    .catch((error) => {
        if(error.response) {
            dispatch({
                type: "ACTION_FAIL",
                payload: error.response.data.message
            })
        }
    })
        
}