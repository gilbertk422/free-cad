/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ElementModificationCommand from './ElementModificationCommand';

import LineElement from '../model/elements/LineElement';

export default class ChangeLineLengthCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} length
     */
    constructor(document, elements, length){
        super(document, elements);

        if(!elements || elements.length!=1){
            throw new Exception('For use the function must be selected only one Line element!');
        }
        if(!elements[0] instanceof LineElement){
            throw new Exception('For use the function must be selected Line element!');
        }

        this.length=length;

        this.name= 'ChangeLineLengthCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        /** @type {Line} */
        let line  = this.elements[0]._line.copy();
        line.setLength(this.length);
        this.elements[0].p2 = line._p2;
        return true;
    }
}