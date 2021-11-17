/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

export default class CopyDecorator extends ElementModificationCommand{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {ElementModificationCommand} command
     */
    constructor(document, elements, command){
        super(document, elements);
        this.name= 'CopyDecorator';
        this.command = command;
        this.newElements = [];
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements){
            let temp = el.copy();
            temp.generateNewId();
            this._document.addElement(temp);
            this.newElements.push(temp);
        }
        this.command.elements = this.newElements;
        return this.command.executeCommand();
    }

    /**
     * @inheritDoc
     */
    isReplacedElements(){
        return true;
    }

    /**
     * @inheritDoc
     */
    getReplaceElements(){
        if(this.command.isReplacedElements()) {
            return this.command.getReplaceElements();
        }else{
            return this.newElements;
        }
    }
}