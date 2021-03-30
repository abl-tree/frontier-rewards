import axios from "axios";

export const GetPackages = (props, url = '/packages') => async dispatch => {
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

export const AddPackage = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.post('http://localhost:8000/v1/packages', data)

        dispatch({
            type: "PACKAGE_ADDED",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const EditPackage = (props, data) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.put('http://localhost:8000/v1/packages/' + data.id, data)

        dispatch({
            type: "PACKAGE_UPDATED",
            payload: res.data.data
        })
        
    } catch (error) {

        dispatch({
            type: "PACKAGE_FAIL",
            payload: error.response.data.data
        })
        
    }
}

export const DeletePackage = (props, id) => async dispatch => {
    try {

        dispatch({
            type: "PACKAGE_REQUEST"
        })

        const res = await axios.delete('http://localhost:8000/v1/packages/' + id)

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