/**
 * Created by dev on 14.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import CreatorToolsInTwoSteps from './CreatorToolsInTwoSteps';
import Spline from '../../../../model/elements/Spline';
import LineElement from '../../../../model/elements/LineElement';

export default class SplineTool extends CreatorToolsInTwoSteps{
    constructor(document){
        super(document);
        this.cursor.src = 'resources/images/Spline.png';

        this.name="Spline";
    }

    /**
     * @return {Spline}
     */
    get spline(){
        return this._element;
    }

    setPosition2(point){
        this.spline.endPoint=point;
        let line = new LineElement(this.spline.startPoint.copy(),  point.copy()); //todo: need use math line
        let center = line.getCenter();
        line.rotate(center,65);
        this.spline.controlPoint1 = line.p1;
        this.spline.controlPoint2 = line.p2;
    }

    createElement(point){
        let element = new Spline(point, point);
        this._element=element;
        this.setPosition2(point);

        element.lineType = this._lineType=container.resolve('lineTypeFactory', [element, true]);
        return element;
    }

}