/**
 * Created by dev on 11.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import ChangeFontLoader from "./behaviors/ChangeFontLoader";

export default class ChangeFontCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {string} fontName
     */
    constructor(document, elements, fontName){
        super(document, elements);

        if(!elements || elements.length<1){
            throw new Exception('For use the function must be selected at least one Text element!');
        }

        for(let element of elements) {
            if (!element.typeName=="Text") {
                throw new Exception('For use the function must be selected only Text elements!');
            }
        }


        this.behaviors.push(new ChangeFontLoader());

        this.fontName = fontName;
        this.font = null;

        this.name= 'ChangeFontCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let element of this.elements) {
            element.font = this.font;
        }
        return true;
    }
}