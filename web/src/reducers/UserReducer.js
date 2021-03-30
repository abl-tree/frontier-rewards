const DefaultState = {
    loading: false,
    users: [],
    errorMsg: ""
}

const UserReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "USER_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "USER_SUCCESS":

            return {
                ...state,
                loading: false,
                user: action.payload,
                errorMsg: ""
            }
            
        case "USER_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default UserReducer;