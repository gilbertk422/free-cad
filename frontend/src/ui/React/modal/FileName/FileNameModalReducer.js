/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    open: false,
    okCallback:()=>{},
    cancelCallback:()=>{}
};

export default function confirmationReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN_FILE_NAME_MODAL":
            return { open: action.open, okCallback:action.okCallback,  cancelCallback:action.cancelCallback};

        default:
            return state;
    }
}