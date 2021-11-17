/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * The class is need 
 * @abstract
 */
export default class Solution{

    /**
     * @param {Document} document
     */
    constructor(document){
        this.document = document;
        this.name = "Solution name";
    }

    /**
     * The method change the document with using a {@class Command}
     * @return {Promise.<boolean>}
     */
    execute(){
        
    }

    /**
     * @return {Document}
     */
    getPreviewDocument(){

    }
}