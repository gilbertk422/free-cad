/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openExpertNotice:false,
    expertNoticeText:'',
    options:  [
      { text: "Text-button1", callback: () => console.log("param1")},
      { text: "Text-button2", callback: () => console.log("param2")},
      { text: "Text-button3", callback: () => console.log("param3")},
      { text: "Text-button4", callback: () => console.log("param4")},
      { text: "Text-button5", callback: () => console.log("param5")}
      ],
    callbackOK:() => console.log("OK"),
    callbackCancel:() => console.log("Cancel"),   
  };
  
  export default function expertNoticeReducer(state = initialState, action) {
    // console.log(action)
      switch (action.type) {
        case "OPEN_EXPERT_NOTICE":
          return { 
            openExpertNotice: action.payload, 
            expertNoticeText:action.payloadText,
            options: action.payloadOptions,
            callbackOK:action.payloadOK,
            callbackCancel:action.payloadCancel
           };
        default:
          return state;
    }
  }