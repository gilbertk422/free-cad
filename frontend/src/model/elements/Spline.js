/**
 * Created by dev on 14.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import GraphicElement from '../GraphicElement';
import Point from '../math/Point';
import Bezier from 'bezier-js';
import Line from '../math/Line';
import PolyLine from '../math/PolyLine';

import Matrix from '../math/Matrix';
import LineElement from "./LineElement";

export default class Spline extends GraphicElement{
    constructor(startPoint, endPoint){
        super();
        this._points = [startPoint, endPoint, null, null];
        this.typeName= 'Spline';

        this._renderer = container.resolve('rendererFactory', [this]);
    }

    set startPoint(p){
        this._points[0]=p;
    }

    /**
     * @returns {Point}
     */
    get startPoint(){
        return this._points[0];
    }


    set endPoint(p){
        this._points[1]=p;
    }

    /**
     * @returns {Point}
     */
    get endPoint(){
        return this._points[1];
    }


    set controlPoint1(p){
        this._points[2]=p;
    }

    /**
     * @returns {Point|null}
     */
    get controlPoint1(){
        return this._points[2];
    }


    set controlPoint2(p){
        this._points[3]=p;
    }

    /**
     * @returns {Point|null}
     */
    get controlPoint2(){
        return this._points[3];
    }

    /**
     * @return {Array.<Point>} - the points are end points in a contour.
     */
    get extremePoints(){
        return [this.startPoint.copy(), this.endPoint.copy()];
    }

    /**
     * @param {number} [step=1E-2]
     * @inheritDoc
     */
    toPolyLines(step=null){
        if(step==null){
            step=-Math.pow(container.resolve('config').discretizationQuality, 1/4)*0.18+0.2;
        }
        let res = new (container.resolve('math')).PolyLine();
        let point = this.startPoint.copy();

        for(let t=0; t<1; t+=step){
            res.addPoint(point);
            point = this.getPointOffset(t);
        }
        res.addPoint(this.endPoint.copy());
        return [res];
    }

    /**
     * @inheritDoc
     */
    resize(x, y, point, extr){

        let wX = Math.abs(extr.max.x-extr.min.x);

        let wY = Math.abs(extr.max.y-extr.min.y);

        let dx = 0;
        let dy = 0;
        if(wX!=0){
            dx = (wX+x)/wX-1;
        }

        if(wY!=0){
            dy = (wY+y)/wY-1;
        }

        let resizeMatrix = Matrix.createResizeMatrix(dx,dy);


        let moveMatrix = Matrix.createMoveMatrix(-point.x, -point.y);
        let removeMatrix = Matrix.createMoveMatrix(point.x, point.y);

        for(let point of this._points){
            point.changeByMatrix(moveMatrix);
            point.changeByMatrix(resizeMatrix);
            point.changeByMatrix(removeMatrix);
        }
    }


    /**
     * @inheritDoc
     */
    getExtrenum(){
        let p = new Bezier(this.startPoint.x, this.startPoint.y,
            this.controlPoint1.x, this.controlPoint1.y,
            this.controlPoint2.x, this.controlPoint2.y,
            this.endPoint.x, this.endPoint.y).bbox();
        return {max:{x:p.x.max, y:p.y.max, z:0}, min:{x:p.x.min, y:p.y.min, z:0}};
    }


    /**
     * @inheritDoc
     */
    isNear(point, eps){
        let p = new Bezier(this.startPoint.x, this.startPoint.y,
            this.controlPoint1.x, this.controlPoint1.y,
            this.controlPoint2.x, this.controlPoint2.y,
            this.endPoint.x, this.endPoint.y).project(point);

        return new (container.resolve('math').Point)(p.x, p.y).isNear(point,eps);
    }

    /**
     * @inheritDoc
     */
    isIntoFigure(figure){
        let points = this.toPolyLines()[0].points;

        let res = true;
        for(let i=1; i<points.length; i++){
            res&=figure.contain(points[i-1]) && figure.contain(points[i]);
        }
        return res;
    }

    /**
     * @inheritDoc
     * @return {Spline}
     */
    copy(){
        let res = new Spline(this._points[0].copy(),this._points[1].copy());
        res.controlPoint1 = this._points[2].copy();
        res.controlPoint2 = this._points[3].copy();
        res.hight=this.height;
        res.id=this.id;
        res.lineType = this.lineType.copy();
        return res;
    }

    /**
     * Calculate point by parameter
     * @see(https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
     * @param {number} offset - In which part to determine the point. 0 ... 1 where 0 is the beginning of the curve and 1 is the end
     * @return {Point}
     */
    getPointOffset(offset){
        let p0=this.startPoint;
        let p1=this.controlPoint1;
        let p2=this.controlPoint2;
        let p3=this.endPoint;
        let t = offset;

        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;

        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;

        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

        // return {x: x, y: y};
        return  new (container.resolve('math')).Point(x, y);
    }

    /**
     * @inheritDoc
     */
    getCenter(){
        return this.getPointOffset(0.5);
    }

    /**
     * The method return list of elements which was made by intersection current element
     * accuracy is about 0.01
     * @param {Array.<Point>} points  - the points must be in current element
     * @return {Array.<GraphicElement>}
     */
    intersectByPoints(points){
        let curve = new Bezier(this.startPoint.x, this.startPoint.y,
            this.controlPoint1.x, this.controlPoint1.y,
            this.controlPoint2.x, this.controlPoint2.y,
            this.endPoint.x, this.endPoint.y);

        let t = [0];
        for(let i=0; i<points.length; i++){
            let p = curve.project(points[i]);
            t.push(p.t);
        }
        t.push(1);
        t = t.sort((a,b)=>a-b);
        if(t.length==0){
            return [this.copy()];
        }
        let res = [];

        res.push(...this.splitByT(t));
        return res;
    }

    /**
     * @param {Array.<number>} t
     * @returns {Array.<Spline>}
     * @private
     */
    splitByT(t){
        if(t.length==0){
            return [this.copy()];
        }

        let res = [];
        for(let i=1; i<t.length; i++){
            let curve = new Bezier(this.startPoint.x, this.startPoint.y,
                this.controlPoint1.x, this.controlPoint1.y,
                this.controlPoint2.x, this.controlPoint2.y,
                this.endPoint.x, this.endPoint.y);
            let tCurve = curve.split(t[i-1], t[i]);
            if(tCurve.points) {
                let spline = new Spline(new (container.resolve('math').Point)(tCurve.points[0].x, tCurve.points[0].y),
                    new (container.resolve('math').Point)(tCurve.points[3].x, tCurve.points[3].y));
                spline.controlPoint1 = new (container.resolve('math').Point)(tCurve.points[1].x, tCurve.points[1].y);
                spline.controlPoint2 = new (container.resolve('math').Point)(tCurve.points[2].x, tCurve.points[2].y);
                res.push(spline);
            }
        }
        return res;
    }
}