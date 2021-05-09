const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const UserReducer = (state = DefaultState, action) => {

    var stateData = state.data, newData

    switch (action.type) {
        case "USER_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "USER_FETCH":

            return {
                ...state,
                loading: false,
                data: action.payload,
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