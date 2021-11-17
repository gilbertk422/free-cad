/**
 * Created by dev on 04.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import CreatorTool from '../CreatorTool';
import PolyLine from '../../../../model/math/PolyLine'
import Group from '../../../../model/elements/Group';
import Spline from '../../../../model/elements/Spline';


export default class FreehandTool extends CreatorTool{
    constructor(document){
        super(document);

        /** @type {PolyLine} */
        this.polyline = null;

        this.name="Freehand";
    }


    mouseMove(point, e){
        super.mouseMove(point);
        if(this.polyline){
            this.polyline.addPoint(point);
        }
        return true;
    }

    /**
     * @inheritDoc
     */
    mouseDbClick(point, e){
    }


    mouseClick(point, e){
    }


    mouseDown(point, e){
        if(!this.polyline){
            this.polyline = new (container.resolve('math')).PolyLine();
        }
    }

    mouseUp(point, e){
        if(this.polyline){
            let points = this.polyline.points;
            if(points.length>4) {
                let group = new Group();
                for(let i=0; (i+4)<=points.length; i+=3){
                    //todo: check maybe it's line
                    let spline = new Spline(points[i], points[i+3].copy());
                    spline.controlPoint1 = points[i+1];
                    spline.controlPoint2 = points[i+2];
                    group.addElement(spline);
                }
                this.addElementToDocument(group);
            }
            this.polyline=null;
        }
    }

    render(board){
        if(this.polyline){
            let points = this.polyline.points;
            if(points.length>1) {
                app.board.drawPolyLine(points);
            }
        }
        super.render(board);
    }
}