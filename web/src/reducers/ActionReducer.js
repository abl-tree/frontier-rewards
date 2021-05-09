const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const ActionReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "ACTION_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "ACTION_FETCH":

            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
            
        case "ACTION_ADD":

            var stateData = state.data
            var newData = [...state.data.data, action.payload]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "ACTION_UPDATE":

            var stateData = state.data
            var index = state.data.data.findIndex((item) => item.id === action.payload.id)
            var newData = {
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
            
        case "ACTION_DELETE":

            var newData = state.data;
            var newPackages = state.data.data.filter((item) => item.id !== action.payload.id)

            newData.data = newPackages;

            return {
                ...state,
                loading: false,
                data: newData,
                errorMsg: ""
            }
            
        case "ACTION_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default ActionReducer;