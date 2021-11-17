/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import ShapeBuilder from "../ShapeBuilder";
import Document from "../../model/Document";

export default class ShapeSize extends Rule{

    /**
     * @param {Document} document
     */
    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Error: The highlighted shape is too large. Please reduce to at most 47 x 23 inch.";
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

        return res;
    }


    getErrorShape(doc){
        let shapeBuilder = new ShapeBuilder(doc);

        let shapes = shapeBuilder.buildShapes();

        for(let shape of shapes){
            let extreme = Document.getExtrenumForElements(shape.elements);
            let w = extreme.max.x-extreme.min.x;
            let h = extreme.max.y-extreme.min.y;
            if(Math.max(h,w)/25.4>47 || Math.min(h,w)/25.4>23 ){
                return shape;
            }
        }
        return null;
    }
}