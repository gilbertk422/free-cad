/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    tool:"Pointer"
};

let disp = true;

container.resolve('app').addHandler('changeTool', (tool)=>{
    if(disp) {
        store.dispatch({type: "SET_BORDER_TOOL", toolName: tool.name, notSetToApp: true});
    }
});

export default function borderToolPanelReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_BORDER_TOOL":
            if(!action.notSetToApp) {
                disp=false;
                if(app.setTool(action.toolName)){
                    disp=true;
                    return {...state, tool:action.toolName};
                }
                disp=true;
            }else{
                return {...state, tool:action.toolName};
            }
        default:
            return state;
    }
}