/**
 * Created by dev on 18.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import Group from './../model/elements/Group';

export default class UngroupCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     */
    constructor(document, elements){
        super(document, elements);

        this.name= 'UngroupCommand';

        this.sawUngroup = false;
        this.newElements = [];

        this.selectOneElement=true;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements) {
            if(el.typeName == 'Group' || el.typeName == 'Text') {
                let nativeElement = el.typeName == 'Group'?el:el.convertToGeometries();
                for(let element of nativeElement.elements) {
                    this.newElements.push(element);
                    this._document.addElement(element);
                }
                this.sawUngroup=true;
                this._document.removeElement(el);
            }
        }
        return this.sawUngroup;
    }

    isReplacedElements(){
        return this.sawUngroup;
    }

    /**
     * The realisation of the  @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     * @protected
     */
    getReplaceElements(){
        return this.newElements;
    }
}