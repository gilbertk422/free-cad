/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Group from "../../../elements/Group";
import LineElement from "../../../elements/LineElement";
import Arc from "../../../elements/Arc";
import Spline from "../../../elements/Spline";
import LineArcIntersector from "./LineArc";
import ArcArcIntersector from "./ArcArc";
import Auto from "../../../line_types/Auto";
import Bend from "../../../line_types/Bend";
import Bezier from "bezier-js";


let lineArcIntersector = new LineArcIntersector();
let arcArcIntersector = new ArcArcIntersector();

export default class Intersect{

    /**
     * @param {Document} document
     * @param {boolean} [withBend=false]
     */
    constructor(document, withBend=false){

        this.document = document;

        this.simpleElements = document.getListSimpleElements().filter(el=>el.lineType.name=="Auto" || (withBend && el.lineType.name=="Bend") || el.lineType.name=="Thread" );
    }


    /**
     *
     * @param {GraphicElement} element
     * @param {number} Eps
     * @return {Array.<Point>}
     */
    getIntersectPoints(element, Eps=0.0001){
        return Intersect.getIntersectPointsWithElements(element, this.simpleElements);
    }

    static getIntersectPointsWithElements(element, elements){
        let points = [];
        if(element instanceof LineElement) {
            for(let el of elements){
                if(el.compare(element)){
                    continue;
                }else if(el instanceof LineElement) {
                    points.push(...Intersect._intersectPointsLineLine(element, el));
                }else if(el instanceof Arc){
                    points.push(...lineArcIntersector.getIntersectPoints(element, el));
                }else if(el instanceof Spline){
                    points.push(...Intersect._intersectPointsLineSpline(element, el));
                }
            }
        }else if(element instanceof Arc) {
            for(let el of elements){
                if(el.compare(element)){
                    continue;
                }else if(el instanceof LineElement) {
                    points.push(...lineArcIntersector.getIntersectPoints(el, element));
                }else if(el instanceof Arc){
                    points.push(...arcArcIntersector.getIntersectPoints(element, el));
                }else if(el instanceof Spline){
                    points.push(...Intersect._intersectPointsArcSpline(element, el));
                }
            }
        }else if(element instanceof Spline) {
            for(let el of elements){
                if(el.compare(element)){
                    continue;
                }else if(el instanceof LineElement) {
                    points.push(...Intersect._intersectPointsLineSpline(el, element));
                }else if(el instanceof Arc){
                    points.push(...Intersect._intersectPointsArcSpline(el, element));
                }else if(el instanceof Spline){
                    points.push(...Intersect._intersectPointsSplineSpline(element, el));
                }
            }
        }else{
            throw new Exception('The elements doesn\'t support intersection!', element);
        }

        let temp = [];

        m: for(let i=0; i<points.length; i++){
            for(let j=0; j<temp.length; j++){
                if(points[i].compare(temp[j])){
                    continue m;
                }
            }
            temp.push(points[i]);
        }
        return temp;
    }


    /**
     * @param elements
     * @return {Array.<{originElement:GraphicElement, newElements:Array.<GraphicElement>}>}
     */
    intersectElements(elements){
        let res = [];
        for(let el of elements){
            let newElements = this.intersectElement(el);
            if(newElements && newElements.length>0){
                res.push({originElement:el, newElements:newElements});
            }else{
                res.push({originElement:el, newElements:[el]});
            }
        }
        return res;
    }

    /**
     * This method intersects the elements. To improve the accuracy of the system composed of a pair of equations
     * for each type of primitive.
     * @param {GraphicElement} element
     * @return {Array.<GraphicElement>|null}
     */
    intersectElement(element){
        if(element instanceof Group) {
            return this._intersectGroup(element);
        }
        if(element.typeName=="Spline"){
            return this._intersectSpline(element);
        }

        let points = this.getIntersectPoints(element);

        if(points.length==0){
            return null;
        }else {
            return element.intersectByPoints(points);
        }
    }


    /**
     * @param {Group} element
     * @return {Array.<GraphicElement>|null}
     * @private
     */
    _intersectGroup(element){
        let res = null;
        for(let el of element.elements){
            let newElements = this.intersectElement(el);
            if(newElements){
                if(!res) {
                    res = newElements;
                }else{
                    res.push(...newElements);
                }
            }
        }
        return res;
    }


    /**
     * @param {Spline} spline
     * @returns {Array<Spline>}
     * @private
     */
    _intersectSpline(spline){
        let t = [0];

        let curve = new Bezier(spline.startPoint.x, spline.startPoint.y,
            spline.controlPoint1.x, spline.controlPoint1.y,
            spline.controlPoint2.x, spline.controlPoint2.y,
            spline.endPoint.x, spline.endPoint.y);


        for(let el of this.simpleElements){
            if(el.compare(spline)){
                continue;
            }else if(el instanceof LineElement) {
                t.push(...curve.intersects(el));
            }else if(el instanceof Arc){
                // points.push(...Intersect._intersectPointsArcSpline(el, element));
            }else if(el instanceof Spline){
                let curve2 = new Bezier(el.startPoint.x, el.startPoint.y,
                    el.controlPoint1.x, el.controlPoint1.y,
                    el.controlPoint2.x, el.controlPoint2.y,
                    el.endPoint.x, el.endPoint.y);

                let tList = curve.intersects(curve2, 0.0001);
                //todo: this method has some time error (is spline end very near another spline it should find t but isn't)

                for(let pair of tList){
                    let temp = pair.split("/").map(function(v) { return parseFloat(v); });
                    t.push(temp[0]);
                }
            }
        }
        t = t.sort((a,b)=>a-b);
        t.push(1);
        return spline.splitByT(t);
    }


    /**
     *
     * @param {LineElement} line1
     * @param {LineElement} line2
     * @return {Array.<Point>}
     * @private
     */
    static _intersectPointsLineLine(line1, line2){
        let res = line1._line.getCrossPoint(line2._line);
        if(!res){
            return [];
        }
        return [res];
    }

    /**
     *
     * @param {LineElement} line
     * @param {LineElement} arc
     * @return {Point|null}
     */
    static getClosestIntersectPointLineArc(line, arc, point){
        return lineArcIntersector.getClosestIntersectPoint(line, arc, point);
    }

    /**
     * @param {LineElement} line
     * @param {Spline} spline
     * @return {Array.<Point>}
     * @private
     */
    static _intersectPointsLineSpline(line, spline){
        let curve = new Bezier(spline.startPoint.x, spline.startPoint.y,
            spline.controlPoint1.x, spline.controlPoint1.y,
            spline.controlPoint2.x, spline.controlPoint2.y,
            spline.endPoint.x, spline.endPoint.y);

        let tList = curve.intersects(line);

        let res = [];

        for(let t of tList){
            res.push(spline.getPointOffset(t));
        }

        if(line.isNear(spline.startPoint, 1E-5)){
            res.push(spline.startPoint.copy());
        }

        if(line.isNear(spline.endPoint, 1E-5)){
            res.push(spline.endPoint.copy());
        }
        return res;
    }

    /**
     * @param {Arc} arc
     * @param {Spline} spline
     * @return {Array.<Point>}
     * @private
     */
    static _intersectPointsArcSpline(arc, spline){
        //todo: can have the errors in polygon discretization
        return arc.toPolyLines()[0].getCrossPoints(spline.toPolyLines()[0]);
    }

    /**
     * @param {Spline} spline1
     * @param {Spline} spline2
     * @return {Array.<Point>}
     * @private
     */
    static _intersectPointsSplineSpline(spline1, spline2) {
        let curve = new Bezier(spline1.startPoint.x, spline1.startPoint.y,
            spline1.controlPoint1.x, spline1.controlPoint1.y,
            spline1.controlPoint2.x, spline1.controlPoint2.y,
            spline1.endPoint.x, spline1.endPoint.y);


        let curve2 = new Bezier(spline2.startPoint.x, spline2.startPoint.y,
            spline2.controlPoint1.x, spline2.controlPoint1.y,
            spline2.controlPoint2.x, spline2.controlPoint2.y,
            spline2.endPoint.x, spline2.endPoint.y);

        let tList = curve.intersects(curve2, 0.0001);
        let res = [];
        for (let pair of tList) {
            let temp = pair.split("/").map(function (v) {
                return parseFloat(v);
            });
            let p = spline1.getPointOffset(temp[0]);
            res.push(new (container.resolve('math').Point)(p.x, p.y));
        }

        return res;
    }

}