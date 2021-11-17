/**
 * Created by dev on 11.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

import Text from '../model/elements/Text';

export default class ChangeTextCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {string} text
     */
    constructor(document, elements, text){
        super(document, elements);

        if(!elements || elements.length!=1){
            throw new Exception('For use the function must be selected only one Text element!');
        }
        if(!elements[0] instanceof Text){
            throw new Exception('For use the function must be selected Text element!');
        }

        this.text=text;

        this.name= 'ChangeTextCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        this.elements[0].text=this.text;
        return true;
    }
}