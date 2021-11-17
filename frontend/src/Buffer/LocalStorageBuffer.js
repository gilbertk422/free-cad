/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Buffer from './Buffer';
import XmlFileLoader from "../file/XmlFileLoader";
import Document from './../model/Document';

export default class LocalStorageBuffer extends Buffer{
    constructor(app){
        super(app);

        this.countPastOperation = 0;
    }

    copy(){
        let doc = new Document();
        for(let el of this.app.selectElements){
            doc.addElement(el.copy());
        }
        let loader  = new XmlFileLoader();
        let xml = loader.convertInXML(doc);
        localStorage.setItem('buffer', xml);
        this.countPastOperation=0;
    }

    paste(){
        let data = localStorage.getItem('buffer');
        if(data){
            this.countPastOperation++;
            let loader  = new XmlFileLoader();
            loader.convertDataToDocument(data).then(doc=>{
                this.app.pasteElements(doc._elements, this.app.config.moveStep*this.countPastOperation, 0).then(res=>{
                    if(res){
                        container.resolve('mainBoard').zoomToFitScreen();
                    }
                });
            });
        }
    }

    cut(){
        this.copy();
        this.app.deleteSelected();
    }
}