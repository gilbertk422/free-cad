/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from "../Rule";
import ShapeBuilder from "../ShapeBuilder";
import GraphicElement from "../../model/GraphicElement";
import SetZValue from "../solutions/SetZValue";

export default class SameZValue extends Rule{

    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Error: All outer lines must have the same Z value.";
    }

    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        return this.getErrorShapes(this.document).length>0;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();
        let preview = this.document.getSnapshot();
        res[0].previewDocument = preview;

        let errorShapes = this.getErrorShapes(preview);

        for(let errorShape of errorShapes) {
            for (let el of errorShape.elements) {
                el._renderer.error = true;
            }
        }
        let elements = [];

        let errorShapesOrigin = this.getErrorShapes(this.document);
        for(let errorShape of errorShapesOrigin) {
            elements.push(...errorShape.elements);
        }

        let heights = [];

        m: for(let shape of errorShapesOrigin){
            let h = shape.height;
            for(let height of heights){
                if(height==h){
                    continue m;
                }
            }
            heights.push(h);
        }

        for(let h of heights){
            let solution = new SetZValue(this.document, elements, h);
            solution.previewDoc=preview;
            res.push(solution);
        }
        return res;
    }

    /**
     *
     * @param {Document} doc
     * @return {Array.<Shape>|null}
     */
    getErrorShapes(doc){
        let shapeBuilder = new ShapeBuilder(doc);
        let shapes = shapeBuilder.buildShapes(false).map(shape=>{return {shape:shape, out:true}});

        for(let i=0; i<shapes.length; i++){
            for(let j=0; j<shapes.length; j++){
                if(i!=j && shapes[i].shape.isContain(shapes[j].shape)) {
                    shapes[j].out = false;
                }
            }
        }
        let outerShapes = shapes.filter(el=>el.out).map(el=>el.shape);

        if(outerShapes.length>0){
            let template = outerShapes[0].height;
            for(let i=1; i<outerShapes.length; i++){
                if(template != outerShapes[i].height){
                    return outerShapes;
                }
            }
        }
        return [];
    }
}