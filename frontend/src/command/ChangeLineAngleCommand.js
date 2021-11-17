/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

import LineElement from '../model/elements/LineElement';

export default class ChangeLineAngleCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} angle
     */
    constructor(document, elements, angle){
        super(document, elements);

        if(!elements || elements.length!=1){
            throw new Exception('For use the function must be selected only one Line element!');
        }
        if(!elements[0] instanceof LineElement){
            throw new Exception('For use the function must be selected Line element!');
        }

        this.angle=angle;

        this.name= 'ChangeLineAngleCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        /** @type {Line} */
        let line  = this.elements[0]._line;

        let angle  = new (container.resolve('math')).Vector(1).getAngle(line.toVector());

        let deltaAngle = angle-this.angle;

        let center = this.elements[0].getCenter();

        this.elements[0].rotate(center, deltaAngle);

        return true;
    }
}