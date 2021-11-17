/**
 * Created by dev on 11.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import CreatorToolsInTwoSteps from './CreatorToolsInTwoSteps';
import RectElement from '../../../../model/elements/RectElement'

export default class RectTool extends CreatorToolsInTwoSteps{
    constructor(document){
        super(document);

        this.cursor.src = 'resources/images/Rectangle.png';

        this.name="Rectangle";
    }

    get graphicElement(){
        if(this._element) {
            return this._element.toElement();
        }else{
            return null;
        }
    }

    /**
     * @return {RectElement}
     */
    get rect(){
        return this._element;
    }

    setPosition2(point){
        this.rect.p2=point;
    }

    createElement(point){
        let element = new RectElement(point, point);
        element.lineType = this._lineType=container.resolve('lineTypeFactory', [element, true]);
        return element;
    }
}