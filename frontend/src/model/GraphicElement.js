/**
 * Created by dev on 04.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

let Point = container.resolve('math').Point;
let Matrix = container.resolve('math').Matrix;

/**
 * The class is abstraction of graphic elements.
 *
 * An implementation of this class is used to represent the data structure of the document.
 *
 * The class implemented {@class Cloneable} and {@class Renderable}
 *
 * @abstract
 */
export default class GraphicElement{
    
    static get AirInside(){
        return -1E8;
    }


    constructor(){

        /** @var {number} - is unique identifier */
        this.id=container.resolve('elementIdGenerator').generateId();

        this._height = container.resolve('config').defaultZValue;

        /** @var {Array.<Point>} */
        this._points = [];

        /** @var {Render} */
        this._renderer = null; //todo: transfer the creation of a new sample from GraphicElement classes to a IOC container

        /** @var {LineType} */
        this._lineType=null;

        this.typeName= ""; //todo: understand  instanceof and remove this shit
    }

    /**
     * @param {number} value
     */
    set height(value){
        this._height=value;
    }

    /**
     * @return {number}
     */
    get height(){
        return this._height;
    }

    /**
     * @abstract
     * @return {Array.<Point>|null} - the points are end points in a contour.
     * For example: for {@class Arc} the point is the start point of the arc and the end point of the arc
     * null - if the element doesn't have extreme any points
     */
    get extremePoints(){
        throw new Exception('The method doesn\'t have implementation.');
    }

    /**
     * @param {LineType} lineType
     */
    set lineType(lineType){
        this._lineType = lineType.copy();
    }

    /**
     * @return {LineType}
     */
    get lineType(){
        if(!this._lineType){
            this._lineType=container.resolve('lineTypeFactory', [this]);
        }
        return this._lineType;
    }


    /**
     * The method renders some data structure using an instance of the {@class Render} class.
     */
    render(board){
        this._renderer.render(board);
    }

    resetRendererConfig(){
        this._renderer.resetConfig();
    }

    /**
     * The method regenerate ID for current element.
     * This may be necessary when we create an item based on a copy.
     */
    generateNewId(){
        this.id=container.resolve('elementIdGenerator').generateId();
    }

    /**
     * The method need for magnification mode
     * @return {Array.<Point>} - points that can be magnetised
     */
    getMagnificationPoints(){
        return [...this._points,this.getCenter()];
    }

    /**
     * Find max and min values by x and y for current element
     * @returns {{max:{x:number, y:number}, min:{x:number, y:number}}}
     */
    getExtrenum(){
        return Point.getExtrenum(this._points);
    }

    /**
     * Moves an item by the specified number of units along the x and y axis
     * @param {number} x - how much to shift by x
     * @param {number} y - how much to shift by x
     */
    move(x,y){
        let moveMatrix = Matrix.createMoveMatrix(x,y);
        for(let point of this._points){
            point.changeByMatrix(moveMatrix);
        }
    }

    /**
     * @param {Point} point
     * @return {boolean} - return true if the point is belong to the figure
     */
    isBelongsToTheElement(point){
        return false;
    }

    /**
     * @abstract
     * Check if the point is near the elements by Eps.
     * @param {Point} point
     * @param {float} eps
     * @return {boolean} - true if the point is near
     */
    isNear(point, eps){
        throw new Exception('The method doesn\'n have implementation.');
    }

    /**
     * @abstract
     * The method using for cross calculation.
     *
     * The method calculation of cross can hav error. The error depends on the level of discretization.
     * @return {Array.<PolyLine>} - array for group element
     */
    toPolyLines(){
        throw new Exception('The method doesn\'t have implementation.');
    }

    /**
     * @abstract
     * @deprecated The method can have an error if the figure is a concave element
     *
     * @param {ClosedFigure} figure
     * @return {boolean} - true if current elements into figure.
     */
    isIntoFigure(figure){
        throw new Exception('The method doesn\'n have implementation.');
    }

    /**
     * Calculates the geometric center of the shape.
     * @return {Point} - center of current element
     */
    getCenter(){

        let res = new (container.resolve('math')).Point();
        for(let p of this._points){
            res.x+=p.x;
            res.y+=p.y;
            res.y+=p.z;
        }
        res.x/=this._points.length;
        res.y/=this._points.length;
        res.z/=this._points.length;
        return res;
    }

    /**
     * @param {number} x - 
     * @param {number} y -
     * @param {Point} point - point relative to which the object will increase or decrease
     * @param  {{max:{x:number, y:number}, min:{x:number, y:number}}} extrenum - extrenum of all resize square
     * @abstract
     */
    resize(x, y, point, extrenum){
        throw new Exception('The method doesn\'n have implementation.');
    }

    /**
     * Rotate an element around a given center, a predetermined number of degrees
     * @param {Point} center - rotation center
     * @param {number} grad - rotation angle
     */
    rotate(center,grad){
        let rotateMatrix = Matrix.createRotateMatrix(grad);

        let moveMatrix = Matrix.createMoveMatrix(-center.x, -center.y);
        let removeMatrix = Matrix.createMoveMatrix(center.x, center.y);

        for(let point of this._points){
            point.changeByMatrix(moveMatrix);
            point.changeByMatrix(rotateMatrix);
            point.changeByMatrix(removeMatrix);
        }
    }

    /**
     * Mirrors the element relative to the selected axis
     * @param axis - the constant from {@class Trigonometric} class. [axisX|axisY]
     * @param center {Point}
     */
    mirror(axis, center){
        let mirrorMatrix = Matrix.createMirrorMatrix(axis);

        let moveMatrix = Matrix.createMoveMatrix(-center.x, -center.y);
        let removeMatrix = Matrix.createMoveMatrix(center.x, center.y);

        for(let point of this._points){
            point.changeByMatrix(moveMatrix);
            point.changeByMatrix(mirrorMatrix);
            point.changeByMatrix(removeMatrix);
        }
    }

    /**
     * @abstract
     * The method return list of elements which was made by intersection current element
     * @param {Array.<Point>} points  - the points must be in current element
     * @return {Array.<GraphicElement>}
     */
    intersectByPoints(points){
        throw new Exception('The method doesn\'n have implementation.');
    }

    /**
     * Compares two elements
     * @param {GraphicElement} element
     * @return {boolean} - true if id's of the elements are equals
     */
    compare(element){
        return this.id==element.id;
    }

    /**
     * The method is used to get rid of the data hierarchy.
     * @return {Array.<GraphicElement>}
     */
    toSimpleElements(){
        return [this];
    }
}