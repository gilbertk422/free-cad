
/**
 * Created by dev on 05.12.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';

import DeleteElementCommand from '../../command/DeleteElementCommand';
import UngroupCommand from "../../command/UngroupCommand";

export default class ConvertText extends Solution{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {Document} previewDoc
     */
    constructor(document, elements, previewDoc){
        super(document);
        this.elements = elements;
        this.previewDoc=previewDoc;

        this.name="Convert text";
    }

    /**
     * @inheritDoc
     */
    execute(){
        return app.executeCommand(new UngroupCommand(this.document, this.elements));
    }

    /**
     * @inheritDoc
     * @return {Document}
     */
    getPreviewDocument(){
        return this.previewDoc;
    }

}
