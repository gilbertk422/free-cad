/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    dimension: container.resolve('config').dimension,
    showRuler: container.resolve('config').showRuler,

    popup:{
        open:false,
        dimension:container.resolve('config').dimension,
        showRuler: container.resolve('config').showRuler
    }
};

export default function preferencesReducer(state = initialState, action) {
    let res={...state};
    switch (action.type) {
        case "APPLY_PREFERENCES":
            app.config.dimension = state.popup.dimension;
            app.config.showRuler = state.popup.showRuler;
            res.dimension = state.popup.dimension;
            res.showRuler = state.popup.showRuler;
            res.popup.open=false;
            break;
        case "OPEN_PREFERENCE_POPUP":
            res.popup.open=true;
            break;
        case "CLOSE_PREFERENCE_POPUP":
            res.popup.dimension=state.dimension;
            res.popup.showRuler=state.showRuler;
            res.popup.open=false;
            break;
        case "UPDATE_DIMENSION":
            res.popup.dimension = action.dimension;
            if(action.apply) {
                res.dimension = action.dimension;
                app.config.dimension = action.dimension;
            }
            break;
        case "UPDATE_SHOW_RULER":
            res.popup.showRuler=action.showRuler;
            break;
    }
    return res;
}
