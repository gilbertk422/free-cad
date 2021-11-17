/**
 * Created by dev on 09.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import CreatorToolsInTwoSteps from './CreatorToolsInTwoSteps';
import LineElement from '../../../../model/elements/LineElement';
import Line from '../../../../model/math/Line';
import Matrix from '../../../../model/math/Matrix';

export default class LineTool extends CreatorToolsInTwoSteps{
    constructor(document){
        super(document);
        
        this.cursor.src = 'resources/images/Line.png';
        this.name="Line";
    }

    /**
     * @return {Line}
     */
    get line(){
        return this._element;
    }

    setPosition2(point){
        if(Helper.Key.ctrlKey && !Helper.Key.shiftKey) {
            point = this._discreteBy15Degrees(point);
        }
        this.line.p2=point;
    }

    /**
     * @param {Point} point
     * @return {Point}
     * @private
     */
    _discreteBy15Degrees(point){
        let tempPoint = this._element.p1.copy();
        tempPoint.x += 1;

        /** @type {Line} */
        let baseLine = new (container.resolve('math')).Line(this._element.p1.copy(), tempPoint);

        let tempLine = new LineElement(this._element.p1.copy(), point);
        
        let angle = baseLine.toVector().getAngle(tempLine._line.toVector());

        if(angle%15>7.5){
            tempLine.rotate(tempLine.p1, -(15-(angle%15)));
        }else {
            tempLine.rotate(tempLine.p1, angle % 15);
        }
        
        return tempLine.p2;
    }

    /**
     * @param point
     * @return {LineElement}
     */
    createElement(point){
        let element = new LineElement(point, point);
        element.lineType = this._lineType=container.resolve('lineTypeFactory', [element, true]);
        return element;
    }
}