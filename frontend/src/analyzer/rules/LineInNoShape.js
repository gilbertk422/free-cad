/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import RemoveElementSolution from './../solutions/RemoveElement';
import ShapeBuilder from './../ShapeBuilder';

import Arc from './../../model/elements/Arc';

export default class LineInNoShape extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);
        this.errorMessage = `Error: The indicated shape is not closed. Please draw only closed shapes with no open ends or gaps.
         If the problem is not visible, select one of the lines and nudge it via an arrow key or zoom in to find a gap.`;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();
        let redElement = this.getLineByDocument(res[0].previewDocument);
        redElement._renderer.error=true;

        res.push(this.createRemoveElementSolution());
        return res;
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        return this.getLineByDocument(this.document)!=null;
    }

    /**
     * @return {Solution}
     * @private
     */
    createRemoveElementSolution(){
        let line = this.getLineByDocument(this.document);

        let previewDoc = this.document.getSnapshot();
        let line2 = this.getLineByDocument(previewDoc);
        previewDoc.removeElement(line2);

        return new RemoveElementSolution(this.document, [line], previewDoc);
    }


    /**
     *
     * @param {Document} document
     * @return {GraphicElement|null}
     * @private
     */
    getLineByDocument(document){
        this.shapeBuilder = new ShapeBuilder(document);
        let shapes = this.shapeBuilder.buildShapes();
        for(let shape of shapes){
            if(shape.elements.length==1){
                if(shape.elements[0] instanceof Arc && shape.elements[0].incrementAngle==360){
                    continue;
                }
                return shape.elements[0];
            }
        }
        return null;
    }
}
