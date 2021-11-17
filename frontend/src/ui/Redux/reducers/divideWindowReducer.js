/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openModal: false,
    okCallback:null,
    cancelCallback:null,
    countParts:5,
};
  
export default function divideWindowReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN_DIVIDE_MODAL":
            if(action.payload) {
                return {
                    ...state,
                    openModal: action.payload,
                    okCallback: action.okCallback,
                    cancelCallback: action.cancelCallback
                };
            }else{
                return {
                    ...state,
                    openModal: action.payload,
                };
            }
        case "CHANGE_DIVIDE_PARTS":
            return {...state, countParts: action.parts};
        default:
            return state;
    }
}