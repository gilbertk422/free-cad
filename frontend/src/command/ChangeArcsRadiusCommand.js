/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ElementModificationCommand from './ElementModificationCommand';

import Arc from '../model/elements/Arc';
import Exception from '../Exception';


export default class ChangeArcsRadiusCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Arc>} circles
     * @param {number} radius
     */
    constructor(document, circles, radius){
        super(document, circles);

        for(let circle of circles){
            if(!circle instanceof Arc){
                throw new Exception('The ChangeArcsRadiusCommand available only for circles and arcs!', circle);
            }
        }
        this._radius = radius;

        this.name= 'ChangeArcsRadiusCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements) {
            el.radius=this._radius;
        }
        return true;
    }
}