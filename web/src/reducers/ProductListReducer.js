const DefaultState = {
    loading: false,
    data: [],
    count: 0,
    errorMsg: ""
}

const ProductListReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "PRODUCT_LIST_LOADING":
            return {
                ...state,
                loading: true
            }
            
        case "PRODUCT_LIST_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload,
                // count: action.payload.count,
                errorMsg: ""
            }
            
        case "PRODUCT_LIST_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: "Unable to get products"
            }
    
        default:
            return state;
    }
}

export default ProductListReducer;