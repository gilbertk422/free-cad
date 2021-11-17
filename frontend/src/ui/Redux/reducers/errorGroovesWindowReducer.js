/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openErrorGrooves: false
  };
  
  export default function errorGroovesWindowReducer(state = initialState, action) {
    // console.log(state,'priceReducer')
    switch (action.type) {
      case "OPEN_ERROR_GROOVES":
        return { openErrorGrooves: action.payload};

      default:
        return state;
    }
  }