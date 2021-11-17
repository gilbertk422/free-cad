/**
 * Created by dev on 17.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './command/Command';
let id = 0;

class Node{
    constructor(data, before){
        this.id=id++;
        this.data = data;
        this.next = null;
        this.before = before;
    }
}

export default class CommandHistory{
    constructor(){
        this.head = new Node();
    }

    /**
     * @param {Command} command
     */
    push(command){
        if(!this.head){
            this.head = new Node(command);
        }else{
            if(this.head.next && this.head.next.data.compare(command)){
                this.head = this.head.next;
            }else {
                let temp = new Node(command, this.head);
                this.head.next = temp;
                this.head = temp;
            }
        }
    }

    /**
     * @return {Command|null}
     */
    pop(){
       if(this.head){
           let res = this.head.data;
           if(this.head.before) {
               this.head = this.head.before;
               return res;
           }
       }
        return null;
    }

    /**
     * @return {boolean}
     */
    hasRedo(){
        return this.head && this.head.next!=null;
    }

    /**
     * @return {Command|null}
     */
    getRedo(){
        if(this.hasRedo()) {
            return this.head.next.data;
        }else{
            return null;
        }
    }
}