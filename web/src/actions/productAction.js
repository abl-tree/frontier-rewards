import axios from "axios";

export const GetProductList = (page) => async dispatch => {
    try {

        dispatch({
            type: "PRODUCT_LIST_LOADING"
        })

        const res = await axios.get('/products')

        dispatch({
            type: "PRODUCT_LIST_SUCCESS",
            payload: res.data
        })
        
    } catch (error) {

        dispatch({
            type: "PRODUCT_LIST_FAIL"
        })
        
    }
}