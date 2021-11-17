/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import Bend from "../../model/line_types/Bend";

export default class CrossBends extends Rule{
    constructor(document){
        super(document);

        this.errorMessage = "Error: Bend lines intersect.";
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
        /** @type {Array.<LineElement>} - because bend can be only by line*/
        let bends = doc.getListSimpleElements().filter(el=>el.lineType instanceof Bend);

        for(let i=0; i<bends.length; i++){
            for(let j=i+1; j<bends.length; j++){
                if(bends[i]._line.getCrossPoint(bends[j]._line)!=null){
                    return [bends[i], bends[j]];
                }
            }
        }
        return null;
    }

}
