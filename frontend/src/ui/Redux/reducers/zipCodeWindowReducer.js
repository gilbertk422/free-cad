/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openModal: false,
    okCallback:null,
    cancelCallback:null,
    country:container.resolve('config').shippingRequisites.address.country,
    zipCode:container.resolve('config').shippingRequisites.address.zipCode
};

export default function zipCodeWindowReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN_ZIP_CODE_MODAL":
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
        case "ZIP_CHANGE_COUNTRY":
            return {...state, country: action.payload};
        case "ZIP_CHANGE_CODE":
            return {...state, zipCode: action.payload};
        default:
            return state;
    }
}