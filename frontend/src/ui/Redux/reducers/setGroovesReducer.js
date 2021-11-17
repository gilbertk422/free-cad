/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openSetGrooves: false
  };
  
  export default function setGroovesReducer(state = initialState, action) {
    // console.log(state,'priceReducer')
    switch (action.type) {
      case "OPEN_SET_GROOVES":
        return { openSetGrooves: action.payload};

   
      default:
        return state;
    }
  }