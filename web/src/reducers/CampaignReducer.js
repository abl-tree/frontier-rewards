const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const CampaignReducer = (state = DefaultState, action) => {

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

            var newData = [...state.data.data]

            var stateData = state.data

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "UPDATE_SUCCESS":

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
            
        case "DELETE_SUCCESS":

            var stateData = state.data
            var newData = state.data.data.filter((item) => item.id !== action.payload.id)

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

export default CampaignReducer;