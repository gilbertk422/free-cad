/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';
import MergeElementsCommand from "../../command/MergeElementsCommand";
import Auto from '../../model/line_types/Auto'


export default class Merge extends Solution{

    /**
     * @param {Document} document
     * @param {Array.<LineElement>} lines
     * @param {boolean} withAutoLineType - if true the new line element well be with Auto line type
     */
    constructor(document, lines, withAutoLineType){
        super(document);
        this.name = "Merge";

        this.lines = lines;

        this.lineType = null;
        if(withAutoLineType){
            this.lineType = new Auto();
        }

        this.previewDoc = document.getSnapshot();
    }

    /**
     * @inheritDoc
     */
    execute(){
        return new Promise((resolve, reject)=>{
            app.executeCommand(new MergeElementsCommand(this.document, this.lines, this.lineType)).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /**
     * @inheritDoc
     * @return {Document}
     */
    getPreviewDocument(){
        return this.previewDoc;
    }

}