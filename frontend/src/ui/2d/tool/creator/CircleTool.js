/**
 * Created by dev on 14.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import CreatorToolsInTwoSteps from './CreatorToolsInTwoSteps';
import Arc from '../../../../model/elements/Arc'

export default class CircleTool extends CreatorToolsInTwoSteps{
    constructor(document){
        super(document);
        this.cursor.src = 'resources/images/Circle.png';
        this.name="Circle";
    }

    /**
     * @return {Arc}
     */
    get circle(){
        return this._element;
    }

    setPosition2(point){
        this.circle.radius=this.circle.center.distanceTo(point);
    }

    createElement(point){
        let element = new Arc(point, 0);
        element.lineType = this._lineType=container.resolve('lineTypeFactory', [element, true]);
        return element;
    }
}