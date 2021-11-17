/**
 * Created by dev on 09.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Renderable from './../Renderable';
import Document from '../../../model/Document';
import Point from '../../../model/math/Point';
import Cursor from './Cursor';



export default class Toll extends Renderable{
    /**
     * @param {Document} document
     */
    constructor(document){
        super();
        this._document = document;
        this.cursor = new Cursor();

        this.mousePosition = new (container.resolve('math')).Point();
    }

    set document(doc){
        this._document=doc;
    }

    get document(){
        return this._document;
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseMove(point, e){
        this.mousePosition=point;
        return false;
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseDbClick(point, e){
        throw new Exception("The method doesn't have implementation");
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseClick(point, e){
        throw new Exception("The method doesn't have implementation");
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing anyGraphicElement GraphicElement
     */
    mouseDown(point, e){
        throw new Exception("The method doesn't have implementation");
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseUp(point, e){
        throw new Exception("The method doesn't have implementation");
    }

    /**
     * @inheritDoc //todo: the method must return promise
     */
    render(board){
        if(this.cursor) {
            this.cursor.render(this.mousePosition);
        }
    }
}