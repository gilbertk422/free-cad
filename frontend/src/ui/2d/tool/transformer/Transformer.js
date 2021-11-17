/**
 * Created by dev on 15.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import GraphicElement from '../../../../model/GraphicElement';
import Exception from "../../../../Exception";

/**
 * The class need for changing elements
 *
 * If the object start transforming some element, than the object remove the element from document
 * and after transforming the object must return the element to document and execute command
 */
export default class Transformer{
    constructor(document){
        this.document = document;
        this._elements = [];

        this.board = container.resolve('mainBoard'); //todo: maybe set from the using place

        this._drag = false;
    }

    /**
     * @param {Array.<Element>} elements
     */
    addElements(elements){
        for(let element of elements) {
            this._elements.push(element.copy());
        }
    }
    
    removeElemens(){
        this._elements=[];
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseDown(point){
        this._drag=false;
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseUp(point){
        return !this._drag;
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseMove(point){
        this._drag = true;
    }

    /**
     * @return {Promise}
     */
    render(board){
        throw new Exception(`The method doesn't have implementation`);
    }

    /**
     * @return {Promise.<Array.<GraphicElement>>}
     */
    getTransformElements(){
        throw new Exception(`The method doesn't have implementation`);
    }
}