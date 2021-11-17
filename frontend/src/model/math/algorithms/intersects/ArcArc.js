/**
 * Created by dev on 20.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import IntersectCalculator from './IntersectCalculator';
import Point from '../../Point'

export default class ArcArc extends IntersectCalculator{

    /**
     * @param {Arc} arc1
     * @param {Arc} arc2
     * @return {Array.<Point>}
     */
    getIntersectPoints(arc1, arc2){
        let y = (x, neg=1)=> {
            return neg * Math.sqrt(Math.pow(arc1.radius, 2) - Math.pow(x - arc1.center.x, 2)) + arc1.center.y;
        };

        let res = [];
        let distance = arc1.center.distanceTo(arc2.center);
        if(distance>arc1.radius+arc2.radius){
            return [];
        }

        if(arc1.center.y==arc2.center.y){
            let x = (Math.pow(arc2.radius,2)-Math.pow(arc2.center.x,2)-Math.pow(arc1.radius,2)+Math.pow(arc1.center.x,2))/(2*(arc1.center.x-arc2.center.x));
            let resY1 = y(x);
            let resY2 = y(x,-1);

            res.push(new Point(x,resY1));
            if(resY1!=resY2){
                res.push(new Point(x,resY2));
            }
        }else{
            let t = (Math.pow(arc2.radius,2)-Math.pow(arc2.center.x,2)-Math.pow(arc1.radius,2)+Math.pow(arc1.center.x,2)
                    -Math.pow(arc1.center.y,2)+2*arc1.center.y*arc2.center.y-Math.pow(arc2.center.y,2)
                )/(2*(arc1.center.y-arc2.center.y));
            let t1 = (arc1.center.x-arc2.center.x)/(arc1.center.y-arc2.center.y);

            let a = t1*t1+1;
            let b = -2*t*t1-2*arc1.center.x;
            let c = t*t+Math.pow(arc1.center.x,2)-Math.pow(arc1.radius,2);

            let D = b*b-4*a*c;
            if (D == 0) {
                let x = -b / (2 * a);
                res = [new Point(x, y(x)),
                    new Point(x, y(x,-1))
                ];
            }else if(D>0) {

                let x1 = (-b + Math.sqrt(D)) / (2 * a);
                let x2 = (-b - Math.sqrt(D)) / (2 * a);
                res = [
                    new Point(x1, y(x1)),
                    new Point(x2, y(x2)),
                    new Point(x1, y(x1,-1)),
                    new Point(x2, y(x2,-1))
                ];
            }
        }
        res = res.filter(point => arc1.isBelongsToTheElement(point) && arc2.isBelongsToTheElement(point));

        let temp = [];

        m: for(let i=0; i<res.length; i++){
            for(let j=0; j<temp.length; j++){
                if(res[i].compare(temp[j])){
                    continue m;
                }
            }
            temp.push(res[i]);
        }
        return temp;
    }

}
