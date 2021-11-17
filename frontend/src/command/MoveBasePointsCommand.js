/**
 * Created by dev on 28.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import Document from '../model/Document';
import Spline from '../model/elements/Spline';
import Arc from '../model/elements/Arc';

let Matrix = container.resolve('math').Matrix;
let Trigonometric = container.resolve('math').Trigonometric;
/**
 * @inheritDoc
 */
export default class MoveBasePointsCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements - list of
     * @param {Point} point
     * @param {Vector} vector
     */
    constructor(document, elements, point, vector){
        super(document, elements);

        this.point=point;

        this.vector=vector;
        this.name='MoveBasePointsCommand';

        let scale = container.resolve('mainBoard')._scale; //todo: maybe set from the using place
        this.Eps = (scale>1?0.2:0.05)/scale;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        /** @type {Array.<{element:GraphicElement, point:Point}>} */
        let movePoints = this._reduceElementsWithPoints();

        if(movePoints.length==0) {
            return false;
        }

        let moveMatrix = Matrix.createMoveMatrix(this.vector.x, this.vector.y);
        for(let {point, element} of movePoints) {
            if(element instanceof Spline){
                this._changeSpline(element, point, moveMatrix);
            }else if(element instanceof Arc){
                this._changeArc(element, point, moveMatrix);
            }else {
                point.changeByMatrix(moveMatrix);
            }
        }
        return true;
    }

    /**
     * @param {Arc} arc
     * @param {Point} point
     * @param {Matrix} matrix
     * @private
     */
    _changeArc(arc, point, matrix){
        if(arc.incrementAngle==360){
            return;
        }
        let startPoint = new (container.resolve('math')).Point();
        startPoint.x = arc.center.x + arc.radius * Math.cos(Trigonometric.gradToRad(arc.startAngle));
        startPoint.y = arc.center.y + arc.radius * Math.sin(Trigonometric.gradToRad(arc.startAngle));
        let newPoint = point.copy();

        newPoint.changeByMatrix(matrix);

        if(point.isNear(startPoint, this.Eps)){
            let l1 = new (container.resolve('math')).Line(arc.center, startPoint);
            let l2 = new (container.resolve('math')).Line(arc.center, newPoint);

            let angle = l1.toVector().getAngle(l2.toVector());
            arc.startAngle=arc.startAngle+angle;

            return;
        }
        let endPoint = new (container.resolve('math')).Point();
        endPoint.x = arc.center.x + arc.radius * Math.cos(Trigonometric.gradToRad(arc.endAngle));
        endPoint.y = arc.center.y + arc.radius * Math.sin(Trigonometric.gradToRad(arc.endAngle));

        if(point.isNear(endPoint, this.Eps)){
            let l1 =  new (container.resolve('math')).Line(arc.center, endPoint);
            let l2 =  new (container.resolve('math')).Line(arc.center, newPoint);

            let angle = l1.toVector().getAngle(l2.toVector());
            arc.endAngle=arc.endAngle+angle;

            return;
        }


    }


    _changeSpline(element, point, matrix){
        if(point.compare(element.startPoint)){
            element.controlPoint1.changeByMatrix(matrix);
        }else if(point.compare(element.endPoint)){
            element.controlPoint2.changeByMatrix(matrix);
        }
        point.changeByMatrix(matrix);
    }

    /**
     * @return {Array.<{element:GraphicElement, point:Point}>}
     * @private
     */
    _reduceElementsWithPoints(){
        let simpleElements = Document.toSimpleListElements(this.elements);


        let movePoints = [];

        for(let element of simpleElements){
            let points = element.getMagnificationPoints();
            if(element instanceof Arc){
                points = element.extremePoints;
                if(!points){
                    continue;
                }
            }
            for(let point of points){
                if(point.isNear(this.point, this.Eps*1.5)){
                    movePoints.push({element:element, point:point});
                }
            }
        }
        return movePoints;
    }
}