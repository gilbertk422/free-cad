/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import LineType from './LineType';

export default class ProcessingLineType extends  LineType{

    constructor(){
        super();

        this.processing = [];
    }


    addProcessing(processing){
        this.processing.push(processing);
    }

}