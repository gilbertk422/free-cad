/**
 * Created by dev on 29.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Line from './Line';
import Point from "./Point";

export default class PolyLine{
    constructor(points=[]){

        /**
         * @type {Array.<Point>}
         */
        this.points = points;
    }


    /**
     * @param {Array.<Point>} points
     */
    addPoints(points){
        for(let p of points){
            this.addPoint(p);
        }
    }

    /**
     * @param {Point} point
     */
    addPoint(point){
        this.points.push(point);
    }


    /**
     * @param {Point} point
     * @param {number} eps
     * @return {boolean}
     */
    isNear(point, eps){
        for(let i=1; i<=this.points.length; i++){
            let line = null;
            if(i!=this.points.length){
                line=new Line(this.points[i-1], this.points[i]);
            }else{
                line=new Line(this.points[this.points.length-1], this.points[0]);
            }
            if(line.isNear(point, eps)){
                return true;
            }
        }
        return false;
    }


    /**
     * @param {PolyLine} polyLine
     * @return {Array.<Point>|null}
     */
    getCrossPoints(polyLine, eps=1E-5){
        eps=eps*eps;
        let res = [];
        for(let i=1; i<this.points.length; i++){
            let l1 = new Line(this.points[i-1], this.points[i]);
            for(let j=1; j<polyLine.points.length; j++){
                let l2 = new Line(polyLine.points[j-1], polyLine.points[j]);
                let crossPoint = l1.getCrossPoint(l2);
                if(crossPoint && this.points[i-1].squareOfDistanceTo(crossPoint)>eps && this.points[i].squareOfDistanceTo(crossPoint)>eps){
                    res.push(crossPoint);
                }
            }
        }

        /** @type {Array<Point>} */
        let res1 = [];
        m: for(let p of res){
            for(let p1 of res1){
                if(p1.squareOfDistanceTo(p)<eps){
                    continue m;
                }
            }
            res1.push(p);
        }


        return res1;
    }
    
}