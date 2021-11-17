/**
 * Created by dev on 05.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import MagnificationCreatorToolDecorator from './MagnificationCreatorToolDecorator';

export default class MagnificationEditLineDecorator extends MagnificationCreatorToolDecorator{
    /**
     * @param document
     * @param {CreatorTool} tool
     */
    constructor(document, tool){
        super(document, tool);
    }

    render(board){
        if(this.tool.edited){
            return super.render(board);
        }
        return this.tool.render(board);
    }

    getPointsList(){
        return app.currentDocument._elements.reduce((res,el)=> {
            for(let selectElement of app.selectElements){
                if(selectElement.compare(el)){
                    return res;
                }
            }
            return [...res, ...el.getMagnificationPoints()];
        },[]);
    }

}