/**
 * Created by dev on 31.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import MagnificationDecorator from './MagnificationDecorator';

const Point = (container.resolve('math')).Point;

export default class MagnificationCreatorToolDecorator extends MagnificationDecorator{

    /**
     * @param document
     * @param {CreatorTool} tool
     */
    constructor(document, tool){
        super(document, tool);

        /** @type {Point} */
        this.magnitPoint = null;
    }

    /**
     * @inheritDoc
     */
    mouseMove(point, e){
        point = this.magnificPoint(point);
        this._selectNearElements(point);
        return this._tool.mouseMove(point, e);
    }

    /**
     * @inheritDoc
     */
    mouseDbClick(point, e){
        return super.mouseDbClick(this.magnificPoint(point), e);
    }

    /**
     * @inheritDoc
     */
    mouseClick(point, e){
        return super.mouseClick(this.magnificPoint(point), e);
    }

    /**
     * @inheritDoc
     */
    mouseDown(point, e){
        return super.mouseDown(this.magnificPoint(point), e);
    }

    /**
     * @inheritDoc
     */
    mouseUp(point, e){
        return super.mouseUp(this.magnificPoint(point), e);
    }

    render(board){
        if(this.magnitPoint){
            super.renderPoint(this.magnitPoint, '#000000');
        }
        return super.render(board);
    }

    selectElements(elements){
        //todo: check if the tool is SelectTool then ok else throw some exception
        return this._tool.selectElements(elements);
    }


    clearSelectElements(){
        this._tool.clearSelectElements();
    }

    magnificPoint(point){
        if(Helper.Key.ctrlKey && Helper.Key.shiftKey){
            return new Point(Math.round(point.x), Math.round(point.y));
        }

        let nearPoint = this._getNearPoint(point);
        this.magnitPoint=nearPoint;
        if(nearPoint && point.distanceTo(nearPoint)<this.Eps*3){
            point = nearPoint.copy();
        }
        return point
    }


    /**
     * @return {Array.<Point>} - list points for magnification
     * @protected
     */
    getPointsList(){
        return app.currentDocument._elements.reduce((res,el)=>[...res,...el.getMagnificationPoints()],[]);
    }

    /**
     * @param {Point} point
     * @private
     */
    _getNearPoint(point){
        let points = this.getPointsList();
        if(points.length>0) {
            let min = points[0];
            let mind = point.distanceTo(min);
            for(let i=1; i<points.length; i++){
                let d = point.distanceTo(points[i]);
                if(mind>d){
                    min=points[i];
                    mind=d;
                }
            }

            let el = app.currentDocument._elements.find(el => el.getMagnificationPoints().find(p => p.compare(min)));
            super.setHighlightElement(el);
            return min;
        } else {
            super.setHighlightElement(null);
            return null;
        }
    }
    
    _selectNearElements(point){
        let _elements = this._document.getNearElements(point, this.Eps);
        for(let element of _elements){
            element._renderer.setFocus(true);
        }
    }
}