const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const UserReducer = (state = DefaultState, action) => {

    var stateData = state.data, newData

    switch (action.type) {
        case "REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "FETCH_SUCCESS":

            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
            
        case "ADD_SUCCESS":

            newData = [...state.data.data]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "UPDATE_SUCCESS":

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
            
        case "DELETE_SUCCESS":

            newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "FAIL":
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