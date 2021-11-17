/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from "../Rule";
import ShapeBuilder from "../ShapeBuilder";
import GraphicElement from "../../model/GraphicElement";
import SetZValue from "../solutions/SetZValue";

export default class ZValueOfInnerShape extends Rule{

    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Error: The highlighted inner lines do not have Air Inside for the Z value. Please set Z to Air Inside.";
    }

    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        return this.getIncorrectShape(this.document)!=null;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();
        let preview = this.document.getSnapshot();
        res[0].previewDocument = preview;

        let errorShape = this.getIncorrectShape(preview);
        if(errorShape){
            for(let el of errorShape.elements){
                el._renderer.error=true;
            }
        }

        let solution = new SetZValue(this.document, this.getIncorrectShape(this.document).elements, GraphicElement.AirInside);
        solution.previewDoc=preview;

        res.push(solution);
        return res;
    }

    /**
     *
     * @param {Document} doc
     * @return {Shape|null}
     */
    getIncorrectShape(doc){
        let shapeBuilder = new ShapeBuilder(doc);
        let shapes = shapeBuilder.buildShapes(false).map(shape=>{return {shape:shape, out:true}});

        for(let i=0; i<shapes.length; i++){
            for(let j=0; j<shapes.length; j++){
                if(i!=j && shapes[i].shape.isContain(shapes[j].shape)) {
                    shapes[j].out = false;
                }
            }
        }

        shapes = shapes.filter(el=>!el.out);
        for(let shape of shapes){
            if(shape.shape.height!=GraphicElement.AirInside){
                return shape.shape;
            }
        }
        return null;
    }
}