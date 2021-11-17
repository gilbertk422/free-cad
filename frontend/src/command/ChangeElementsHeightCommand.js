/**
 * Created by dev on 18.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

export default class ChangeElementsHeightCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} height
     */
    constructor(document, elements, height){
        super(document, elements);

        this._height = height;

        this.name= 'ChangeElementsHeightCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements) {
            el.height=this._height;
        }
        return true;
    }
}