/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import RemoveElementSolution from './../solutions/RemoveElement';
import ShapeBuilder from './../ShapeBuilder';
import Arc from './../../model/elements/Arc';
import LineElement from "../../model/elements/LineElement";
import AddConnectLine from "../solutions/AddConnectLine";
import Extend from '../solutions/Extend';
import Move from '../solutions/Move';

export default class TwoLinesInNoShape extends Rule{

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
        let redElements = this.getTwoLinesByDocument(res[0].previewDocument);
        redElements.forEach(line => line._renderer.error=true);

        let addConnectorSolution = this.createAddConnectorSolution();
        if(addConnectorSolution) {
            res.push(addConnectorSolution);
        }

        let extendLinesSolution = this.createExtendLinesSolution();
        if (extendLinesSolution) {
            res.push(extendLinesSolution);
        }

        let moveElementSolution = this.createMoveElementSolution();
        if (moveElementSolution) {
            res.push(moveElementSolution);
        }

        res.push(this.createRemoveElementsSolution());
        return res;
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        return this.getTwoLinesByDocument(this.document)!=null;
    }

    /**
     *
     * @param {Document} document
     * @return {GraphicElement|null}
     * @private
     */
    getTwoLinesByDocument(document){
        this.shapeBuilder = new ShapeBuilder(document);
        let shapes = this.shapeBuilder.buildShapes();

        for(let i = 0; i< shapes.length - 1; i++) {
            for (let j = i + 1; j< shapes.length; j++) {
                if(shapes[i].elements.length != 1 || shapes[j].elements.length != 1) {
                    continue;
                }
                
                if(shapes[i].elements[0] instanceof Arc && shapes[i].elements[0].incrementAngle==360 ||
                    shapes[j].elements[0] instanceof Arc && shapes[j].elements[0].incrementAngle==360) {
                    continue;
                }

                if (shapes[i].elements[0].isOverlapping(shapes[j].elements[0])) {
                    continue;
                }

                return [shapes[i].elements[0], shapes[j].elements[0]];
            }
        }
        
        return null;
    }

    /**
     * @return {Solution}
     * @private
     */
    createRemoveElementsSolution(){
        let lines = this.getTwoLinesByDocument(this.document);

        let previewDoc = this.document.getSnapshot();
        let lines2 = this.getTwoLinesByDocument(previewDoc);
        lines2.forEach(line2 => previewDoc.removeElement(line2));

        return new RemoveElementSolution(this.document, lines, previewDoc);
    }

    /**
     * @return {Solution}
     * @private
     * @description extend two non-parallel straight lines
     */
    createExtendLinesSolution() {
        this.shapeBuilder = new ShapeBuilder(this.document);
        let redElements = this.getTwoLinesByDocument(this.document);
        
        if (redElements) {
            if (!redElements[0] instanceof LineElement || !redElements[1] instanceof LineElement) {
                return null;
            }
            if (redElements[0]._line.isParallel(redElements[1]._line)) {
                return null;
            }

            let crossPoint = redElements[0]._line.getCrossLinePoint(redElements[1]._line);
            let endPoint0 = redElements[0].p1.distanceTo(crossPoint) > redElements[0].p2.distanceTo(crossPoint) ? redElements[0].p1 : redElements[0].p2;
            let endPoint1 = redElements[1].p1.distanceTo(crossPoint) > redElements[1].p2.distanceTo(crossPoint) ? redElements[1].p1 : redElements[1].p2;
            
            let elements = [new LineElement(endPoint0.copy(), crossPoint.copy()), new LineElement(endPoint1.copy(), crossPoint.copy())];
            
            // check overlapping for extended elements
            let previewDoc = this.document.getSnapshot();
            let lines2 = this.getTwoLinesByDocument(previewDoc);
            lines2.forEach(line2 => previewDoc.removeElement(line2));

            let lines = previewDoc.getListSimpleElements().filter(e=>e.typeName=="Line" && (e.lineType.name=="Auto" || e.lineType.name=="Bend"));
            for(let line of lines){
                if(elements[0].isOverlapping(line) || elements[1].isOverlapping(line)){
                    return null;
                }
            }

            return new Extend(this.document, redElements, elements);
        }
        return null;
    }

    /**
     * @return {Solution}
     * @private
     * @description move the first element of two separated lines to second element
     */
    createMoveElementSolution(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        let redElements = this.getTwoLinesByDocument(this.document);
        
        if (redElements) {
            let points0 = redElements[0].extremePoints;
            let points1 = redElements[1].extremePoints;
            let minLength = points0[0].distanceTo(points1[0]);
            let dx = points1[0].x - points0[0].x, dy = points1[0].y - points0[0].y;
            for(let i=0; i<points0.length; i++){
                for(let j=0; j<points1.length; j++){
                    let tempLength = points0[i].distanceTo(points1[j]);
                    if(minLength>tempLength){
                        minLength=tempLength;
                        dx = points1[j].x - points0[i].x;
                        dy = points1[j].y - points0[i].y;
                    }
                }
            }

            let element = redElements[0].copy();
            element.move(dx, dy);

            // check overlapping for moved element
            let previewDoc = this.document.getSnapshot();
            let lines2 = this.getTwoLinesByDocument(previewDoc);
            previewDoc.removeElement(lines2[0]);

            let lines = previewDoc.getListSimpleElements().filter(e=>e.typeName=="Line" && (e.lineType.name=="Auto" || e.lineType.name=="Bend"));
            for(let line of lines){
                if(element.isOverlapping(line)){
                    return null;
                }
            }

            return new Move(this.document, redElements[0], element);
        }
        return null;
    }

    /**
     * @return {Solution}
     * @private
     */
    createAddConnectorSolution(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        let redElements = this.getTwoLinesByDocument(this.document);
        if (redElements) {
            let points0 = redElements[0].extremePoints;
            let points1 = redElements[1].extremePoints;
            let minLength = points0[0].distanceTo(points1[0]);
            let element = new LineElement(points0[0], points1[0]);
            for(let i=0; i<points0.length; i++){
                for(let j=0; j<points1.length; j++){
                    let tempLength = points0[i].distanceTo(points1[j]);
                    if(minLength>tempLength){
                        minLength=tempLength;
                        element = new LineElement(points0[i], points1[j]);
                    }
                }
            }

            // check overlapping for connector
            let lines = this.document.getListSimpleElements().filter(e=>e.typeName=="Line" && (e.lineType.name=="Auto" || e.lineType.name=="Bend"));
            for(let line of lines){
                if(element.isOverlapping(line)){
                    return null;
                }
            }

            return new AddConnectLine(this.document, element);
        }
        throw new Exception("The document hasn't not closed shapes!", this.document);
    }


}
