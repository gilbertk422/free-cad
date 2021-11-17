/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import RemoveElementSolution from './../solutions/RemoveElement';
import ShapeBuilder from './../ShapeBuilder';
import Exception from "../../Exception";
import LineElement from "../../model/elements/LineElement";
import Arc from './../../model/elements/Arc';
import AddConnectLine from "../solutions/AddConnectLine";
import Extend from "../solutions/Extend";
import Intersect from '../../model/math/algorithms/intersects/Intersect';

export default class NotClosedShape extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);
        this.errorMessage = `Error: The indicated shape is not closed.
        Please draw only closed shapes with no open ends or gaps. `;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();
        let redElements = this.getLineByDocument(res[0].previewDocument);
        for(let redElement of redElements) {
            redElement._renderer.error = true;
        }

        let addConnectorSolution = this.createAddElementSolution();
        if(addConnectorSolution) {
            res.push(addConnectorSolution);
        }

        let extendLineSolution = this.createExtendLineSolution();
        if (extendLineSolution) {
            res.push(extendLineSolution);
        }
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
        let elements = this.getLineByDocument(this.document);

        let previewDoc = this.document.getSnapshot();
        let removeElements = this.getLineByDocument(previewDoc);
        for(let removeElement of removeElements) {
            previewDoc.removeElement(removeElement);
        }

        return new RemoveElementSolution(this.document, elements, previewDoc);
    }


    /**
     *
     * @param {Document} document
     * @return {Array.<GraphicElement>|null}
     * @private
     */
    getLineByDocument(document){
        this.shapeBuilder = new ShapeBuilder(document);
        let shapes = this.shapeBuilder.buildShapes(false);
        if(shapes.length>0){
            for(let shape of shapes){
                if(!shape.isClose()){
                    return shape.elements;
                }
            }
        }
        return null;
    }

    /**
     * @return {Solution}
     * @private
     */
    createAddElementSolution(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        let shapes = this.shapeBuilder.buildShapes().filter(shape=>!shape.isClose());
        if(shapes.length>0){
            if(shapes.length>1){
                let points = [];
                for(let shape of shapes) {
                    points.push(...shape.getExtremePoints());
                }
                let minLength = points[0].distanceTo(points[1]);
                let element = new LineElement(points[0], points[1]);
                for(let i=0; i<points.length-1; i++){
                    for(let j=i+1; j<points.length; j++){
                        let tempLength = points[i].distanceTo(points[j]);
                        if(minLength>tempLength){
                            minLength=tempLength;
                            element = new LineElement(points[i].copy(), points[j].copy());
                        }
                    }
                }
                let lines = this.document.getListSimpleElements().filter(e=>e.typeName=="Line" && (e.lineType.name=="Auto" || e.lineType.name=="Bend"));
                for(let line of lines){
                    if(element.isOverlapping(line)){
                        return null;
                    }
                }
                return new AddConnectLine(this.document, element);
            }else{
                let points = shapes[0].getExtremePoints();
                if(points.length==2){
                    let element = new LineElement(points[0].copy(), points[1].copy());
                    let lines = this.document.getListSimpleElements().filter(e=>e.typeName=="Line" && (e.lineType.name=="Auto" || e.lineType.name=="Bend"));
                    for(let line of lines){
                        if(element.isOverlapping(line, 0)){
                            return null;
                        }
                    }
                    return new AddConnectLine(this.document, element);
                }else{
                    throw new Exception("Shape can't has more then two extreme points!", shape);
                }
            }
        }
        throw new Exception("The document hasn't not closed shapes!", this.document);
    }

    /**
     * 
     * @param {Arc} arc 
     * @param {Point} endPoint 
     * @param {bool} direction true: extend startAngle, false: extend endAngle
     */
    _extendArc(arc, endPoint, direction) {
        if (direction) {
            let line =  new (container.resolve('math')).Line(arc.center, endPoint);
            arc.startAngle = new (container.resolve('math')).Vector(1).getAngle(line.toVector());
        } else {
            let line =  new (container.resolve('math')).Line(arc.center, endPoint);
            arc.endAngle = new (container.resolve('math')).Vector(1).getAngle(line.toVector());
        }

        return arc;
    }

    /**
     * 
     * @param {Line} line 
     * @param {bool} direction true: extend p1, false: extend p2
     */
    _extendLine(line, direction) {

    }

    /**
     * @return {Solution}
     * @private
     */
    createExtendLineSolution(){
        this.shapeBuilder = new ShapeBuilder(this.document);
        let shapes = this.shapeBuilder.buildShapes().filter(shape=>!shape.isClose());
        if(shapes.length>0){
            if(shapes.length>1){
                return null;
            }else{
                let points = shapes[0].getExtremePoints();                
                if(points.length==2){
                    let line1 = shapes[0].elements.find(el => el.extremePoints.find(p => p.compare(points[0])));
                    let line2 = shapes[0].elements.find(el => el.extremePoints.find(p => p.compare(points[1])));

                    if (line1 instanceof Arc && line2 instanceof Arc) {
                        let arc1 = line1;
                        let arc2 = line2;
                        let extDirectionOfArc1 = arc1.extremePoints[0].compare(points[0]) || arc1.extremePoints[0].compare(points[1]) ? true : false;
                        let extDirectionOfArc2 = arc2.extremePoints[0].compare(points[0]) || arc2.extremePoints[0].compare(points[1]) ? true : false;
                        
                        return null;
                    } else if (line1 instanceof Arc || line2 instanceof Arc) {
                        let arc = line1 instanceof Arc ? line1 : line2;
                        let straightLine = line1 instanceof Arc ? line2 : line1;

                        let fixedPointOfStraightLine = straightLine.p1.compare(points[0]) || straightLine.p1.compare(points[1]) ? straightLine.p2 : straightLine.p1;
                        let extDirectionOfArc = arc.extremePoints[0].compare(points[0]) || arc.extremePoints[0].compare(points[1]) ? true : false;
                        let crossPoint = Intersect.getClosestIntersectPointLineArc(straightLine, arc, fixedPointOfStraightLine);

                        if (crossPoint) {
                            let elements = [new LineElement(fixedPointOfStraightLine.copy(), crossPoint.copy()), this._extendArc(arc.copy(), crossPoint, extDirectionOfArc)];
                            return new Extend(this.document, [line1, line2], elements);
                        }
                        
                        return null;
                    }

                    if (line1._line.isParallel(line2._line)) {
                        return null;
                    }

                    let crossPoint = line1._line.getCrossLinePoint(line2._line);
                    let fixedPointOfLine0 = line1.p1.compare(points[0]) ? line1.p2 : line1.p1;
                    let fixedPointOfLine1 = line2.p1.compare(points[1]) ? line2.p2 : line2.p1;

                    let elements = [new LineElement(fixedPointOfLine0.copy(), crossPoint.copy()), new LineElement(fixedPointOfLine1.copy(), crossPoint.copy())];
                    
                    return new Extend(this.document, [line1, line2], elements);
                }else{
                    throw new Exception("Shape can't has more then two extreme points!", shape);
                }
            }
        }
        throw new Exception("The document hasn't not closed shapes!", this.document);
    }
}
