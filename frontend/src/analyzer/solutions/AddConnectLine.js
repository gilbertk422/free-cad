/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';
import DeleteElementCommand from "../../command/DeleteElementCommand";
import AddElementCommand from "../../command/AddElementCommand";


export default class AddConnectLine extends Solution{

    /**
     * @param {Document} document
     * @param {GraphicElement} element
     */
    constructor(document, element){
        super(document);
        this.name = "Add connector";

        this.element = element;

        this.previewDoc = document.getSnapshot();
        let previeElement = element.copy();
        previeElement._renderer.error=true;
        this.previewDoc.addElement(previeElement);

    }

    /**
     * @inheritDoc
     */
    execute(){
        return new Promise((resolve, reject)=>{
            app.executeCommand(new AddElementCommand(this.document, this.element)).then(res=>{
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