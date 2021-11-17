/**
 * Created by dev on 28.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class Confirmation{

    /**
     *
     * @param {String} message
     * @param {function} okCallback
     * @param {function} cancelCallback
     */
    constructor(message, okCallback, cancelCallback){
        container.resolve('confirmChangeArcToSplinesDialog').modalOpenConfirmation(message, okCallback, cancelCallback);
    }

    
    
}