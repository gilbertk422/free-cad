/**
 * Created by dev on 06.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * @abstract
 * The class implemented {@class Cloneable}
 */
export default class LineType{
    constructor(){
        this.name ='Auto';
        this.label = "Auto";

        this.helpURL = "";
        this.id=14;
    }

    /**
     * The method is used to draw a line when rendering a render. As properties are used the name of styles for canvas.
     * @return {Array.<{propName:value}>}
     */
    getLineStyle(){
        let res = [];
        res['lineWidth']=1;
        res['dash']=[];
        res['type']='Solid';
        res['strokeStyle']='#222222';
        res['fillStyle']='#222222';
        return res;
    }
}