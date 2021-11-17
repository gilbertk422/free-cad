/**
 * Created by dev on 31.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Tool from './Tool';

export default class CreatorTool extends Tool{
    constructor(document){
        super(document);
    }

    addElementToDocument(element){
        app.addElement(element);
    }
    
}