/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openConfirmSaveDesign: false
  };
  
  export default function confirmSaveDesignReducer(state = initialState, action) {
    // console.log(state,'priceReducer')
    switch (action.type) {
      case "OPEN_CONFIRM_SAVE_DESIGN":
        return { openConfirmSaveDesign: action.payload};

  
      default:
        return state;
    }
  }