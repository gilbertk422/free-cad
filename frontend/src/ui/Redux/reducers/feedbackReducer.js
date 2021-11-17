/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    openFeedback: false,
    category:"Drawing",
    email:"",
    message:"",
    addDrawing:true,
    blockSendButton:false,
    needValidate:false,
    errors:[]
};
  
export default function feedbackReducer(state = initialState, action) {
    let errors = [];


   switch (action.type) {
       case "OPEN_FEEDBACK":
           return {...state, openFeedback: true};
       case "CLOSE_FEEDBACK":
           return {...initialState};

       case "CHANGE_FEEDBACK_CATEGORY":
           return {...state, category: action.category, errors};
       case "CHANGE_FEEDBACK_EMAIL":
           if(state.needValidate) {
               errors = validate({email:action.email, message:state.message});
           }
           return {...state, email: action.email, errors};
       case "CHANGE_FEEDBACK_MESSAGE":
           if(state.needValidate) {
               errors = validate({email:state.email, message:action.message});
           }
           return {...state, message: action.message, errors};
       case "CHANGE_FEEDBACK_ADD_DRAWING":
           return {...state, addDrawing: action.addDrawing, errors};
       case "SEND_FEEDBACK":
           errors = validate(state);
           if (errors.length>0) {
               return {...state, errors, needValidate: true};
           }else{
               sendMessage(state);
               return {...state, blockSendButton: true, errors, needValidate: true};
           }
       default:
           return state;
   }
}


function validate(state){
    let errors = [];
    Helper.Validator.validateRequiredField(errors, state.message, "message");
    Helper.Validator.validateEmail(errors, state.email, "email");

    return errors;
}

function sendMessage(state){
    if(state.addDrawing) {
        let loader = container.resolve('fileLoaderFactory', 'xml');
        loader.getBlobData(app.currentDocument).then((design) => {
            sendData(state, design);
        });
    }else{
        setTimeout(()=>{
            sendData(state);
        }, 0);
    }
}

function sendData(state, design=null){
    let fd = new FormData();
    if(design) {
        fd.append('design', design, app.currentDocument.fileName == "" ? "NewDocument.emsx" : app.currentDocument.fileName);
    }
    fd.append('category', state.category);
    fd.append('email', state.email);
    fd.append('message', state.message);
    Helper.Request.httpPost(Helper.Request.protocolName+'//'+window.location.hostname+':'+container.resolve('config').backpost+'/feedback', fd,(response)=>{
        if(response) {
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Thank you - we will reply shortly. ");
            store.dispatch({type:"CLOSE_FEEDBACK"});
        }else{
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("We were unable to process your request, please try again later.");
        }
    });
}