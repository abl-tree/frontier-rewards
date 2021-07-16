const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const UserRewardReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "USER_REWARD_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "USER_REWARD_FETCH":

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
            
        case "USER_REWARD_ADD":

            var stateData = state.data
            var newData = [...state.data.data, action.payload]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_REWARD_UPDATE":

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
            
        case "USER_REWARD_DELETE":

            var stateData = state.data
            var newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "USER_REWARD_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default UserRewardReducer;