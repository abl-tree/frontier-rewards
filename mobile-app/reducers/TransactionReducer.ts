const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const TransactionReducer = (state = DefaultState, action) => {

    var stateData = state.data, newData

    switch (action.type) {
        case "TRANSACTION_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "TRANSACTION_FETCH":

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
            
        case "TRANSACTION_ADD":

            newData = [...state.data.data]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "TRANSACTION_UPDATE":

            var index = state.data.data.findIndex((item) => item.id === action.payload.id)
            newData = {
                ...state.data.data[index], 
                ...action.payload
            }

            stateData.data[index] = newData;

            console.log('update success 2');

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "TRANSACTION_DELETE":

            newData = state.data.data.filter((item) => item.id !== action.payload.id)

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                errorMsg: ""
            }
            
        case "TRANSACTION_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default TransactionReducer;