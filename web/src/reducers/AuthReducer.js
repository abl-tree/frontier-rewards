const DefaultState = {
    loading: false,
    user: localStorage.getItem('user') != 'undefined' ? JSON.parse(localStorage.getItem('user')) : {},
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

            localStorage.setItem('user', JSON.stringify(action.payload));

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

            localStorage.removeItem('user');

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