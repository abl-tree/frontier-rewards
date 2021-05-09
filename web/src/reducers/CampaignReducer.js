const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const CampaignReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "CAMPAIGN_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "CAMPAIGN_FETCH":

            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
            
        case "CAMPAIGN_ADD":

            var newData = [...state.data.data, action.payload]

            var stateData = state.data

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "CAMPAIGN_UPDATE":

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
            
        case "CAMPAIGN_DELETE":

            var stateData = state.data
            var newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "CAMPAIGN_FAIL":
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