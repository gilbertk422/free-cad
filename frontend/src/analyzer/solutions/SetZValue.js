/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';

import ChangeElementsHeightCommand from '../../command/ChangeElementsHeightCommand';
import GraphicElement from "../../model/GraphicElement";
import DeleteElementCommand from "../../command/DeleteElementCommand";

export default class SetZValue extends Solution{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {number} height - in mm
     */
    constructor(document, elements, height){
        super(document);
        this.elements = elements;
        this.previewDoc=null;

        this.height=height;

        if(height==GraphicElement.AirInside){
            height="Air inside";
        }else {
            let dimension = 'mm';
            if (container.resolve('config').dimension != 'Millimeters') {
                dimension = "''";
                height /= 25.4;
            }
            height = height.toFixed(3)+' '+dimension;
        }
        this.name="Set Z to "+height;
    }

    /**
     * @inheritDoc
     */
    execute(){
        return new Promise((resolve, reject)=>{
            app.executeCommand(new ChangeElementsHeightCommand(this.document, this.elements, this.height)).then(res=>{
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
