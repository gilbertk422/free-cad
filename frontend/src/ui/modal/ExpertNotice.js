/**
 * Created by dev on 28.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class ExpertNotice{

    /**
     * @param {text} message
     * @param {Array.<{text:string, callback:function}>} options
     * @param {function} okCallback
     * @param {function} cancelCallback
     */
    constructor(message, options, okCallback, cancelCallback){

        /** @type {text} */
        this.message = message;

        /** @type {Array.<{text:string, callback:function}>} */
        this.options = options;

        /** @type {function} */
        this.okCallback = okCallback;

        /** @type {function} */
        this.cancelCallback = cancelCallback;

        /** @type {boolean} */
        this.isShow = false;
    }


    show(){
        this.isShow=true;

        store.dispatch({
            type: "OPEN_EXPERT_NOTICE",
            payload: true,
            payloadText: this.message,
            payloadOptions: this.options,
            payloadOK: this.okCallback,
            payloadCancel: this.cancelCallback
        });
    }

    /**
     * @param {number} index
     */
    chooseOption(index){
        this.isShow=false;
        this.options[index].callback();
    }

    /**
     *
     */
    ok(){
        this.isShow=false;
        this.okCallback();
    }

    /**
     *
     */
    cancel(){
        this.isShow=false;
        this.cancelCallback();
    }

}