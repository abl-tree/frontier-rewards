interface AuthState {
    loading: Boolean,
    user: Object,
    errorMsg: String
}

const DefaultState = {
    loading: false,
    user: {},
    errorMsg: ""
}

const LoginReducer = (state: AuthState = DefaultState, action) => {

    switch (action.type) {
        case "INITIAL_STATE":

            return {
                ...state,
                user: action.payload
            }

        case "LOGIN_REQUEST":
            
            return {
                ...state,
                loading: true
            }
            
        case "LOGIN_SUCCESS":

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
            
        case "LOGOUT_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "LOGOUT_SUCCESS":

            return {
                ...state,
                loading: false,
                user: {},
                errorMsg: ""
            }
            
        case "LOGOUT_FAIL":
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