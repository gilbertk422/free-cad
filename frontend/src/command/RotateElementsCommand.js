/**
 * Created by dev on 28.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ElementModificationCommand from './ElementModificationCommand';
import Group from '../model/elements/Group'

export default class RotateElementsCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {number} angle
     * @param {Point} center
     */
    constructor(document, elements, angle, center){
        super(document, elements);

        this.angle=angle;

        this.center= center;

        this.name= 'RotateElementsCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        let group = new Group();
        for(let el of this.elements) {
            group.addElement(el);
        }
        if(!this.center) {
            this.center = group.getCenter();
        }
        group.rotate(this.center, this.angle);
        return true;
    }
}