/**
 * Created by dev on 11.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import GraphicElement from '../GraphicElement';
import Point from '../math/Point';

export default class Group extends GraphicElement{
    constructor(){
        super();
        this.elements = [];
        this.typeName = 'Group';

        this._renderer = container.resolve('rendererFactory', [this]);

        this._center = null;
    }

    get _points(){
        let res = [];
        for(let element of this.elements){
            for(let polyline of element.toPolyLines(10)){
                res.push(...polyline.points);
            }
        }
        return res;
    }

    set _points(points){}

    /**
     * @return {null} - group can't have extreme points
     */
    get extremePoints(){
        return null;
    }

    /**
     *
     * @param {number} value
     */
    set height(value){
        for(let el of this.elements){
            el.height=value;
        }
    }

    get height(){
        return this.elements[0]._height;
    }


    /**
     * Calculates the geometric center of the shape.
     *
     * The center of the group is the center of the line of maximum length obtained from the points of the figure.
     *
     * @return {Point} - center of current element
     */
    getCenter(){
        if(!this._center) {
            /** @type {Array.<Point>} points */
            let points = this._points;

            if(points.length>200){
                /**
                 * point filtering function, which is 100% not related to the center
                 * @param {Array.<Point>}points
                 */
                let filter = (points)=>{
                    let p1 = points[0];
                    let p2 = points[0];
                    let p3 = points[0];
                    let p4 = points[0];
                    let maxSum = p1.x+p1.y;
                    let minSub = p1.x-p1.y;
                    let minSum = p1.x+p1.y;
                    let maxSub = p1.x-p1.y;

                    for(let i=1; i<points.length; i++){
                        let sum = points[i].x+points[i].y;
                        let sub = points[i].x-points[i].y;
                        if(sum<minSum){
                            minSum=sum;
                            p3=points[i];
                        }
                        if(sum>maxSum){
                            maxSum=sum;
                            p1=points[i];
                        }
                        if(sub<minSub){
                            minSub=sub;
                            p2=points[i];
                        }
                        if(sub>maxSub){
                            maxSub=sub;
                            p4=points[i];
                        }
                    }

                    let xMin = Math.max(p2.x, p3.x);
                    let xMax = Math.min(p1.x, p4.x);
                    let yMin = Math.max(p3.y, p4.y);
                    let yMax = Math.min(p1.y, p2.y);

                    return points.filter(p=>!(p.y>yMin && p.y<yMax && p.x>xMin && p.x<xMax));
                };

                points = filter(points);
            }


            let p1 = points[0];
            let p2 = points[1];
            let length = p1.squareOfDistanceTo(p2);
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    let temp = points[i].squareOfDistanceTo(points[j]);
                    if (length < temp) {
                        p1 = points[i];
                        p2 = points[j];
                        length = temp;
                    }
                }
            }

            let extr = Point.getExtrenum([p1, p2]);
            this._center = new (container.resolve('math')).Point(extr.min.x + (extr.max.x - extr.min.x) / 2, extr.min.y + (extr.max.y - extr.min.y) / 2);
        }
        return this._center;
    }


    /**
     * @inheritDoc
     */
    resize(x, y, point, extrenum){
        for(let element of this.elements){
            element.resize(x,y,point, extrenum);
        }
        this._center=null;
    }

    /**
     * Moves an item by the specified number of units along the x and y axis
     * @param {number} x - how much to shift by x
     * @param {number} y - how much to shift by x
     */
    move(x,y){
        for(let el of this.elements){
            el.move(x,y);
        }
        this._center=null;
    }

    /**
     * @inheritDoc
     */
    mirror(axis, center){
        for(let element of this.elements){
            element.mirror(axis, center);
        }
        this._center=null;
    }

    /**
     * @inheritDoc
     * @param {LineType} lineType
     */
    set lineType(lineType){
        for(let el of this.elements){
            el.lineType = lineType;
        }
        super.lineType = lineType;
    }


    /**
     * @inheritDoc
     * @return {LineType}
     */
    get lineType(){
        return super.lineType;
    }


    /**
     * @inheritDoc
     */
    generateNewId(){
        super.generateNewId();
        for(let el of this.elements){
            el.generateNewId();
        }
    }


    /**
     * @inheritDoc
     */
    getMagnificationPoints(){
        let res = [];
        for(let el of this.elements){
            res.push(...el.getMagnificationPoints());
        }
        res.push(this.getCenter());
        return res;
    }

    /**
     * @param {GraphicElement} element
     */
    addElement(element){
        this.elements.push(element);
        this._center=null;
    }

    /**
     * @param {Element} element
     */
    removeElement(element){
        for(let i=0; i<this.elements.length; i++){
            if (this.elements[i].compare(element)) {
                this.elements.splice(i, 1);
                return;
            }
        }

        for(let i=0; i<this.elements.length; i++){
            if(this.elements[i] instanceof Group){
                this.elements[i].removeElement(element);
                if(this.elements[i].elements.length==0){
                    this.elements.splice(i, 1);
                }
            }
        }
        this._center=null;
    }

    /**
     * @inheritDoc
     */
    isNear(point, eps){
        let res = false;
        for(let element of this.elements){
            res |= element.isNear(point, eps);
        }

        return res;
    }

    /**
     * @inheritDoc
     */
    isIntoFigure(figure){
        let res = true;
        for(let i=0; res && i<this.elements.length; i++){
            res &= this.elements[i].isIntoFigure(figure);
        }
        return res;
    }

    /**
     * @inheritDoc
     * @return {Group}
     */
    copy(){
        let res = new Group();
        for(let element of this.elements){
            res.addElement(element.copy());
        }
        res.height=this.height;
        res.id=this.id;
        res.lineType = this.lineType.copy();
        return res;
    }

    /**
     * @inheritDoc
     */
    toPolyLines(){
        let res = [];
        for(let element of this.elements){
            let polyLines = element.toPolyLines();
            for(let polyLine of polyLines){
                res.push(polyLine);
            }
        }
        return res;
    }

    /**
     * @inheritDoc
     * @return {Array.<GraphicElement>}
     */
    toSimpleElements(){
        let res = [];
        for(let el of this.elements){
            if(el.typeName == 'Group'){
                res.push(...el.toSimpleElements());
            }else{
                res.push(el);
            }
        }
        return res;
    }

    /**
     * @inheritDoc
     */
    rotate(center,grad){
        for(let el of this.elements){
            el.rotate(center, grad);
        }
        this._center=null;
    }

    // getCenter(){
    //     let ext = this.getExtrenum();
    //     return new Point(ext.min.x+(ext.max.x-ext.min.x)/2, ext.min.y+(ext.max.y-ext.min.y)/2);
    // }
}