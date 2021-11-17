/**
 * Created by dev on 31.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class Observable{
    constructor(){
        this.handlers = [];
    }

    /**
     * @param {string} eventName
     * @param handler
     */
    addHandler(eventName, handler){
        if(!this.handlers[eventName]){
            this.handlers[eventName]=[];
        }
        this.handlers[eventName].push(handler);
    }

    /**
     * @param handler
     * @return {boolean} false if handler not found
     */
    removeHandler(handler){
        for(let i=0; i<this.handlers.length; i++) {
            for (let j=0; j<this.handlers[i].length; i++) {
                if(handler==this.handlers[i][j]){
                    this.handlers[i].splice(j,1);
                    return true;
                }
            }
        }
        return false;
    }
    _notifyHandlers(eventName,data){
        if(this.handlers[eventName]){
            for(let handler of this.handlers[eventName]){
                try {
                    handler(data);
                }catch (e){
                    console.group();
                        console.error('The handler threw exception.');
                        console.log(handler);
                        console.log(e);
                    console.groupEnd();
                }
            }
        }
    }

}