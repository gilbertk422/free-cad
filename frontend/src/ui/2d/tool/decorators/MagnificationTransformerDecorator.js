/**
 * Created by dev on 14.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import MagnificationDecorator from './MagnificationDecorator';
import Point from '../../../../model/math/Point';
import Matrix from '../../../../model/math/Matrix';
import ResizeTransformer from './../transformer/ResizeTransformer';
import ResizeElementsCommand from "../../../../command/ResizeElementsCommand";

/**
 * The decorator shows the near points
 */
export default class MagnificationTransformerDecorator extends MagnificationDecorator{

    /**
     * @param document
     * @param {PointerTool} tool
     */
    constructor(document, tool){
        super(document, tool);

        this.magnitPoint = null;

        this.isMouseDown = false;

        /** @type {Point}*/
        this.anotherPoint = null;

        /** @type {Point}*/
        this.selectPoint = null;
        
        this.dx=0;
        this.dy=0;

        this.mousePosition=null;
    }

    /**
     * @inheritDoc
     */
    mouseMove(point, e){
        if(this.isMouseDown && this.tool.transformer  && this.tool.transformer._downPosition){
            this.dx += point.x-this.mousePosition.x;
            this.dy += point.y-this.mousePosition.y;

            this.mousePosition = point.copy();
            let pointPair = this._getPointPair(app.selectElements, point);
            this.selectPoint = pointPair.select;
            this.anotherPoint = pointPair.another;
            if (this.selectPoint && this.anotherPoint) {
                if (this.selectPoint.distanceTo(this.anotherPoint) < this.Eps * 3) {
                    point.x += (this.anotherPoint.x-this.selectPoint.x);
                    point.y += (this.anotherPoint.y-this.selectPoint.y);
                    this.selectPoint=this.anotherPoint;
                }
            }
        }
        return this.tool.mouseMove(point, e);
    }

    /**
     * @inheritDoc
     */
    mouseDbClick(point, e){
        return super.mouseDbClick(point, e);
    }

    /**
     * @inheritDoc
     */
    mouseClick(point, e){
        return super.mouseClick(point, e);
    }

    /**
     * @inheritDoc
     */
    mouseDown(point, e){
        this.mousePosition = point;
        this.isMouseDown = true;
        return super.mouseDown(point, e);
    }

    /**
     * @inheritDoc
     */
    mouseUp(point, e){
        this.isMouseDown = false;
        this.dx=0;
        this.dy=0;
        this.selectPoint=null;
        this.anotherPoint=null;        
        return super.mouseUp(point, e);
    }


    /**
     * @inheritDoc
     */
    render(board){
        let res = this.tool.render(board);

        if(this.tool.transformer && this.tool.transformer.activeControllPoint){
            if (res instanceof Promise) {
                res.then((elements) => {
                    this.showNudgePoint();
                });
            }
        }else {
            this.showNudgePoint();
        }

    }

    showNudgePoint(){
        if(this.anotherPoint && this.selectPoint && this.tool.transformer instanceof ResizeTransformer) {
            if (this.selectPoint.compare(this.anotherPoint)) {
                this.renderPoint(this.anotherPoint, '#ff0000', 5);
            } else {
                this.renderPoint(this.anotherPoint, '#000000');
                this.renderPoint(this.selectPoint, '#ff641a');
            }
        }
    }

    _getPointPair(selectedElements, point){
        if(!this._document){
            return;
        }

        let anotherElements =[];
        m: for(let el of this._document._elements){
            for(let selectElement of selectedElements){
                if(selectElement.compare(el)){
                    continue m;
                }
            }
            anotherElements.push(el);
        }

        let selectPoints = this.getMagnitPointsForElements(selectedElements);

        if(this.tool.transformer && this.tool.transformer.activeControllPoint){
            let CP = this.tool.transformer.activeControllPoint;
            let alignX = CP.alignX;
            let alignY = CP.alignY;
            let magnitPoint = selectPoints[0].copy();
            if(alignX == ResizeElementsCommand.CONTROL_POINT_X.center){
                if(alignY == ResizeElementsCommand.CONTROL_POINT_Y.top){
                    for(let p of selectPoints){
                        if(p.y>magnitPoint.y){
                            magnitPoint=p.copy();
                        }
                    }
                }else{
                    for(let p of selectPoints){
                        if(p.y<magnitPoint.y){
                            magnitPoint=p.copy();
                        }
                    }
                }
                magnitPoint.x=point.x;
                this.dx=0;
            }else if(alignY == ResizeElementsCommand.CONTROL_POINT_Y.center){
                if(alignX == ResizeElementsCommand.CONTROL_POINT_X.right){
                    for(let p of selectPoints){
                        if(p.x>magnitPoint.x){
                            magnitPoint=p.copy();
                        }
                    }
                }else{
                    for(let p of selectPoints){
                        if(p.x<magnitPoint.x){
                            magnitPoint=p.copy();
                        }
                    }
                }
                magnitPoint.y=point.y;
                this.dy=0;
            }else{
                let extr = this.document.getExtrenum(app.selectElements);

                if(alignY == ResizeElementsCommand.CONTROL_POINT_Y.top){
                    magnitPoint.y=extr.max.y;
                }else{
                    magnitPoint.y=extr.min.y;
                }

                if(alignX == ResizeElementsCommand.CONTROL_POINT_X.right){
                    magnitPoint.x=extr.max.x;
                }else{
                    magnitPoint.x=extr.min.x;
                }
            }
            selectPoints = [magnitPoint];
        }

        let anotherPoints = this.getMagnitPointsForElements(anotherElements);
        if(selectPoints.length>0 && anotherPoints.length>0) {
            let ret = this._getClosestPairOfPoints(selectPoints, anotherPoints);
            let el = anotherElements.find(el => el.getMagnificationPoints().find(p => p.compare(ret.another)));
            super.setHighlightElement(el);
            return ret;
        }else{
            super.setHighlightElement(null);
            return {select:null, another:null};
        }
    }

    /**
     *
     * @param {Array.<Point>} selectPoints
     * @param {Array.<Point>} anotherPoints
     * @return {Array.<{select:Point, another:Point}>}
     * @private
     */
    _getClosestPairOfPoints(selectPoints, anotherPoints){

        let matrix = Matrix.createMoveMatrix(this.dx, this.dy);

        selectPoints = selectPoints.map(point=>{
            let p = point.copy();
            p.changeByMatrix(matrix);
            return p;
        });


        let res = {select:selectPoints[0], another:anotherPoints[0]};

        let minLength = selectPoints[0].squareOfDistanceTo(anotherPoints[0]);

        for(let i=0; i<selectPoints.length; i++){
            for(let j=0; j<anotherPoints.length; j++){
                let tempLength =selectPoints[i].squareOfDistanceTo(anotherPoints[j]);
                if(minLength>tempLength){
                    minLength=tempLength;
                    res = {select:selectPoints[i], another:anotherPoints[j]};
                }
            }
        }

        return {select:res.select.copy(), another:res.another.copy()};
    }


    /**
     *
     * @param {Array.<GraphicElement>} elements
     * @return {Array.<Point>}
     */
    getMagnitPointsForElements(elements){
        return elements.reduce((res,el)=>[...res,...el.getMagnificationPoints()],[]);
    }

    selectElements(elements, addToApp=true){
        return this.tool.selectElements(elements, addToApp);
    }

    setSelectElements(elements){
        return this.tool.setSelectElements(elements);
    }


    clearSelectElements(clearApp=true){
        return this.tool.clearSelectElements(clearApp);
    }
}