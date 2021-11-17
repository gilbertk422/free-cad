/**
 * Created by dev on 12.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import Document from '../model/Document';

import Intersect from '../model/math/algorithms/intersects/Intersect';
import IntersectDataValidator from "./behaviors/IntersectDataValidator";



export default class IntersectElementsCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     */
    constructor(document, elements){
        super(document, elements);

        this.name = 'IntersectElementsCommand';

        this.newElements = [];

        this.selectOneElement=true;

        this.behaviors.push(new IntersectDataValidator());
    }

    /**
     * @inheritDoc
     * @return {boolean} - return true if the command replacing or adding any elements
     */
    isReplacedElements(){
        return this.newElements.length>0;
    }

    /**
     * The realisation of the  @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     * @protected
     */
    getReplaceElements(){
        return this.newElements;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        let intersect = new Intersect(this.document, true);

        let intersected = intersect.intersectElements(this.elements);
        let needSave = false;
        for(let el of intersected){
            if(el.newElements.length>1){
                needSave=true;
                break;
            }
        }
        if(needSave) {
            for (let el of intersected) {
                for (let newElement of el.newElements) {
                    this.newElements.push(newElement);
                    this._document.addElement(newElement);
                }
                this._document.removeElement(el.originElement);
            }
        }
        return needSave;
    }


}
