const DefaultState = {
    loading: false,
    data: {},
    errorMsg: ""
}

const PackageReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "PACKAGE_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "PACKAGE_SUCCESS":

            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
            
        case "PACKAGE_ADDED":

            var newData = state.data;
            var newPackages = [...state.data.data, action.payload]

            newData.data = newPackages;

            return {
                ...state,
                loading: false,
                data: newData,
                errorMsg: ""
            }
            
        case "PACKAGE_UPDATED":

            var newData = state.data;
            var index = state.data.data.findIndex((item) => item.id === action.payload.id)
            var newPackages = {
                ...state.data.data[index], 
                ...action.payload
            }

            newData.data[index] = newPackages;

            return {
                ...state,
                loading: false,
                data: newData,
                errorMsg: ""
            }
            
        case "PACKAGE_DELETED":

            var newData = state.data;
            var newPackages = state.data.data.filter((item) => item.id !== action.payload.id)

            newData.data = newPackages;

            return {
                ...state,
                loading: false,
                data: newData,
                errorMsg: ""
            }
            
        case "PACKAGE_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default PackageReducer;