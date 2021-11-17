import Rect from "./Rect";
import Point from "./Point";

/**
 * @param minX
 * @param minY
 * @param maxX
 * @param maxY
 */
export default class Extremum{

    constructor(minX, minY, maxX, maxY){
        this.minX=minX;
        this.minY=minY;

        this.maxX=maxX;
        this.maxY=maxY;
    }


    get min(){
        return {
            x:this.minX,
            y:this.minY
        }
    }

    get max(){
        return {
            x:this.maxX,
            y:this.maxY
        }
    }

    toRect(){
        return new Rect(new Point(this.minX, this.maxY), new Point(this.maxX, this.minY));
    }
}