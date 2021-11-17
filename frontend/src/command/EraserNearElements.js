/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ElementModificationCommand from './ElementModificationCommand';
import Document from '../model/Document';
import LineElement from '../model/elements/LineElement';
import Arc from '../model/elements/Arc';
import Group from '../model/elements/Group';
import Point from '../model/math/Point';
import Shape from './../model/elements/Shape';
import ShapeBuilder from './../analyzer/ShapeBuilder';

export default class EraserNearElements extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Point} point
     * @param {number} eps - the parameter need for not exact calculation
     */
    constructor(document, point, eps){
        super(document, []);

        /** @type {string} */
        this.name = 'EraserNearElements';

        /** @type {Point} */
        this.point=point;

        /** @type {Array.<GraphicElement>} */
        this.newElements = [];

        /** @type {number} */
        this.eps = eps;

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
        let builder = new ShapeBuilder(this.document);
        let shapes = builder.buildShapes(true);
        console.log(shapes);
        let removed = false;

        for(let shape of shapes){
            if(shape.isNear(this.point, this.eps)){
                let intersectShapes = builder.separateShapesByIntersect(shape, true);
                if(intersectShapes.length>1) {
                    for(let ishape of intersectShapes){
                        if(!ishape.isNear(this.point, this.eps)){
                            for(let el of ishape.elements){
                                this.document.addElement(el);
                            }
                        }else{
                            //todo: revert element
                        }
                    }
                }
                this.removeShape(shape);
                removed=true;
            }
        }

        let elements = this._document.getNearElements(this.point, this.eps);
        m: for(let el of elements){
            for(let shape of shapes){
                for(let shapeEl of shape.elements){
                    if(shapeEl.compare(el)){
                        continue m;
                    }
                }
            }
            this.document.removeElement(el);
            removed=true;
        }

        return removed;
    }

    removeShape(shape){
        /** @type {Array.<Group>} */
        let groups = [];

        for (let el of shape.elements) {
            let group = this.getGroupByElement(el);
            if (group) {
                group.removeElement(el);
                groups.push(group);
            } else {
                this.document.removeElement(el);
            }
        }

        for (let group of groups) {
            if (group.elements.length == 0) {
                this.document.removeElement(group);
            }
        }
    }

    getGroupByElement(element){
        for(let el of this.document._elements){
            if(el instanceof Group){
                let simpleElements = el.toSimpleElements();
                for(let groupElement of simpleElements){
                    if(groupElement.compare(element)){
                        return el;
                    }
                }
            }
        }
        return null;
    }

}