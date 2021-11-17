/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Arc from './Arc';
import Spline from "./Spline";
import Bend from "../line_types/Bend";
import Intersect from "../math/algorithms/intersects/Intersect";
import Document from "../Document";

let Point = container.resolve('math').Point;


/**
 * A shape is a sequence of graphic elements connected by endpoints.
 * It is necessary for consolidate graphics primitives into more complex parts of a model.
 * May contain information about bends, model height, etc.
 */
class Shape{


    constructor(){

        /** @type Array.<GraphicElement>} */
        this.elements = [];

        /** @type {Array.<LineElement>}> - elements with bend line type*/
        this.bends=[];

        this.baseZ=0;
    }


    /**
     * @return {number}
     * @throws Exception - if the list of elements has different height
     */
    get height(){
        let elements = this.elements.filter(e=>e.lineType.name!="Bend");

        let h = elements[0].height;

        for(let el of elements){
            if(el.height!=h){
                console.trace();
                throw new Exception('All elements of shape must have equals height', [h, el]);
            }
        }
        return h;
    }

    addElement(element){
        if(this.isHas(element)){
            return false;
        }
        this.elements.push(element);
        return true;
    }

    /**
     * @param {LineElement} bend - with Bend line type
     */
    addBend(bend){
        if(bend.lineType instanceof Bend) {
            this.bends.push(bend);
            return true;
        }
        return false;
    }


    /**
     * @param {GraphicElement} element
     * @return {boolean}
     */
    isHas(element){
        for(let el of this.elements){
            if(el.compare(element)){
                return true;
            }
        }
        return false;
    }

    isNear(point, eps){
        let res = false;
        for(let el of this.elements){
            res = res||el.isNear(point, eps);
        }
        return res;
    }

    /**
     * @return {boolean}
     * @throws {Exception} - if the shape has less than two elements
     */
    isClose(){
        if(this.elements.length==1){
            if(this.elements[0] instanceof Arc && this.elements[0].incrementAngle==360){
                return true;
            }
        }

        let countPoints = this.groupShapePoint();

        for(let cp of countPoints){
            if(cp.count!=2){
                return false;
            }
        }
        return true;
    }

    /**
     * @returns {Array.<Point>}
     */
    getExtremePoints(){
        let res = [];

        let countPoints = this.groupShapePoint();

        for(let cp of countPoints){
            if(cp.count!=2){
                res.push(cp.point);
            }
        }


        return res;
    }


    /**
     *
     * @param {Array.<GraphicElement>} elements
     * @return {Array.<{point:Point, elements:Array.<GraphicElement>}>}
     * @private
     */
    groupElementsByPoint(elements){
        /** @type {Array.<{point:Point, elements:Array.<GraphicElement>}>} */
        let res = [];

        for(let el of elements){
            let points = el.extremePoints;
            m: for(let point of points){
                for(let cp of res){
                    if(cp.point.compare(point)){
                        cp.elements.push(el);
                        continue m;
                    }
                }
                res.push({point:point, elements:[el]});
            }
        }

        return res;
    }

    /**
     * @param {number} quality [0.02 - 1] - it is percents of quality. default is 0.1
     * @return {Array.<Point>} - the list of points
     */
    getConsistentlyPoints(quality=null){
        if(quality==null){
            quality = container.resolve('config').discretizationQuality;
        }

        if(this.elements.length==1){
            if(this.elements[0].typeName == 'Arc'){
                return this.elements[0].toPolyLines(50*quality)[0].points;
            }
        }

        /** @type {Array.<{point:Point, elements:Array.<GraphicElement>}>} */
        let pointsByElement = this.groupElementsByPoint(this.elements);

        let findPointWithElement = (element, currentPoint)=>{
            for(let point of pointsByElement){
                if(point!=currentPoint){
                    for(let el of point.elements){
                        if(el.compare(element)){
                            return point;
                        }
                    }
                }
            }
            return null;
        };


        let res = [];

        let startPoint = pointsByElement[0];
        let nextPoint = pointsByElement[0];
        let currentPoint = pointsByElement[0];
        let currentElement = currentPoint.elements[0];
        do{
            currentPoint=nextPoint;
            if(currentPoint.elements[0].compare(currentElement)){
                currentElement=currentPoint.elements[1];
                if(!currentElement){
                    res.push(currentPoint.point);
                    break;
                }
            }else{
                currentElement=currentPoint.elements[0];
            }


            let points = [];
            if(currentElement.typeName == 'Arc'){
                points = currentElement.toPolyLines(50*quality)[0].points;

            }else if(currentElement.typeName == 'Spline'){
                points = currentElement.toPolyLines()[0].points;
            }else{
                points = currentElement.toPolyLines()[0].points;
            }

            if(points.length>2){
                if(points[0].compare(currentPoint.point)) {
                    res.push(...points);
                    // res.splice(res.length-2,1);
                }else{
                    // if(points[points.length-1].compare(currentPoint.point)) {
                        res.push(...points.reverse());
                        // res.splice(res.length-2,1);
                    // }else{
                    //     console.error("The points is not extreme point!");
                    // }
                }
            }else {
                res.push(currentPoint.point);
            }
            nextPoint = findPointWithElement(currentElement, currentPoint);
        }while(nextPoint!=null && !nextPoint.point.compare(startPoint.point));


        let temp = [];
        m: for(let i=0; i<res.length; i++){
            for(let j=i; j<res.length-1; j++){
                if(res[i].compare(res[j+1])){
                    continue m;
                }
            }
            temp.push(res[i]);
        }

        return temp;
    }

    getElementsEndPoints(){
        let res = [];

        for(let el of this.elements){
            let points = el.extremePoints;
            if(!points){
                continue;
            }
            res.push(...points);
        }
        return res;
    }


    /**
     * @returns {Array<{point: Point, count: number}>}
     * @private
     */
    groupShapePoint(){
        let countPoints = [];

        for(let el of this.elements){
            let points = el.extremePoints;
            m: for(let point of points){
                for(let cp of countPoints){
                    if(cp.point.compare(point)){
                        cp.count++;
                        continue m;
                    }
                }
                countPoints.push({point:point, count:1});
            }
        }
        return countPoints;
    }

    /**
     * @param {number} quality [0.02 - 1] - it is percents of quality. default is 0.1
     * @return {PolyLine}
     */
    toPolyLine(quality){
        let points = this.getConsistentlyPoints(quality);
        points.push(points[0].copy());
        return new (container.resolve('math')).PolyLine(points);
    }

    /**
     * @param {Point|Shape} element
     * @param {boolean} [outsidePoints=false] - if this parameter is true, the result will be true if at least one point is in the shape
     * @return {boolean} - true is the point is into the shape or if all points of shape into the shape
     */
    isContain(element, outsidePoints=false){
        //Easy check (need for higher performance)
        if (element instanceof this.constructor || element instanceof CacheShape) {
            let extRect = Document.getExtremumForElements(this.elements).toRect();
            let extElRect = Document.getExtremumForElements(element.elements).toRect();
            let rectPoints = extElRect.points;
            if (!outsidePoints) {
                for (let p of rectPoints) {
                    if (!extRect.contain(p)) {
                        return false;
                    }
                }
            } else {
                let _continue = false;
                for (let p of rectPoints) {
                    if (extRect.contain(p)) {
                        _continue = true;
                        break;
                    }
                }

                if (!_continue) {
                    return false;
                }
            }
        }
        //end Easy check

        //Full check
        let pointsCurrentShape = this.getConsistentlyPoints(0.1);

        let polyLine = this.toPolyLine(0.1);

        if(pointsCurrentShape.length>2) {
            if (element instanceof this.constructor || element instanceof CacheShape) {
                let points = element.getConsistentlyPoints(0.1);

                for (let point of points) {
                    if(outsidePoints){
                        if (Shape.isContainPointRay(point, polyLine)) {
                            return true;
                        }
                    }else {
                        if (!Shape.isContainPointRay(point, polyLine)) {
                            return false;
                        }
                    }
                }
                return !outsidePoints;
            } else if (element instanceof Point) {
                return Shape.isContainPointRay(element, polyLine);
            }else{
                console.warn("Incorrect element argument type", element);
            }
        }
        return false;
    }

    /**
     * the raw method can has an error @see https://habr.com/ru/post/301102/
     * @param {Point} point
     * @param {PolyLine} polyLine
     * @return {boolean}
     * @private
     */
    static isContainPointRay(point, polyLine){
        let res = false;

        let ray1 = new (container.resolve('math')).PolyLine([
            point.copy(),
            new (container.resolve('math')).Point(100006,195221)
        ]);
        let crossPoints = polyLine.getCrossPoints(ray1);
        res = res || crossPoints.length%2!=0;

        let ray2 = new (container.resolve('math')).PolyLine([
            point.copy(),
            new (container.resolve('math')).Point(-100006,195221)
        ]);
        let crossPoints2 = polyLine.getCrossPoints(ray2);
        res = res || crossPoints2.length%2!=0;

        let ray3 = new (container.resolve('math')).PolyLine([
            point.copy(),
            new (container.resolve('math')).Point(-100006,-195221)
        ]);
        let crossPoints3 = polyLine.getCrossPoints(ray3);
        res = res || crossPoints3.length%2!=0;

        let ray4 = new (container.resolve('math')).PolyLine([
            point.copy(),
            new (container.resolve('math')).Point(100006,-195221)
        ]);
        let crossPoints4 = polyLine.getCrossPoints(ray4);
        res = res || crossPoints4.length%2!=0;

        res = res || polyLine.isNear(point, 1E-5);

        return res;
    }


    /**
     *
     * @param {Array.<GraphicElement>} elements
     * @return {boolean}
     */
    isCrossed(elements){
        for(let i=0; i< elements.length; i++){
            let points = Intersect.getIntersectPointsWithElements(elements[i], this.elements);
            if(!points){
                return false;
            }
            m: for(let point of points){
                for(let el of this.elements){
                    let elPoints = el.extremePoints;
                    for(let elPoint of elPoints){
                        if(elPoint.compare(point)){
                            continue m;
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    get square(){
        let points = this.getConsistentlyPoints();
        points.push(points[0]);
        let res = 0;
        for(let i=0; i<points.length-1; i++){
            res+=(points[i].x+points[i+1].x)*(points[i+1].y-points[i].y);
        }
        return Math.abs(res)/2;
    }
}

export default class CacheShape extends Shape{
    constructor(){
        super();
        this._consistentlyPoints = [];
    }

    addElement(element) {
        this._consistentlyPoints=[];
        return super.addElement(element);
    }

    getConsistentlyPoints(quality=null){
        for(let cache of this._consistentlyPoints){
            if(cache.quality==quality){
                return cache.points;
            }
        }

        let points = super.getConsistentlyPoints(quality);
        this._consistentlyPoints.push({quality, points});
        return points;
    }
}