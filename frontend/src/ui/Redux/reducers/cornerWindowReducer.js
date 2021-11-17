/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Corner from "../../../command/Corner";

const initialState = {
    openCornerModal: false,
    okCallback:null,
    cancelCallback:null,
    radius:5,
    distance:5,
    type:Corner.TYPE_ROUND
};
  
export default function cornerWindowReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN_CORNER_MODAL":
            if(action.payload) {
                return {
                    ...state,
                    openCornerModal: action.payload,
                    okCallback: action.okCallback,
                    cancelCallback: action.cancelCallback
                };
            }else{
                return {
                    ...state,
                    openCornerModal: action.payload,
                };
            }
        case "CHANGE_CORNER_RADIUS":
            return {...state, radius: action.radius};
        case "CHANGE_CORNER_DISTANCE":
            return {...state, distance: action.distance};
        case "CHANGE_CORNER_TYPE":
            return {...state, type: action.corner_type};
        default:
            return state;
    }
}