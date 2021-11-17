/**
 * Created by dev on 30.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Tool from './Tool';

export default class ZoomTool extends Tool{
    constructor(document){
        super(document);

        this.name="Zoom";
        this.cursor.src = 'resources/images/Zoom.png';
    }

    mouseClick(point, e){

    }

    mouseDown(point, e){

    }

    mouseDbClick(point, e){
        this.mouseUp(point, e);
        this.mouseUp(point, e);
    }

    mouseUp(point, e){
        let zoom = 1;
        if(e.button == 0) { //left
            zoom+=0.1;
        }else{
            zoom-=0.1;
        }
        app.board.zoomAroundPoint(zoom,app.board._convertToLocalCoordinateSystem(point));
    }

    render(board){
        super.render(board);
    }
}