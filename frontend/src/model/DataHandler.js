/**
 * Copyright (c) 2019 Micro Logic Corp.
 *
 * The class need for adding data handlers
 *
 * @interface
 */
export default class DataHandler {

    /**
     * The method can change the document
     * @param {Document} document
     * @return {boolean} - true if the document was change
     * @abstract
     */
    handle(document){
        throw new Exception(`The method doesn't have impalementation`);
    }
}