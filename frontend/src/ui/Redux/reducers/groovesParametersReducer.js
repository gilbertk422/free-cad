/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    topDepth:0,
    width:0,
    horisontalDepth:0,
    groovesData:[]
  }
  
  export default function groovesParametersReducer(state = initialState, action) {
    // console.log(state,'priceReducer')
    switch (action.type) {
  
      case "UPDATE_GROOVES_DATA":
        return { 
          topDepth: action.payloadTopDepth,
          width: action.payloadWidth,
          horisontalDepth: action.payloadHorisontalDepth,
          groovesData: action.payloadGrooves
        };
   
      default:
        return state;
    }
  }