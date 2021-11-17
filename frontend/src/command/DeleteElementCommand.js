/**
 * Created by dev on 17.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './Command';

export default class DeleteElementCommand extends Command{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     */
    constructor(document, elements){
        super(document);

        this._elements=elements;

        this.name= 'DeleteElementCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this._elements) {
            this._document.removeElement(el);
        }
        
        return true;
    }
}