/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import Bend from "../../model/line_types/Bend";
import ShapeBuilder from "../ShapeBuilder";

export default class TooCloseBends extends Rule{
    constructor(document){
        super(document);

        this.height = 0;
    }

    set errorMessage(message){

    }

    get errorMessage(){
        let dimension = "mm";
        let h = this.height*8;
        if(container.resolve('config').dimension=="Inches"){
            dimension =  "''";
            h=(h/25.4).toFixed(3);
        }

        return `Error: The highlighted bend lines are too close to each other - please separate by at least ${h} ${dimension}.`;
    }

    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        return this.getCrossBendsByDocument(this.document)!=null;
    }

    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        let crossBends = this.getCrossBendsByDocument(res[0].document);
        for(let el of crossBends){
            el._renderer.error=true;
        }

        return res;
    }

    /**
     *
     * @param {Document} doc
     * @return {Array.<LineElement>|null}
     * @private
     */
    getCrossBendsByDocument(doc){
        let shapes = new ShapeBuilder(doc).buildShapes();

        for(let shape of shapes){
            /** @type {Array.<LineElement> } */
            let bends = shape.bends;
            let height = shape.height;

            for(let i=0; i<bends.length; i++){
                for(let j=i+1; j<bends.length; j++){
                    if((bends[i]._line.distanceTo(bends[j].p1)<height*8 || bends[i]._line.distanceTo(bends[j].p2)<height*8 ||
                        bends[j]._line.distanceTo(bends[i].p1)<height*8 || bends[j]._line.distanceTo(bends[i].p2)<height*8) &&
                        !(Helper.Math.equals(bends[i]._line.b,bends[j]._line.b) && Helper.Math.equals(bends[i]._line.k,bends[j]._line.k))){
                        this.height=height;
                        return [bends[i], bends[j]];
                    }
                }
            }
        }
        return null;
    }

}
