/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Solution from './../Solution';


export default class NoChanges extends Solution{

    constructor(document){
        super(document);

        this.name = 'No changes';
        this.previewDocument = null;
    }

    execute(){
        return new Promise(resolve=>{
            resolve(true);
        })
    }

    getPreviewDocument(){
        if(!this.previewDocument) {
            return this.document;
        }else{
            return this.previewDocument;
        }
    }
}