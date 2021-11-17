/**
 * Created by dev on 14.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Render from './Render';

export default class SplineRenderer extends Render{
    constructor(element){
        super(element);
    }

    /**
     * @inheritDoc
     */
    drawElement(board){
        board.drawBezier(this.element.startPoint, this.element.controlPoint1, this.element.controlPoint2, this.element.endPoint);
        // board.style('fillStyle', '#ff0000');
        // board.drawArc(this.element.startPoint, 0.2, 0,0, true);
        // board.drawArc(this.element.endPoint, 0.2,0,0, true);
        // board.drawArc(this.element.controlPoint1, 0.2, 0,0,true);
        // board.drawArc(this.element.controlPoint2, 0.2, 0,0,true);
    }

    drawMagnificationPoints(board){
        board.style('dash', [5, 5]);
        board.style('strokeStyle', '#555555');
        board.drawLine(this.element.startPoint, this.element.controlPoint1);
        board.drawLine(this.element.endPoint, this.element.controlPoint2);
        super.drawMagnificationPoints(board);
    }
}