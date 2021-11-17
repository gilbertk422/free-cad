/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import {combineReducers} from 'redux';
import preferencesReducer from './reducers/preferencesReducer';
import mouseCoordinatesReducer from './reducers/mouseCoordinatesReducer';
import machineWindowReducer from './reducers/machineWindowReducer';
import confirmationReducer from './reducers/confirmationReducer';
import priceReducer from './reducers/priceReducer';
import orderWindowReducer from './reducers/orderWindowReducer';
import toolsPanelReducer from './reducers/toolsPanelReducer';
import diameterToolsReducer from './reducers/diameterToolsReducer';
import movingReducer from './reducers/movingReducer';
import summaryWindowReducer from './reducers/summaryWindowReducer';
import nonWorkFeatureReducer from './reducers/nonWorkFeatureReducer';
import expertNoticeReducer from './reducers/expertNoticeReducer';
import setGroovesReducer from './reducers/setGroovesReducer';
import groovesParametersReducer from './reducers/groovesParametersReducer';
import errorGroovesWindowReducer from './reducers/errorGroovesWindowReducer';
import removeGroovesReducer from './reducers/removeGroovesReducer';
import confirmSaveDesignReducer from './reducers/confirmSaveDesignReducer';
import fileNameModalReducer from '../React/modal/FileName/FileNameModalReducer';
import cornerWindowReducer from './reducers/cornerWindowReducer';
import divideWindowReducer from './reducers/divideWindowReducer';
import simplifyWindowReducer from './reducers/simplifyWindowReducer';
import techSupportReducer from './reducers/techSupportReducer';
import feedbackReducer from './reducers/feedbackReducer';
import zipCodeWindowReducer from './reducers/zipCodeWindowReducer';
import borderToolPanelReducer from './reducers/borderToolPanelReducer';
import propertyBarReducer from './reducers/propertyBarReducer';




if(container.resolve('mobileDetector').mobile()==null) {
    container.resolve('mainBoard').addHandler("mouseMove", e => {
        store.dispatch({type: "UPDATE_MOUSE_COORDINATES", mouseX: e.x, mouseY: e.y});
    });
}





export default combineReducers({
    fileNameModalReducer,
    preferencesReducer,
    mouseCoordinatesReducer,
    machineWindowReducer,
    confirmationReducer,
    nonWorkFeatureReducer,
    expertNoticeReducer,
    priceReducer,
    orderWindowReducer,
    toolsPanelReducer,
    propertyBarReducer,
    diameterToolsReducer,
    movingReducer,
    summaryWindowReducer,
    setGroovesReducer,
    groovesParametersReducer,
    errorGroovesWindowReducer,
    removeGroovesReducer,
    confirmSaveDesignReducer,
    cornerWindowReducer,
    techSupportReducer,
    feedbackReducer,
    divideWindowReducer,
    zipCodeWindowReducer,
    borderToolPanelReducer,
    simplifyWindowReducer
})
