/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from "../Rule";
import ShapeBuilder from "../ShapeBuilder";
import RemoveElementSolution from "../solutions/RemoveElement";
import Arc from "../../model/elements/Arc";

export default class CrossItself extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);
        this.errorMessage = `Error: The highlighted shape crosses itself. Please use separate shapes.`;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();
        let redElements = this.getCrossingShape(res[0].previewDocument);
        for(let el of redElements) {
            el._renderer.error = true;
        }
        return res;
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        return this.getCrossingShape(this.document)!=null;
    }


    /**
     *
     * @param {Document} document
     * @return {Array.<GraphicElement>|null}
     * @private
     */
    getCrossingShape(document){
        this.shapeBuilder = new ShapeBuilder(document);
        let shapes = this.shapeBuilder.buildShapes();
        for(let shape of shapes){
            if(shape.isCrossed(shape)){
                return shape.elements;
            }
        }
        return null;
    }

}