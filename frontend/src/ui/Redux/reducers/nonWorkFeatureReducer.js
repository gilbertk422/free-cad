/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openNonWorkFeature:false,
    // infoText:'Sorry, this feature will be realised in the next versions '
    infoText:''

   
  };
  
  export default function nonWorkFeatureReducer(state = initialState, action) {
      switch (action.type) {
        case "OPEN_NON_WORK_FEATURE":
          return { openNonWorkFeature: action.payload, infoText:action.payloadText };
        default:
          return state;
    }
  }