/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Line from "./Line";
import Point from "./Point";

export default class Triangle {
    constructor(v1, v2, v3) {
        this.v1=v1;
        this.v2=v2;
        this.v3=v3;
        this.l1 = new Line(v1,v2);
        this.l2 = new Line(v2,v3);
        this.l3 = new Line(v3,v1);
    }

    square(){
        let a = this.l1.length();
        let b = this.l2.length();
        let c = this.l3.length();
        let P = (a+b+c)/2;
        return Math.sqrt(P*(P-a)*(P-b)*(P-c));
    }


    /**
     * @return {Point}
     */
    getCenter(){
        return new Point((this.v1.x+this.v2.x+this.v3.x)/3, (this.v1.y+this.v2.y+this.v3.y)/3);
    }

    /**
     * Heron's algorithm is used
     * @param {Vertex3} vertex
     * @return {boolean}
     */
    contains(vertex){
        let sum = 0;
        sum+=new Triangle(this.v1, this.v2, vertex).square();
        sum+=new Triangle(this.v2, this.v3, vertex).square();
        sum+=new Triangle(this.v1, this.v3, vertex).square();
        return sum<this.square()+1E-4;
    }
}