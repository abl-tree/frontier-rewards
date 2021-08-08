import moment from 'moment-timezone';

const DefaultState = {
    loading: false,
    count: 0,
    data: {},
    errorMsg: ""
}

const NotificationReducer = (state = DefaultState, action) => {

    switch (action.type) {
        case "NOTIFICATION_REQUEST":
            return {
                ...state,
                loading: true
            }
            
        case "NOTIFICATION_FETCH":

            return {
                ...state,
                loading: false,
                data: action.payload.data,
                count: action.payload.count,
                errorMsg: ""
            }
            
        case "NOTIFICATION_ADD":

            var stateData = state.data
            var newData = [action.payload, ...state.data.data]

            stateData.data = newData;

            return {
                ...state,
                loading: false,
                data: stateData,
                count: state.count + 1,
                errorMsg: ""
            }
            
        case "NOTIFICATION_UPDATE":

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
            
        case "NOTIFICATION_DELETE":

            var newData = state.data;
            var newPackages = state.data.data.filter((item) => item.id !== action.payload.id)

            newData.data = newPackages;

            return {
                ...state,
                loading: false,
                data: newData,
                errorMsg: ""
            }
            
        case "NOTIFICATION_READ":

            var newData = state.data;
            var newNotifications = state.data.data.map((el, key) => {
                return {...el, read_at: moment().format()}
            })

            newData.data = newNotifications;

            return {
                ...state,
                loading: false,
                count: 0,
                data: newData,
                errorMsg: ""
            }
            
        case "NOTIFICATION_FAIL":
            return {
                ...state,
                loading: false,
                errorMsg: action.payload.error
            }
    
        default:
            return state;
    }

}

export default NotificationReducer;