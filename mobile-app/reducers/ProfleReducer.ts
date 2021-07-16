const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const ProfileReducer = (state = DefaultState, action) => {

    var stateData = state.data, newData

    switch (action.type) {
        case "USER_PROFILE_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "USER_PROFILE_FETCH":

            var stateData = action.payload;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_ADD":

            newData = [action.payload, ...state.data.data]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_UPDATE":

            var index = state.data.data.findIndex((item) => item.id === action.payload.id)
            newData = {
                ...state.data.data[index], 
                ...action.payload
            }

            stateData.data[index] = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_DELETE":

            newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_PROFILE_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default ProfileReducer;