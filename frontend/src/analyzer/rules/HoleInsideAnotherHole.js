/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from "../Rule";
import ShapeBuilder from "../ShapeBuilder";
import GraphicElement from "../../model/GraphicElement";
import RemoveElement from "../solutions/RemoveElement";

export default class HoleInsideAnotherHole extends Rule{

    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Error: The highlighted hole or cutout is inside another hole or cutout. Please remove it.";
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

        let removePreview = this.document.getSnapshot();
        errorShape = this.getIncorrectShape(removePreview);
        if(errorShape){
            for(let el of errorShape.elements){
                removePreview.removeElement(el);
            }
        }

        let solution = new RemoveElement(this.document, this.getIncorrectShape(this.document).elements, removePreview);

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
        let allShapes = shapeBuilder.buildShapes(false);

        let shapes = this.getInsideShapes(allShapes);
        if(shapes.length>0){
            shapes = this.getInsideShapes(shapes);
            if(shapes.length>0){
                return shapes[0];
            }
        }
        return null;
    }

    getInsideShapes(allShapes){
        let shapes = allShapes.map(shape=>{return {shape:shape, out:true}});

        for(let i=0; i<shapes.length; i++){
            for(let j=0; j<shapes.length; j++){
                if(i!=j && shapes[i].shape.isContain(shapes[j].shape)) {
                    shapes[j].out = false;
                }
            }
        }
        return shapes.filter(el=>(!el.out)&&(el.shape.height==GraphicElement.AirInside)).map(el=>el.shape);
    }
}