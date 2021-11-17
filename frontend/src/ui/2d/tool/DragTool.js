/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Tool from './Tool'


export default class DragTool extends Tool{

    constructor(document){
        super(document);

        this._mouseDown = false;

        this.name="Drag";

        this.cursor=null;
    }


    mouseMove(point){
        return false;
    }

    mouseDbClick(point){

        return false;
    }

    mouseClick(point){}

    mouseDown(point, e){
        return false;
    }

    mouseUp(point, e){
        return false;
    }

}