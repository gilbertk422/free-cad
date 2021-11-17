/**
 * Created by dev on 09.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import LineElement from '../../../model/elements/LineElement';
import Arc from '../../../model/elements/Arc';
import Render from './Render';

import LineArc from "../../../model/math/algorithms/intersects/LineArc";
import Comment from "../../../model/line_types/Comment";

let Trigonometric = container.resolve('math').Trigonometric;
let lineArcIntersector = new LineArc();

export default class LineRenderer extends Render{
    /**
     * @param {LineElement} element
     */
    constructor(element){
        if(!element instanceof LineElement){
            throw new Exception('The renderer can render only LineElement objects');
        }
        super(element);
    }

    /**
     * @inheritDoc
     */
    drawElement(board){
        board.drawLine(this.element.p1, this.element.p2);

        if ((this.element.lineType.name=='Comment to Machinist' || this.element.lineType.name=='Comment to Self') &&
            (this.element.lineType.type== Comment.TYPE_DIMENSION || this.element.lineType.type== Comment.TYPE_ARROW) &&
            !this.new) {
            this._renderPointers(board);
        }
    }
    
    
    _renderPointers(board){
        if(this.element.length()<2){
            return;
        }

        let circleRadius = 14/(board._pixelPerOne*board._scale);
        if(this.element.length()/2<circleRadius){
            return;
        }
        switch (this.element.lineType.type) {
            case Comment.TYPE_DIMENSION:
                this.drawDimensionText(board);

                let vector = this.element.copy();
                vector.rotate(vector.p1, 35);
                let circle = new Arc(vector.p1, circleRadius);
                let crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p1, crossPoint[0]);
                }

                vector = this.element.copy();
                vector.rotate(vector.p1, -35);
                circle = new Arc(vector.p1, circleRadius);
                crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p1, crossPoint[0]);
                }



                vector = this.element.copy();
                vector.rotate(vector.p2, -89.9);
                circle = new Arc(vector.p2, circleRadius);
                crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p2, crossPoint[0]);
                }


                vector = this.element.copy();
                vector.rotate(vector.p2, 89.9);
                circle = new Arc(vector.p2, circleRadius);
                crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p2, crossPoint[0]);
                }


                vector = this.element.copy();
                vector.rotate(vector.p1, -89.9);
                circle = new Arc(vector.p1, circleRadius);
                crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p1, crossPoint[0]);
                }

                vector = this.element.copy();
                vector.rotate(vector.p1, 89.9);
                circle = new Arc(vector.p1, circleRadius);
                crossPoint = lineArcIntersector.getIntersectPoints(vector, circle);
                if (crossPoint) {
                    board.drawLine(vector.p1, crossPoint[0]);
                }


            case Comment.TYPE_ARROW:
                let vector1 = this.element.copy();
                vector1.rotate(vector1.p2, 35);
                let circle1 = new Arc(vector1.p2, circleRadius);
                let crossPoint1 = lineArcIntersector.getIntersectPoints(vector1, circle1);
                if (crossPoint1) {
                    board.drawLine(vector1.p2, crossPoint1[0]);
                }

                vector1 = this.element.copy();
                vector1.rotate(vector1.p2, -35);
                circle1 = new Arc(vector1.p2, circleRadius);
                crossPoint1 = lineArcIntersector.getIntersectPoints(vector1, circle1);
                if (crossPoint1) {
                    board.drawLine(vector1.p2, crossPoint1[0]);
                }
        }
    }


    /**
     * @private
     */
    drawDimensionText(board){
        let grad = Trigonometric.radToGrad(Math.atan(this.element._line.A/this.element._line.B));
        let height = 8;//board._pixelPerOne / 4 *board._scale;

        board.style('font',height + 'pt Arial');
        board.style('textAlign','center');
        board.style('textBaseline','bottom');

        let dimension = 'mm';
        let length = this.element.length();
        if(app.config.dimension == 'Inches'){
            dimension = "''";
            length/=25.4;
        }
        let text = length.toFixed(3)+" "+dimension;
        board.drawText(this.element.getCenter(),text, grad, false);
    }
}