/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
  openConfirm: false,
  message:""
};

export default function confirmationReducer(state = initialState, action) {
    // console.log(state,'confirmReducer')
    switch (action.type) {
        case "OPEN_CONFIRM":
        return { openConfirm: action.payload, message: action.message };
  
      default:
        return state;
  }
}
