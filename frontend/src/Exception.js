/**
 * Created by dev on 26.12.18.
 * Copyright (c) 2019 Micro Logic Corp.
 */
export default class Exception{
    constructor(massage, data){
        this.data = data;
        this.message = massage;
        console.info("New Exception with message: "+this.message);
    }

    toString(){
        if(this.data){
            return this;
        }
        return this.message
    };
}