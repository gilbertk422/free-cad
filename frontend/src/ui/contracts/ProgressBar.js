/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * The interface is describe the single progress bar object.
 * @abstract
 */
export default class ProgressBar{
    constructor(){
        this._value=10;
    }

    /**
     * @param {string} message
     * @abstract
     */
    show(message=""){
    }

    /**
     * @abstract
     */
    hide(){
    }

    /**
     * @param {number} value - [0-100]
     */
    setValue(value){
        this._value=value;
    }
}