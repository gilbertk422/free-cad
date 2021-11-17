/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    errorThreshold: 0.1,
    okCallback:null,
    cancelCallback:null,
    open:false,
};
  
export default function simplifyWindowReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN_SIMPLIFY_MODAL":
            if(action.payload) {
                return {
                    ...state,
                    open: action.payload,
                    okCallback: action.okCallback,
                    cancelCallback: action.cancelCallback
                };
            }else{
                return {
                    ...state,
                    open: action.payload,
                };
            }
        case "CHANGE_SIMPLIFY_ERROR":
            return {...state, errorThreshold: action.errorThreshold};
        default:
            return state;
    }
}