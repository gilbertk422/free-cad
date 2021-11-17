/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Shape from './../model/elements/Shape';
import IncidenceMatrix from './../model/math/IncidenceMatrix';
import Auto from './../model/line_types/Auto';
import Bend from "../model/line_types/Bend";
import Intersect from "../model/math/algorithms/intersects/Intersect";
import Document from "../model/Document";

class ShapePoint{
    /**
     *
     * @param {Point} point
     * @param {GraphicElement} element
     */
    constructor(point, element){
        this.point=point;

        /** @type Array.<GraphicElement> }*/
        this.elements = [element];

        this.isColapsed=false;
    }

    removeElement(element){
        for(let i=0; i<this.elements.length; i++){
            if(this.elements[i].compare(element)){
                this.elements.splice(i,1);
                return;
            }
        }
    }

}


/**
 * The class need for building the {@class Shape}`s by the {@class Document} data structure
 */
export default class ShapeBuilder{ //todo: create an interface for declares the public methods
    /**
     * @param {Document} document
     */
    constructor(document){
        this.document=document;

    }

    /**
     * @param {boolean} [withBendLikeSimpleElement = false] - the bends will add to shape elements list
     * @return {Array.<Shape>}
     */
    buildShapes(withBendLikeSimpleElement = false){ //todo: separate to different methods by this param. withBend
        let simpleElements = this.document.getListSimpleElements();

        let elements = simpleElements.filter(el=>{
            return (el.lineType.name=='Auto' || el.lineType.name=='Thread') && el.typeName!="Text"
        });

        if(elements.length==0){
            return [];
        }

        if(withBendLikeSimpleElement){
            let bends = simpleElements.filter(el=>el.lineType.name=='Bend');
            elements.push(...bends);
        }

        let shapes = this.buildShapesByElements(elements, []);

        let res = [];

        m: for(let shape of shapes){ //todo: I think shapes only with bends is important shapes too, so need to fix this bug by another way and remove this cycle
            for(let el of shape.elements){
                if(el.lineType.name != "Bend"){
                    res.push(shape);
                    continue m;
                }
            }
        }

        return res;
    }

    /**
     * @param {Shape} shape
     * @param {boolean} [withBend=false]
     * @return {Array.<Shape>}
     */
    separateShapesByIntersect(shape, withBend=false){
        let intersect = new Intersect(this.document, withBend);
        let intersection = intersect.intersectElements(shape.elements);

        let elements = [];
        for(let i of intersection){
            elements.push(...i.newElements);
        }
        let points = this.getIntersectPoints(shape, intersect);
        return this.buildShapesByElements(elements, points);
    }

    /**
     * @param {Shape} shape
     * @param {Intersect}intersect
     * @returns {[]}
     */
    getIntersectPoints(shape, intersect){
        let points = [];

        let simpleElements = this.document.getListSimpleElements();
        let shapePoints = shape.getElementsEndPoints();
        for(let el of shape.elements){
            let temp = intersect.getIntersectPoints(el);
            m: for(let point of temp){
                for(let p of points){
                    if(p.compare(point)){
                        continue m;
                    }
                }
                k: for(let p of shapePoints){
                    if(p.compare(point)){
                        for(let simple of simpleElements){
                            if(simple.isNear(point, 1E-5)){
                                if(!shape.isHas(simple)){
                                    break k;
                                }
                            }
                        }
                        continue m;
                    }
                }
                points.push(point);
            }
        }

        return points;
    }

    /**
     *
     * @param {Array.<GraphicElement>} elements
     * @param {Array.<Point>} [separatePoints=[]]
     * @return {Array.<Shape>}
     */
    buildShapesByElements(elements, separatePoints=[]){
        if(elements.length==0){
            return [];
        }
        let res = [];
        let shapePoints=ShapeBuilder.fillShapePoints(elements);

        if(separatePoints.length>0){
            let temp = [];
            m: for(let shapePoint of shapePoints){
                for(let separatePoint of separatePoints){
                    if(shapePoint.point.compare(separatePoint)){
                        for(let element of shapePoint.elements){
                            temp.push(new ShapePoint(shapePoint.point, element));
                        }
                        continue m;
                    }
                }
                temp.push(shapePoint);
            }
            shapePoints=temp;
        }else{
            //todo: todo something
        }


        /** @type {IncidenceMatrix} */
        let incidenceMatrix = ShapeBuilder.createIncidenceMatrix(shapePoints);

        /** @type {Array.<Array.<number>>} */
        let connectedComponents = incidenceMatrix.getConnectedComponents();

        for(let i=0; i<connectedComponents.length; i++){
            let tempShape = new Shape();
            for(let j=0; j<connectedComponents[i].length; j++){
                for(let el of shapePoints[connectedComponents[i][j]].elements) {
                    tempShape.addElement(el);
                }
            }
            res.push(tempShape);
        }

        this.addBendsToShapes(res, this.document);

        return res;
    }

    /**
     *
     * @param {Array.<Shape>}shapes
     * @param {Document} doc
     */
    addBendsToShapes(shapes, doc){
        /** @type {Array.<LineElement>} */
        let bends = doc.getListSimpleElements().filter(el=>el.lineType.name=="Bend");
        for(let shape of shapes){
            if(shape.isClose()){
                for(let bend of bends) {
                    try {
                        if (shape.isNear(bend.p1, 1E-3) && shape.isNear(bend.p2, 1E-3)) {
                            shape.addBend(bend);
                        }
                    }catch (e) {
                        console.log(bend, "not caught error when trying to build a 3D model");
                        console.trace("not caught error when trying to build a 3D model")
                    }
                }
            }
        }
    }

    /**
     * @param {Array.<ShapePoint>} shapePoints
     * @return {IncidenceMatrix}
     */
    static createIncidenceMatrix(shapePoints, Eps=1E-2){
        let res = new Array(shapePoints.length);

        for (let i=0; i<shapePoints.length; i++){
            res[i] = new Array(shapePoints.length);
            for (let j=0; j<shapePoints.length; j++){
                res[i][j]=false;
            }
            for(let el of shapePoints[i].elements){
                let exPoints = el.extremePoints;
                let anotherPoint = exPoints[0];
                if(anotherPoint.compare(shapePoints[i].point, Eps)){
                    anotherPoint = exPoints[1];
                }

                for (let j=0; j<shapePoints.length; j++){
                    if(shapePoints[j].point.compare(anotherPoint, Eps)){
                        for(let anotherElement of shapePoints[j].elements){
                            if(anotherElement.compare(el)){
                                res[i][j]=true;
                            }
                        }
                    }
                }


            }
        }
        return new (container.resolve('math')).IncidenceMatrix(res);
    }

    /**
     * @param {Array.<GraphicElement>} simpleElements
     * @return {Array.<ShapePoint>}
     * @private
     */
    static fillShapePoints(simpleElements){
        let shapePoints = [];
        for(let element of simpleElements){
            let points = element.extremePoints;
            if(points){
                for(let p of points){
                    let shapePoint = new ShapePoint(p,element);
                    shapePoints.push(shapePoint);
                }
            }else {
                //todo: check type of element
            }
        }
        let tempShapePoints = [];
        for(let i=0; i<shapePoints.length; i++){
            if(shapePoints[i].isColapsed){
                continue;
            }
            let countPoint = 0;
            for(let j=0; j<shapePoints.length; j++){
                if(shapePoints[i].point.compare(shapePoints[j].point)){
                    countPoint++;
                }
            }
            if(countPoint==2){
                let indexAnotherPoint = -1;
                for(let j=0; j<shapePoints.length; j++){
                    if(shapePoints[i].point.compare(shapePoints[j].point) && j!=i){
                        indexAnotherPoint=j;
                    }
                }
                shapePoints[i].elements.push(shapePoints[indexAnotherPoint].elements[0]);
                shapePoints[indexAnotherPoint].isColapsed = true;
                shapePoints[i].isColapsed = true;
            }
            tempShapePoints.push(shapePoints[i]);
        }
        return tempShapePoints;
    }

}