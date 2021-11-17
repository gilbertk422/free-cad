/**
 * Created by dev on 04.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import GraphicElement from '../GraphicElement';
import PolyLine from '../math/PolyLine';
import Line from '../math/Line';
import Matrix from '../math/Matrix';
import Vector from '../math/Vector';

/**
 * @inheritDoc
 */
export default class LineElement extends GraphicElement{
    constructor(p1, p2){
        super();
        /** @type {Line} */
        this._line = new (container.resolve('math')).Line(p1,p2);
        this._points=[p1,p2];
        this.typeName = 'Line'; //todo: change to LineElement

        this._renderer = container.resolve('rendererFactory', [this]);
    }

    /**
     * @inheritDoc
     * @return {Array.<Point>} -
     */
    get extremePoints(){
        return [this.p1, this.p2];
    }

    get angle(){
        return new (container.resolve('math')).Vector(1).getAngle(this._line.toVector());
    }

    /**
     * @param {Point} point
     */
    set p1(point){
        this._points[0]=point;
        this._line._p1=point;
    }

    /**
     * @return {Point}
     */
    get p1(){
        return this._line._p1;
    }

    /**
     * @param {Point} point
     */
    set p2(point){
        this._points[1]=point;
        this._line._p2=point;
    }

    /**
     * @return {Point}
     */
    get p2(){
        return this._line._p2;
    }

    /**
     * @inheritDoc
     */
    isIntoFigure(figure){
        return figure.contain(this.p1) && figure.contain(this.p2);
    }

    /**
     * @inheritDoc
     * @param {Point} point
     * @return {boolean}
     */
    isBelongsToTheElement(point){
        return this._line.isBelongsToTheLine(point);
    }

    /**
     * @param {LineElement} lineElement
     * @param {float} Eps - If Eps = 0, then only the crossover is taken into account; otherwise, lines that begin at the end of another line will return true
     * @return {boolean}
     */
    isOverlapping(lineElement, Eps=1E-3){
        let res = this._line.isOverlapping(lineElement._line);

        let halfOverlapp = (l1,l2,overlap)=>{
            let res = true;
            if(!(Helper.Math.equals(l1.p1.x, l2.p2.x) && Helper.Math.equals(l1.p2.x, l2.p2.x))){
                res &= Helper.Math.between(l1.p1.x, l2.p1.x, l2.p2.x, Eps) || Helper.Math.between(l1.p2.x, l2.p1.x, l2.p2.x,Eps);
            }
            if(!(Helper.Math.equals(l1.p1.y, l2.p2.y) && Helper.Math.equals(l1.p2.y, l2.p2.y))){
                res &= Helper.Math.between(l1.p1.y, l2.p1.y, l2.p2.y,Eps) || Helper.Math.between(l1.p2.y, l2.p1.y, l2.p2.y,Eps);
            }

            if(overlap && ((l1.p1.compare(l2.p1) && l1.p2.compare(l2.p2)) || (l2.p1.compare(l1.p1) && l2.p2.compare(l1.p2)))){
                res=true;
            }

            return res;
        };
        res &= halfOverlapp(this, lineElement,res) || halfOverlapp(lineElement, this,res);

        return !!res;
    }
    
    /**
     * @inheritDoc
     */
    isNear(point, eps){
        return this._line.isNear(point, eps);
    }


    length(){
        return this._line.length();
    }

    /**
     * @inheritDoc
     */
    getCenter(){
        return this._line.getPointOffset(0.5);
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
     * @return {LineElement}
     */
    copy(){
        let line = new LineElement(this.p1.copy(), this.p2.copy());
        line.height=this.height;
        line.id=this.id;
        line.lineType = this.lineType;
        return line;
    }

    /**
     * @inheritDoc
     */
    toPolyLines(){
        return [new (container.resolve('math')).PolyLine(this._points)];
    }

    /**
     * @inheritDoc
     */
    intersectByPoints(points){
        points = [...points]; //methods mustn't change any parameters
        points.push(this.p1.copy());
        points.push(this.p2.copy());
        let res = [];
        points = points.sort((a, b)=>this.p1.distanceTo(a)<=this.p1.distanceTo(b)?-1:1);

        for(let i=1; i<points.length; i++){
            if(!points[i-1].compare(points[i])) {
                let line = new LineElement(points[i - 1].copy(), points[i].copy());
                line.lineType=this.lineType;
                line.height=this.height;
                res.push(line);
            }
        }
        return res;
    }
}