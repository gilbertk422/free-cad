/**
 * Created by dev on 25.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand'
import Arc from './../model/elements/Arc';
import Exception from './../Exception';

export default class ChangeArcAngleCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Arc>} elements
     * @param {number} insideAngle
     * @param {number} startAngle
     */
    constructor(document, elements, insideAngle=null, startAngle=null){
        super(document, elements);

        this.insideAngle = insideAngle;
        this.startAngle = startAngle;

        this.name= 'ChangeArcAngleCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        if(this.insideAngle==null && this.startAngle==null){
            throw new Exception('insideAngle and startAngle can\'t be null at the same time', this);
        }

        for(let el of this.elements){
            if(!el instanceof Arc || el.incrementAngle==360){
                throw new Exception('The method works only for Arcs!', el);
            }
        }

        if(this.insideAngle!=null) {
            for (let el of this.elements) {
                el.incrementAngle = this.insideAngle;
            }
        }
        if(this.startAngle!=null){
            for (let el of this.elements) {
                let oldInsideAngle = el.incrementAngle;
                el.startAngle = this.startAngle;
                el.endAngle = (el.startAngle+oldInsideAngle)%360;
            }
        }
        return true;
    }
}