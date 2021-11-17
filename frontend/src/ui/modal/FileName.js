/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
export default class FileName{

    /**
     *
     * @param {function} okCallback
     * @param {function} cancelCallback
     */
    constructor(okCallback, cancelCallback){
        this.okCallback=okCallback;
        this.cancelCallback=cancelCallback;
    }

    show(){
        store.dispatch({ type: "OPEN_FILE_NAME_MODAL", open: true, okCallback:this.okCallback, cancelCallback:this.cancelCallback});
    }
}