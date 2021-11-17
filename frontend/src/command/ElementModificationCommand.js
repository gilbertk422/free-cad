/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './Command';

export default class ElementModificationCommand extends Command{
    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     */
    constructor(document, elements){
        super(document);
        this.elements = elements;

        /**
         * If the variable is true after executing the command will be selected first element from the elements list.
         * @type {boolean}
         */
        this.selectOneElement=false;
    }
    
    
}