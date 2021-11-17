/**
 * Created by dev on 20.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import IntersectCalculator from './IntersectCalculator';
import Point from '../../Point';


export default class LineArc extends IntersectCalculator{

    /**
     * @param {LineElement} line
     * @param {Arc} arc
     * @return {Array.<Point>}
     */
    getIntersectPoints(line, arc){
        let res = this.getLineCircleIntersectPoints(line, arc);

        let temp = res.filter(point => line.isBelongsToTheElement(point) && arc.isBelongsToTheElement(point, 0.1));
        return temp;
    }
    
    /**
     * Find the closest intersect point between full-arc based on given arc and full-line based on given line
     * @param {LineElement} line
     * @param {Arc} arc
     * @return {Point|null}
     */
    getClosestIntersectPoint(line, arc, point){
        let res = this.getLineCircleIntersectPoints(line, arc);

        if(res.length==2){
            return (res[0].distanceTo(point)<res[1].distanceTo(point))?res[0]:res[1];
        }else if(res.length==1){
            return res[0];
        }
        return null;
    }

    /**
     * Find the closest intersect point between full-arc based on given arc and full-line based on given line
     * @param {LineElement} line
     * @param {Arc} arc
     * @return {Array.<Point>|null}
     */
    getLineCircleIntersectPoints(line, arc){
        let res = [];
        let l=line._line;
        let k = l.k;

        if(!Helper.Math.equals(k,0)) {
            let t = l.b - arc.center.y;
            let a = k*k + 1;
            let b = 2 * k * t-2 * arc.center.x;
            let c = Math.pow(arc.center.x, 2) + (t * t) - (arc.radius * arc.radius);
            let D = b * b - 4 * a * c;
            D = (Math.abs(D) > 0 && (Math.abs(D) - 1E-8) < 0) ? 0 : D;
            if (Helper.Math.equals(D,0)) {
                let x = -b / (2 * a);
                res = [new Point(x, k*x-(l.C/l.B))];
            }else if(D>0) {

                let x1 = (-b + Math.sqrt(D)) / (2 * a);
                let x2 = (-b - Math.sqrt(D)) / (2 * a);
                res = [new Point(x1, k * x1 - (l.C / l.B)), new Point(x2, k * x2 - (l.C / l.B))];
            }
        }else{
            let angle = line.angle;
            if(Helper.Math.equals(angle,90) || Helper.Math.equals(angle,270)){
                let x = l._p1.x;
                let a=1;
                let b = -2*arc.center.y;
                let c = Math.pow(x,2)-2*x*arc.center.x+Math.pow(arc.center.x,2)+Math.pow(arc.center.y,2)-Math.pow(arc.radius,2);

                let D = b * b - 4 * a * c;

                D = (Math.abs(D) > 0 && (Math.abs(D) - 1E-8) < 0) ? 0 : D;

                if (Helper.Math.equals(D, 0)) {
                    let y = -b / (2 * a);
                    res = [new Point(x, y)];
                }else if(D>0) {

                    let y1 = (-b + Math.sqrt(D)) / (2 * a);
                    let y2 = (-b - Math.sqrt(D)) / (2 * a);
                    res = [new Point(x, y1), new Point(x, y2)];
                }
            }else{
                let y = l._p1.y;
                let a=1;
                let b = -2*arc.center.x;
                let c =Math.pow(y-arc.center.y,2)+Math.pow(arc.center.x,2)-Math.pow(arc.radius,2);

                let D = b * b - 4 * a * c;
                D = (Math.abs(D) > 0 && (Math.abs(D) - 1E-8) < 0) ? 0 : D;
                if (Helper.Math.equals(D, 0)) {
                    let x = -b / (2 * a);
                    res= [new Point(x, y)];
                }else if(D>0) {
                    let x1 = (-b + Math.sqrt(D)) / (2 * a);
                    let x2 = (-b - Math.sqrt(D)) / (2 * a);
                    res = [new Point(x1, y), new Point(x2, y)];
                }
            }

        }
        return res;
    }
}
