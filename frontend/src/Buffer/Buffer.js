/**
 * Created by dev on 11.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class Buffer{
    constructor(app){
        this.app=app;
    }

    copy(){
        throw new Exception("The method doesn't have implementation.");
    }

    paste(){
        throw new Exception("The method doesn't have implementation.");
    }

    cut(){
        throw new Exception("The method doesn't have implementation.");
    }
}