/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import ShapeBuilder from "../ShapeBuilder";
import Document from "../../model/Document";
import RemoveElementSolution from './../solutions/RemoveElement';

export default class ShapeSize extends Rule{

    /**
     * @param {Document} document
     */
    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Error: The highlighted shape is too small.";
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        let shape = this.getErrorShape(this.document);
        return shape!=null;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();

        let shape = this.getErrorShape(res[0].previewDocument);

        for(let shapeel of shape.elements){
            shapeel._renderer.error=true;
        }

        res.push(this._createRemoveSolution())

        return res;
    }


    /**
     * @return {Solution}
     * @private
     */
    _createRemoveSolution(){
        let shape = this.getErrorShape(this.document);

        let previewDoc = this.document.getSnapshot();
        let shape2 = this.getErrorShape(previewDoc);
        for(let el of shape2.elements) {
            previewDoc.removeElement(el);
        }

        return new RemoveElementSolution(this.document, shape.elements, previewDoc);
    }

    getErrorShape(doc){
        let shapeBuilder = new ShapeBuilder(doc);

        let shapes = shapeBuilder.buildShapes();

        for(let shape of shapes){
            if(shape.square<0.2){
                return shape;
            }
        }
        return null;
    }
}