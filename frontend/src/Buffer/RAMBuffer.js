/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Buffer from './Buffer';

export default class RAMBuffer extends Buffer{
    constructor(app){
        super(app);

        this.buffer;

        this.countPastOperation = 0;
    }

    copy(){
        this.buffer = [];
        for(let el of this.app.selectElements){
            this.buffer.push(el.copy());
        }
        this.countPastOperation=0;
    }

    paste(){
        if(this.buffer){
            this.countPastOperation++;
            this.app.pasteElements(this.buffer, this.app.config.moveStep*this.countPastOperation, 0);
        }
    }

    cut(){
        this.buffer = [];
        for(let el of this.app.selectElements){
            this.buffer.push(el.copy());
        }
        this.countPastOperation=0;
        this.app.deleteSelected();
    }
}