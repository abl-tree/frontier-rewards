import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8000/";
// axios.defaults.headers.common['Authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWNhMjVkZTFmZmMzMDI2YWU2NjY5MjMxOTU5M2I0M2FmOGFkNjM4YTEyMDhmN2Q2MWY4MzZiNDkxNzFkYmM4YTNmMDYwNTNjMzM4MzFkZTciLCJpYXQiOjE2MTMyMTcxODgsIm5iZiI6MTYxMzIxNzE4OCwiZXhwIjoxNjQ0NzUzMTg4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.0EdV6jVVcUD5K84o2TckNqDPFLxPtRzKefxTQF7s-eTi0gttSKj3Ok_KeAwHbW9dTx3OewOnGFTZ-p4CWqWnu2BJ6ljyEqcI-DhTKMvTZlU8GoF8q4wuth3B42Wn076MaGeQHqlfphR-VdQx-weP33Q8d9sD8V3LuTjdigEB82ekXFhZzzGTb3JMVm9NNXhB4foLC9-K5hHFQdq9U8n0VBkfR_xJNN0l-ins0zKKEXUOzqeYtrwzqE4iH2B58h7KU5vF8SoEkcQ2AoJPyDc0xs80og3Z1vCnWCJwLvdfIHHIoa_dN06RByeH9yOmm5ZzkZ6ozBmP2C6X0Xt_ywczRW758kgnBRXRaMN_hOjm-pJkxxz7X3M2tle4l9Y3lXrZJeFuaRmwzhMTueW5TS-R1YQNnUUmHLz1kUOneJ_BPHlY-CPjV8JvV63a22OCJEnMmBS87_YNaJG8UoLZdRSRCd_V7hlfwcNd6PRicRooPyrfU98i1BtL_HSR2kQ9LlfsBUfsz6YchwHH8Y-VRIn1VpXPHVc3x3AceG-fjiiC6HI6lqdBdvgCj951lXOwGhSsP2H5qJqRo1HBHieQURW4cjlbGrxgC0DP_UXAFIlAGVD_FSnQ9yJNtinyP-wipeRki0H4GilmsogcSNg3J1FfjO9jGOAtIe-j_K9YXecMggE";

export const GetProductList = (page) => async dispatch => {
    try {

        dispatch({
            type: "PRODUCT_LIST_LOADING"
        })

        const res = await axios.get('http://localhost:8000/api/products')

        dispatch({
            type: "PRODUCT_LIST_SUCCESS",
            payload: res.data
        })
        
    } catch (error) {

        dispatch({
            type: "PRODUCT_LIST_FAIL"
        })
        
    }
}