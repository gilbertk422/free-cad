/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import LineType from './LineType';

/**
 * @abstract
 */
export default class Comment extends LineType{

    static TYPE_SOLID = "Solid";
    static TYPE_DASHES = "Striple";
    static TYPE_FONT = "Font";
    static TYPE_ARROW = "Arrow";
    static TYPE_DIMENSION = "Dimension";

    constructor(){
        super();

        this.type = Comment.TYPE_SOLID;

        this.name='Comment';
    }


    /**
     * @inheritDoc
     * @return {Array.<{propName: value}>}
     */
    getLineStyle(){
        let res = super.getLineStyle();

        if(this.type==Comment.TYPE_DASHES){
            res['dash']=[6,4];
        }
        res['type']=this.type;
        return res;
    }


}