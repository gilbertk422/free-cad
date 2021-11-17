
/**
 * Created by dev on 16.07.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ProcessingLineType from './ProcessingLineType';
import ThreadProcessing from "./processings/Thread";

export default class Thread extends ProcessingLineType{
    constructor(){
        super();
        this.name='Thread';
        this.label = "Thread";
        this.id=41;
        let processingList = ThreadProcessing.getListTrheadsByType(ThreadProcessing.TYPE_UN);
        let processing = processingList.find(p=>p.size=="1/4-20" || p.size=="M6x1");
        this.processing.push(processing.copy());
        this.helpURL="https://www.emachineshop.com/help-line-types/#tap-and-thread";
    }

    /**
     * @inheritDoc
     * @return {Thread}
     */
    copy(){
        let res = new Thread();
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
        res['strokeStyle']='#365224';
        res['fillStyle']='#436832';
        return res;
    }
}