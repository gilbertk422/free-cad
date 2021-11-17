/**
 * Created by dev on 11.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

export default class ChangeFontSizeCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} fontSize
     */
    constructor(document, elements, fontSize){
        super(document, elements);

        if(!elements || elements.length<1){
            throw new Exception('For use the function must be selected at least one Text element!');
        }

        for(let element of elements) {
            if (!element instanceof Text) {
                throw new Exception('For use the function must be selected only Text elements!');
            }
        }

        this.fontSize=parseFloat(fontSize);

        this.name= 'ChangeFontSizeCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let element of this.elements) {
            element.fontSize = this.fontSize;
        }
        return true;
    }
}