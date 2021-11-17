/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './Command';

export default class ChangeBendRadiusCommand extends Command{
    /**
     * @param {Document} document
     * @param {number} radius
     */
    constructor(document, radius){
        super(document);

        let elements = document.getListSimpleElements();

        let hasBend = false;
        for(let el of elements){
            hasBend = hasBend || el.lineType.name=="Bend";
        }

        if(!hasBend){
            throw new Exception('For use the function the document must have minimum one bend!');
        }

        this.radius=radius;

        this.name= 'ChangeBendRadiusCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        let elements = this.document.getListSimpleElements();

        for(let el of elements){
            if(el.lineType.name=="Bend"){
                el.lineType.processing[0].radius=this.radius;
            }
        }
        return true;
    }
}