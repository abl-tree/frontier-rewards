const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const RewardReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "REWARD_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "REWARD_FETCH":

            var stateData = action.payload;

            if(stateData.current_page > 1 && state.data && state.data.data) {
                var newData = [...state.data.data, ...action.payload.data];
    
                stateData.data = newData;
            }

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "REWARD_ADD":

            var stateData = state.data
            var newData = [action.payload, ...state.data.data]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "REWARD_UPDATE":

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
            
        case "REWARD_DELETE":

            var stateData = state.data
            var newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "REWARD_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default RewardReducer;