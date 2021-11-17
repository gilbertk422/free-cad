/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openTechSupport: false
  };
  
export default function techSupportReducer(state = initialState, action) {
   // console.log(state,'priceReducer')
   switch (action.type) {
       case "OPEN_TECH_SUPPORT":
           return { openTechSupport: true};
       case "CLOSE_TECH_SUPPORT":
           return { openTechSupport: false};
       default:
           return state;
   }
}