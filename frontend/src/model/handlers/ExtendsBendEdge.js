/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import DataHandler from "../DataHandler";
import Intersect from "../math/algorithms/intersects/Intersect";
import LineElement from "../elements/LineElement";

let Matrix = container.resolve('math').Matrix;
export default class ExtendsBendEdge extends DataHandler{

    /**
    * @inheritDoc
    * @param {Document} document
    * @return {boolean} - true if the document was change
    */
    handle(document){
        let simlpeElements = document.getListSimpleElements();

        let elements = simlpeElements.filter(el=>(el.lineType.name=="Auto" || el.lineType.name=="Thread"));
        let bends = simlpeElements.filter(el=>el.lineType.name=="Bend");

        for(let bend of bends){
            let temp = bend.copy();
            this.extend(temp,elements);
            if(!Helper.Math.equals(temp.length(),0)){
                this.extend(bend,elements);

            }
        }
        return true;
    }

    extend(bend, elements){
        let ray1 = new LineElement(bend.getCenter(), bend.p1.copy());
        if(this._movePointToNearIntersect(bend.p1, ray1, elements)){
            let ray2 = new LineElement(bend.getCenter(), bend.p2.copy());
            if(!this._movePointToNearIntersect(bend.p2, ray2, elements)){
                let ray3 = new LineElement(bend.p2.copy(), bend.p1.copy());
                this._movePointToNearIntersect(bend.p2, ray3, elements);
            }
        }else{
            let ray2 = new LineElement(bend.getCenter(), bend.p2.copy());
            if(this._movePointToNearIntersect(bend.p2, ray2, elements)){
                let ray3 = new LineElement(bend.p1.copy(), bend.p2.copy());
                this._movePointToNearIntersect(bend.p1, ray3, elements);
            }
        }
    }

    _movePointToNearIntersect(point, ray, elements){
        ray._line.setLength(1E6);
        let points = Intersect.getIntersectPointsWithElements(ray, elements);
        if(points.length==0){
            return false;
        }
        let minPointIndex = 0;
        let minLength = point.distanceTo(points[0]);
        for(let i=1; i<points.length; i++){
            let tempLength =point.distanceTo(points[i]);
            if(minLength>tempLength){
                minLength=tempLength;
                minPointIndex=i;
            }
        }
        point.changeByMatrix(Matrix.createMoveMatrix(points[minPointIndex].x-point.x, points[minPointIndex].y-point.y));
        return true;
    }

}