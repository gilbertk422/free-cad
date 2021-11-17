/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
    mouseX: 0,
    mouseY: 0
};

export default function mouseCoordinatesReducer(state = initialState, action) {
    if (action.type == "UPDATE_MOUSE_COORDINATES") {
        return {
            mouseX: action.mouseX,
            mouseY: action.mouseY
        };
    }
    return state;
}
