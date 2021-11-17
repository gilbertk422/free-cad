
import * as THREE from 'three';
var ThreeBSP = require('three-js-csg')(THREE);

import Utils from "./Utils";
import Arc from "../../../../model/elements/Arc";
import LineElement from "../../../../model/elements/LineElement";
import Shape from "../../../../model/elements/Shape";
import ShapeGeometryBuilder from "../../ShapeGeometryBuilder";
import RectElement from "../../../../model/elements/RectElement";

let Trigonometric = container.resolve('math').Trigonometric;

export default class BendArea{

    constructor(bendLine, shapeHeight, shapeCenter, parts=1){

        this._geometries = [];

        this.bendLine=bendLine;

        this.shapeHeight=shapeHeight;

        this.shapeCenter = shapeCenter;

        this.parts = parts;

        this.calculated = null;

    }

    get geometries(){

        if(!this.calculated && !global.debug.disableRollUp) {

            let insideRadius = this.getInsideRadius();
            let height = this.shapeHeight;
            let bend = this.bendLine;

            let bendAngle = bend.lineType.processing[0].angle / this.parts;


            let L = this.getInsideAreaWidth() * Math.sign(bendAngle);

            let rotateCoefficient = Utils.getVectorCoefficient(this.bendLine, this.shapeCenter);
            let c = L / 2;
            let z = 0;
            if (rotateCoefficient == 180) {
                if (bendAngle < 0) {
                    // c = -L / 2;
                    z = -insideRadius;
                } else {
                    c = -L / 2;
                    z = insideRadius + height;
                }
            } else {
                if (bendAngle < 0) {
                    c = -L / 2;
                    z = -insideRadius;
                } else {
                    c = L / 2;
                    z = insideRadius + height;
                }
            }

            let x = c * Math.cos(Trigonometric.gradToRad(bend.angle - 90));
            let y = c * -Math.sin(Trigonometric.gradToRad(bend.angle - 90));

            let width = this.getInsideAreaWidth();
            for (let i = 0; i < this._geometries.length; i++) {
                let area = this._geometries[i];
                area.translate(-x, y, 0);
                area.translate(-bend.p1.x, -bend.p1.y, 0);
                area.rotateZ(Trigonometric.gradToRad(-bend.angle));


                if (rotateCoefficient == 180) {
                    area.translate(0, (width/this.parts)*i, 0);
                    area.rotateX(Trigonometric.gradToRad(-bendAngle*i));
                }else{
                    area.translate(0, -(width/this.parts)*i, 0);
                    area.rotateX(Trigonometric.gradToRad(bendAngle*i));
                }

                area.rotateZ(Trigonometric.gradToRad(bend.angle));
                area.translate(bend.p1.x, bend.p1.y, 0);
                area.translate(x, -y, z);
            }


            let res = new ThreeBSP(this._geometries[0]);

            for(let i=1; i<this._geometries.length; i++){
                res = res.union(new ThreeBSP(this._geometries[i]));
            }

            this.calculated = res.toGeometry();
        }

        if(global.debug.disableRollUp){
            return this._geometries;
        }

        return [this.calculated];
    }



    generateBendArea(){
        let bend = this.bendLine;

        let bendAngle = bend.lineType.processing[0].angle/this.parts;


        let L = this.getInsideAreaWidth() * Math.sign(bendAngle);

        let rotateCoefficient = Utils.getVectorCoefficient(this.bendLine, this.shapeCenter);
        let c = L / 2;
        if (rotateCoefficient == 180) {
            if (bendAngle >= 0) {
                c = -L / 2;
            }
        } else {
            if (bendAngle < 0) {
                c = -L / 2;
            } else {
                c = L / 2;
            }
        }

        let width = this.getInsideAreaWidth();

        let x = c * Math.cos(Trigonometric.gradToRad(bend.angle - 90));
        let y = c * -Math.sin(Trigonometric.gradToRad(bend.angle - 90));
        for(let i=0; i<this.parts; i++) {

            let area = this._createBendAreaGeometry(bendAngle, i);
            area.rotateY(Math.PI / 2);

            if (rotateCoefficient == 180) {
                area.rotateX(-Trigonometric.gradToRad(bendAngle));
                area.translate(0, -(width/this.parts)*i, 0);
            }else{
                area.translate(0, (width / this.parts) * i, 0);
            }
            area.rotateZ(Trigonometric.gradToRad(bend.angle));
            area.translate(bend.p1.x, bend.p1.y, 0);
            area.translate(x, -y, 0);
            this._geometries.push(area);
        }
    }

    /**
     * @param {number} bendAngle
     * @return {THREE.Geometry}
     * @private
     */
    _createBendAreaGeometry(bendAngle, part){
        let insideRadius = this.getInsideRadius();
        let height = this.shapeHeight;
        let bend = this.bendLine;
        let insideArc = new Arc(new (container.resolve('math')).Point(), insideRadius);
        insideArc.incrementAngle = Math.abs(bendAngle);
        let outsideArc = insideArc.copy();
        outsideArc.generateNewId();
        outsideArc.radius=insideRadius+height;

        let line1 = new LineElement(
            new (container.resolve('math')).Point(insideRadius),
            new (container.resolve('math')).Point(insideRadius+height)
        );

        let line2 = line1.copy();
        line2.rotate(new (container.resolve('math')).Point(), -Math.abs(bendAngle));
        line2.generateNewId();

        let shape = new Shape();
        shape.addElement(insideArc);
        shape.addElement(outsideArc);
        shape.addElement(line1);
        shape.addElement(line2);

        if(bendAngle<0){
            for(let el of shape.elements){
                el.rotate(new (container.resolve('math')).Point(), 180-bendAngle);
            }
        }

        return ShapeGeometryBuilder.getGeometry(shape.getConsistentlyPoints(), bend.length());
    }

    /**
     * @return {number} radius in mm
     * @private
     */
    getInsideRadius(){
        let T = (this.shapeHeight * (container.resolve('config').material.name == 'Aluminum 6061 T6' ? 2 : 1))/ 25.4;

        let R = 1/4;
        if(T <= 1/16){
            R = 1/32;
        }else if(T <= 1/8){
            R = 1/16;
        }else if(T <= 1/4){
            R = 1/8;
        }
        return R*25.4;
    }

    getInsideAreaWidth(){
        let R = this.getInsideRadius();

        let arc = new Arc(new (container.resolve('math')).Point(), R);
        arc.incrementAngle=this.bendLine.lineType.processing[0].angle;
        let points = arc.extremePoints;
        let x = (R*R*points[0].y-R*R*points[1].y)/(points[1].x*points[0].y-points[1].y*points[0].x);
        let y = (points[1].x*x-points[0].x*x)/(points[0].y-points[1].y);
        let L=new (container.resolve('math')).Point(R)
            .distanceTo(new (container.resolve('math')).Point(x,y));
        return L*2;
    }

    subtractGeometry(insideGeometry){
        let temp = [];
        for(let geometry of this._geometries){
            temp.push(new ThreeBSP(geometry).subtract(new ThreeBSP(insideGeometry)).toGeometry());
        }
        this._geometries=temp;
    }


    rotate(bendLine, vector, rotateCoefficient){
        let center = bendLine.getCenter();
        let bendAngle = bendLine.angle;


        for(let geometry of this.geometries) {
            geometry.translate(-center.x, -center.y, 0);
            geometry.rotateZ(-Trigonometric.gradToRad(bendAngle + rotateCoefficient));
            geometry.rotateX(-Trigonometric.gradToRad(-bendLine.lineType.processing[0].angle));
            if (vector) {
                geometry.translate(vector.x, vector.y, vector.z);
            }
            geometry.rotateZ(Trigonometric.gradToRad(bendAngle + rotateCoefficient));
            geometry.translate(center.x, center.y, 0);
        }
    }

    /**
     * @return {Geometry}
     */
    getSubtractBendArea(){
        let length = this.bendLine.length()+0.001;
        let L = this.getInsideAreaWidth();

        let center = this.bendLine.getCenter();

        let rect = new RectElement(
            new (container.resolve('math')).Point(-length/2, L/2),
            new (container.resolve('math')).Point(length/2, -L/2)
        ).toElement();
        rect.rotate(new (container.resolve('math')).Point(), -this.bendLine.angle);
        rect.move(center.x, center.y);

        let shape = new Shape();
        let elements = rect.toSimpleElements();
        for (let el of elements){
            shape.addElement(el);
        }

        return ShapeGeometryBuilder.getGeometry(shape.getConsistentlyPoints(), this.shapeHeight);
    }

    /**
     * @param {Shape} shape
     * @return {boolean}
     */
    isCross(shape){
        let w = this.getInsideAreaWidth()/2;
        let x = w * w*Math.cos(Trigonometric.gradToRad(this.bendLine.angle));
        let y = w * w*Math.sin(Trigonometric.gradToRad(this.bendLine.angle));

        let line1 = this.bendLine.copy();
        line1.move(x,y);
        let line2 = line1.copy();
        line2.move(-2*x,-2*y);
        return shape.isCrossed([this.bendLine, line1, line2]);
    }
}