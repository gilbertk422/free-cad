/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';

import DeleteElementCommand from '../../command/DeleteElementCommand';

export default class RemoveElement extends Solution{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {Document} previewDoc
     */
    constructor(document, elements, previewDoc){
        super(document);
        this.elements = elements;
        this.previewDoc=previewDoc;

        this.name="Remove";
    }

    /**
     * @inheritDoc
     */
    execute(){
        return app.executeCommand(new DeleteElementCommand(this.document, this.elements));
    }

    /**
     * @inheritDoc
     * @return {Document}
     */
    getPreviewDocument(){
        return this.previewDoc;
    }

}
