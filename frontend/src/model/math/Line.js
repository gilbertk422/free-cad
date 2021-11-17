/**
 * Created by dev on 12.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Trigonometric from './Trigonometric'
import Point from "./Point";
import Vector from './Vector';
import Matrix from './Matrix'

export default class Line{
    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2){
        this._p1=p1;
        this._p2=p2;
    }

    /**
     * @return {number} - the A coefficient in [  Ax+By+C=0  ]
     * @constructor
     */
    get A(){
        return this._p2.y-this._p1.y;
    }

    /**
     * @return {number} - the B coefficient in [  Ax+By+C=0  ]
     * @constructor
     */
    get B(){
        return this._p2.x-this._p1.x;
    }

    /**
     * @return {number} - the C coefficient in [  Ax+By+C=0  ]
     * @constructor
     */
    get C(){
        return this._p1.x*this._p2.y-this._p2.x*this._p1.y;
    }

    /**
     * @return {number} - the angle coefficient in  [  y=k*x+b  ]
     */
    get k(){
        if(Helper.Math.equals(this.A, 0)|| Helper.Math.equals(this.B, 0)){
            return 0;
        }
        return this.A/this.B;
    }

    /**
     * @return {number} - the b coefficient in  [  y=k*x+b  ]
     */
    get b(){
        let b= this.B;
        if(Helper.Math.equals(b, 0)){
            return 0;
        }else {
            return -(this.C/b);
        }
    }

    /**
     * @param x
     * @return {number}
     */
    y(x){
        return this.k*x+this.b;
    }

    /**
     * @param y
     * @return {number}
     */
    x(y){
        if(Helper.Math.equals(this.k,0)){
            if(Helper.Math.equals(this.B, 0)){
                return this._p1.x;
            }
            return this.b;
        }
        return (y-this.b)/this.k;
    }

    /**
     * @return {number}
     */
    length(){
        let p1= this._p1;
        let p2= this._p2;
        let z = Math.pow(p1.z-p2.z,2);
        return Math.sqrt(Math.pow(this.A,2)+Math.pow(this.B,2)+z);
    }

    /**
     * The method fir setting the length of the line when p1 is start points.
     * @param length
     */
    setLength(length){
        let angle  = new Vector(1,0,0).getAngle(this.toVector());
        let dx = length * Math.cos(Trigonometric.gradToRad(angle));
        let dy =length * Math.sin(Trigonometric.gradToRad(angle));

        this._p2.y = this._p1.y + dy;
        this._p2.x = this._p1.x + dx;
    }

    /**
     * http://www.cat-in-web.ru/notebook/rasstoyanie-ot-tochki-do-otrezka/
     */
    _isObtuseAngle( oppositeLine,  a,  b){
        var cos = (a*a + b*b - oppositeLine*oppositeLine) / (2 * a * b);
        return cos < 0;
    }

    /**
     * @param {Point} point
     * http://www.cat-in-web.ru/notebook/rasstoyanie-ot-tochki-do-otrezka/
     * @return {number} - distance to current segment
     */
    distanceTo(point){
        let p1=this._p1;
        let p2=this._p2;
        if (p1.compare(point) || p2.compare(point))
            return 0;

        var AB = p1.distanceTo(p2);
        var AC = p1.distanceTo(point);

        if (AB == 0)
            return AC;

        var BC = p2.distanceTo(point);

        if(Helper.Math.equals(AB,AC + BC)){
            return 0;
        }

        if (this._isObtuseAngle(AC, BC, AB))
            return BC;
        if (this._isObtuseAngle(BC, AC, AB))
            return AC;

        var p = (AC + BC + AB) / 2;
        return 2 * Math.sqrt(p * (p - AB) * (p - BC) * (p - AC)) / AB;
    }

    /**
     * @param {Point} point
     * @return {Point}
     */
    perpendicularPoint(point){
        let x1 = this._p1.x;
        let x2 = this._p2.x;
        let x3 = point.x;
        let y1 = this._p1.y;
        let y2 = this._p2.y;
        let y3 = point.y;


        let x4=((x2-x1)*(y2-y1)*(y3-y1)+x1*Math.pow(y2-y1, 2)+x3*Math.pow(x2-x1, 2))/(Math.pow(y2-y1, 2)+Math.pow(x2-x1, 2));
        let y4 = 0;
        if(Helper.Math.equals(this.B, 0, 1E-5)){
            y4 = point.y;
        }else{
            y4=(y2-y1)*(x4-x1)/(x2-x1)+y1;
        }

        return new Point(x4,y4);
    }

    /**
     * @param {Line|null} line
     * @return {number} - [0-180] angle between current line and line in parameter or angle between current line and BaseLine(1,0,0)
     * if the parameter is null
     */
    getAngle(line=null){ //todo: search all use the method with baseline and refactor it to use without parameters
        if(line==null){
            line = new Line(new Point(), new Point(1));
        }
        if(!line instanceof Line){
            throw new Exception('Parameter must be Line type!');
        }
        let cos = (this.A*line.A+this.B*line.B)/(this.length()*line.length());
        return Trigonometric.radToGrad(Math.acos(cos));
    }

    /**
     * Return point which offset is the size of crop number(presented by fraction)
     * Start is p1
     * @param {number} offset - 0..1
     * @return {Point}
     */
    getPointOffset(offset){
        return new Point(this._p1.x + this.B*offset, this._p1.y + this.A*offset);
    }

    copy(){
        return new Line(this._p1.copy(), this._p2.copy());
    }

    isNear(point, eps){
        return this.distanceTo(point)<eps;
    }

    /**
     * @return {Vector}
     */
    toVector(){
        return new Vector(this.B, this.A, 0);
    }

    /**
     *
     * @param {Line} line
     * @return {Point|null}
     */
    getCrossLinePoint(line){ //todo: rename to getCrossPoint
        let x1 = this._p1.x;
        let y1 = this._p1.y;
        let x2 = this._p2.x;
        let y2 = this._p2.y;
        let x3 = line._p1.x;
        let y3 = line._p1.y;
        let x4 = line._p2.x;
        let y4 = line._p2.y;

        let a1 = y1 - y2;
        let b1 = x2 - x1;
        let a2 = y3 - y4;
        let b2 = x4 - x3;

        let d = a1 * b2 - a2 * b1;
        if( d != 0 ) {
            let c1 = y2 * x1 - x2 * y1;

            let c2 = y4 * x3 - x4 * y3;
            let x = (b1 * c2 - b2 * c1) / d;
            let y = (a2 * c1 - a1 * c2) / d;
            return new Point(x, y, 0);
        }
        return null;
    }

    /**
     * @param {Line} line
     * @return {Point|null} null if segments limited by points p1, and p2 aren't cross
     */
    getCrossPoint(line){ //todo: rename to getCrossSegmentsPoint
        let point = this.getCrossLinePoint(line);
        if(point){
            if( this.between(point.x,this._p1.x, this._p2.x) && this.between(point.x,line._p1.x, line._p2.x) &&
                this.between(point.y,this._p1.y, this._p2.y) && this.between(point.y,line._p1.y, line._p2.y)) {
                return point;
            }
        }
        return null;
    }

    /**
     * @deprecated need remove the method
     */
    between(value, a, b, Eps=1E-3) {
        return Helper.Math.between(value,a,b, Eps);
    };

    /**
     * @param {Point} point
     * @return {boolean}
     */
    isBelongsToTheLine(point){
        if(Helper.Math.equals(this.k,0) && Helper.Math.equals(this.B,0)){
            return this.between(point.y,this._p1.y, this._p2.y) && point.x == this._p1.x;
        }
        if(Helper.Math.equals(this.k,0) && Helper.Math.equals(this.A,0)){
            return this.between(point.x,this._p1.x, this._p2.x)  && point.y == this._p1.y;
        }

        return Helper.Math.equals(point.y,this.k*point.x+this.b)
            && this.between(point.x,this._p1.x, this._p2.x) && this.between(point.y,this._p1.y, this._p2.y);
    }

    /**
     * @param {Line} line
     * @return {number}
     */
    isParallel(line){
        return (this.A * line.B - line.A * this.B)==0;
    }

    /**
     * @param {Line} line
     * @return {boolean}
     */
    isOverlapping(line){
        let res = true;
        res&=Helper.Math.equals(this.b,line.b);
        res&=Helper.Math.equals(this.k,line.k);
        res&=Helper.Math.equals(this.y(this._p1.x), line.y(this._p1.x));
        res&=Helper.Math.equals(this.x(this._p1.y), line.x(this._p1.y));
        return res;
    }

    /**
     * @param {number} distance
     * @return {Line[]}
     */
    getParallels(distance){
        let temp = this.copy();
        temp._p2.changeByMatrix(Matrix.createMoveMatrix(-temp._p1.x, -temp._p1.y, -temp._p1.z));
        temp._p2.changeByMatrix(Matrix.createRotateMatrix(90));
        temp._p2.changeByMatrix(Matrix.createMoveMatrix(temp._p1.x, temp._p1.y, temp._p1.z));
        temp.setLength(distance);
        let vector = temp.toVector();
        let l1 = this.copy();
        let moveMatrix1 = Matrix.createMoveMatrix(vector.x, vector.y, vector.z);
        l1._p1.changeByMatrix(moveMatrix1);
        l1._p2.changeByMatrix(moveMatrix1);

        let l2 = this.copy();
        let moveMatrix2 = Matrix.createMoveMatrix(-vector.x, -vector.y, -vector.z);
        l2._p1.changeByMatrix(moveMatrix2);
        l2._p2.changeByMatrix(moveMatrix2);

        return [l1,l2];
    }
}