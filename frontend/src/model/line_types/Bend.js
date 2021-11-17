/**
 * Created by dev on 22.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ProcessingLineType from './ProcessingLineType';
import BendProcessing from "./processings/Bend";

export default class Bend extends ProcessingLineType{
    constructor(){
        super();
        this.name='Bend';
        this.label = "Bend";
        this.id=6;
        this.processing.push(new BendProcessing());

        this.helpURL="https://www.emachineshop.com/help-bend-drawing/";
    }

    /**
     * @inheritDoc
     * @return {Bend}
     */
    copy(){
        let res = new Bend();
        res.processing=[];
        for(let p of this.processing){
            res.processing.push(p.copy());
        }
        return res;
    }

    /**
     * @inheritDoc
     * @return {Array.<{propName: value}>}
     */
    getLineStyle(){
        let res = super.getLineStyle();
        res['strokeStyle']='#4dff4d';
        res['fillStyle']='#4dff4d';
        return res;
    }
}