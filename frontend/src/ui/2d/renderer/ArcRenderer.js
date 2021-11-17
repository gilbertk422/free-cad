/**
 * Created by dev on 14.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Render from './Render';
import Arc from '../../../model/elements/Arc';

export default class ArcRenderer extends Render{
    /**
     * @param {Arc} element
     */
    constructor(element) {
        if(!element instanceof Arc){
            throw new Exception('The renderer can render only Arc objects');
        }
        super(element);
    }

    /**
     * @inheritDoc
     */
    drawElement(board){
        /** @var {Arc} */
        let e = this.element;
        if(e.lineType.name=='Thread'){
            let r = e.lineType.processing[0].majorDiameter/2;
            board.drawArc(e.center, r, 0, 270);
            board.drawLine(
                new (container.resolve('math')).Point(e.center.x+r, e.center.y, e.center.z),
            new (container.resolve('math')).Point(e.center.x+e.radius, e.center.y, e.center.z)
            );
        }
        board.drawArc(e.center, e.radius, e.startAngle, e.endAngle);
    }
}
