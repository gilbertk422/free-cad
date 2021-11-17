/**
 * Created by dev on 28.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

/**
 * @inheritDoc
 */
export default class MoveElementsCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} x
     * @param {number} y
     */
    constructor(document, elements, x, y){
        super(document, elements);

        this.x=x;

        this.y=y;

        this.name= 'MoveElementsCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements) {
            el.move(this.x, this.y);
        }
        return true;
    }
}