const DefaultState = {
    loading: false,
    user: [],
    errorMsg: ""
}

const LoginReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "LOGIN_SUCCESS":
            alert('success');
            return {
                ...state,
                loading: false,
                user: action.payload,
                errorMsg: ""
            }
            
        case "LOGIN_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default LoginReducer;