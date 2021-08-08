import axios from "axios";

const apiRoute = '/notifications'

export const GetData = (props, url = apiRoute) => async dispatch => {

    dispatch({
        type: "NOTIFICATION_REQUEST"
    })

    try {

        const res = await axios.get(url)

        dispatch({
            type: "NOTIFICATION_FETCH",
            payload: res.data
        })
        
    } catch (error) {

        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data
        })
        
    }

}

export const AddData = (props, data) => async dispatch => {

    dispatch({
        type: "NOTIFICATION_REQUEST"
    })

    try {
        
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

export const EditData = (props, data) => async dispatch => {

    dispatch({
        type: "NOTIFICATION_REQUEST"
    })

    try {

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

export const DeleteData = (props, id) => async dispatch => {

    dispatch({
        type: "NOTIFICATION_REQUEST"
    })

    try {

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "NOTIFICATION_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {
        
        dispatch({
            type: "NOTIFICATION_FAIL",
            payload: error.response.data
        })
        
    }
        
}

export const MarkAsRead = () => async dispatch => {

    dispatch({
        type: "NOTIFICATION_REQUEST"
    })

    try {

        // const res = await axios.post('notifications/read')

        dispatch({
            type: "NOTIFICATION_READ"
        })

        console.log('notification read');

        return Promise.resolve();
        
    } catch (error) {
        
        // dispatch({
        //     type: "NOTIFICATION_FAIL",
        //     payload: error.response.data
        // })

        return Promise.reject(error);
        
    }

}