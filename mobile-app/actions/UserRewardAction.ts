import axios from "axios";

export const GetData = (url) => async dispatch => {
    try {

        dispatch({
            type: "USER_REWARD_REQUEST"
        })

        const res = await axios.get(url)        

        dispatch({
            type: "USER_REWARD_FETCH",
            payload: res.data.data.rewards
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "USER_REWARD_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }
}

export const AddData = (data) => async dispatch => {
    try {

        dispatch({
            type: "USER_REWARD_REQUEST"
        })

        const res = await axios.post(apiRoute, data)

        dispatch({
            type: "USER_REWARD_ADD",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "USER_REWARD_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }
}

export const EditData = (data) => async dispatch => {
    try {

        dispatch({
            type: "USER_REWARD_REQUEST"
        })

        const res = await axios.put(apiRoute + '/' + data.id, data)

        dispatch({
            type: "USER_REWARD_UPDATE",
            payload: res.data.data
        })

        return Promise.resolve();
        
    } catch (error) {

        dispatch({
            type: "USER_REWARD_FAIL",
            payload: error.response.data
        })

        return Promise.reject(error);
        
    }
}

export const DeleteData = (id) => async dispatch => {
    try {

        dispatch({
            type: "USER_REWARD_REQUEST"
        })

        const res = await axios.delete(apiRoute + '/' + id)

        dispatch({
            type: "USER_REWARD_DELETE",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "USER_REWARD_FAIL",
            payload: error.response.data.message
        })
        
    }
}

export const ClaimData = (id) => async dispatch => {
    try {

        // dispatch({
        //     type: "USER_REWARD_REQUEST"
        // })

        const res = await axios.post('/claim', {'reward_id' : id, 'qty' : 1})
        
        console.log(id, res.data.data);
        

        dispatch({
            type: "USER_REWARD_DELETE",
            payload: res.data.data.reward
        })
        
    } catch (error) {

        dispatch({
            type: "USER_REWARD_FAIL",
            payload: error.response.data.message
        })
        
    }
}