/**
 * Created by dev on 15.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Transformer from './Transformer';
import RectElement from '../../../../model/elements/RectElement';
import Text from '../../../../model/elements/Text';
import Arc from '../../../../model/elements/Arc';
import ResizeElementsCommand from '../../../../command/ResizeElementsCommand';
import Document from '../../../../model/Document';

class ControlPoint{
    constructor(x,y, alignX, alignY){
        this.x=x;
        this.y=y;
        this.alignX = alignX;
        this.alignY = alignY;
    }
}


class ResizeRect extends RectElement{
    constructor(el){
        super(new (container.resolve('math')).Point(), new (container.resolve('math')).Point());
        this.board = container.resolve('mainBoard'); //todo: maybe set from the using place

        this.pointPadding = 5;
        this.rectPadding = 12;

        this._elements = [];
        this._document = null;

        this.elements = el;
        // this.command = new ChangeElementsSizeCommand(this._document, el, 0, 0, ChangeElementsSizeCommand.ALIGN_X.canter, ChangeElementsSizeCommand.ALIGN_Y.center);
    }

    set elements(elements){
        this._elements = elements;
        if(elements.length>0) {
            this._resize();
        }
    }

    _resize(){
        let ext = Document.getExtrenumForElements(this._elements);
        this.p1 = new (container.resolve('math')).Point(ext.min.x, ext.max.y);
        this.p2 = new (container.resolve('math')).Point(ext.max.x, ext.min.y);
    }


    /**
     * @param {Point} point
     */
    contain(point){
        let res = super.contain(point);

        return res;
    }

    getControlPoints(){
        let p1Local = this.board._convertToLocalCoordinateSystem(this.p1);
        let p2Local = this.board._convertToLocalCoordinateSystem(this.p2);

        let p1 = new ControlPoint(p1Local.x-this.rectPadding,p1Local.y-this.rectPadding,ResizeElementsCommand.CONTROL_POINT_X.left, ResizeElementsCommand.CONTROL_POINT_Y.top);
        let p2 = new ControlPoint(p2Local.x+this.rectPadding, p2Local.y+this.rectPadding, ResizeElementsCommand.CONTROL_POINT_X.right, ResizeElementsCommand.CONTROL_POINT_Y.bottom);

        let controlPoints = [
            p1,
            p2,
            new ControlPoint(p2.x, p1.y, ResizeElementsCommand.CONTROL_POINT_X.right, ResizeElementsCommand.CONTROL_POINT_Y.top),
            new ControlPoint(p1.x, p2.y, ResizeElementsCommand.CONTROL_POINT_X.left, ResizeElementsCommand.CONTROL_POINT_Y.bottom),
            new ControlPoint(p1.x+(p2.x-p1.x)/2 , p1.y, ResizeElementsCommand.CONTROL_POINT_X.center, ResizeElementsCommand.CONTROL_POINT_Y.top),
            new ControlPoint(p1.x+(p2.x-p1.x)/2 ,p2.y, ResizeElementsCommand.CONTROL_POINT_X.center, ResizeElementsCommand.CONTROL_POINT_Y.bottom),
            new ControlPoint(p1.x ,p1.y+(p2.y-p1.y)/2, ResizeElementsCommand.CONTROL_POINT_X.left, ResizeElementsCommand.CONTROL_POINT_Y.center),
            new ControlPoint(p2.x ,p1.y+(p2.y-p1.y)/2, ResizeElementsCommand.CONTROL_POINT_X.right, ResizeElementsCommand.CONTROL_POINT_Y.center)];

        return controlPoints;
    }

    render(board){
        let p1Local = board._convertToLocalCoordinateSystem(this.p1);
        let p2Local = board._convertToLocalCoordinateSystem(this.p2);

        let p1 = {x:p1Local.x-this.rectPadding, y:p1Local.y-this.rectPadding};
        let p2 = {x:p2Local.x+this.rectPadding, y:p2Local.y+this.rectPadding};
        board.style('strokeStyle', '#000000');
        board.style('lineWidth', 1);   //todo: use theme
        board.style('dash', [4,4]);
        board._drawLine(p1, {x:p2.x, y:p1.y});
        board._drawLine({x:p2.x, y:p1.y}, p2);
        board._drawLine(p2, {x:p1.x, y:p2.y});
        board._drawLine({x:p1.x, y:p2.y}, p1);

        let controlPoints = this.getControlPoints();

        for(let p of controlPoints) {
            this._drawControlPoint(p);
        }
    }

    move(x,y){
        this.p1 = new (container.resolve('math')).Point(this.p1.x+x, this.p1.y+y);
        this._p1.x+=x;
    }

    _createControlPointRect(p){
        return new (container.resolve('math')).Rect(
            new (container.resolve('math')).Point(p.x-this.pointPadding, p.y+this.pointPadding),
            new (container.resolve('math')).Point(p.x+this.pointPadding, p.y-this.pointPadding)
        );
    }
    _drawControlPoint(p){
        let r = this._createControlPointRect(p);
        this.board.style('fillStyle','#000000');
        this.board._drawRect(r._p1, r._p2,true);
    }

    /**
     * @param point
     * @return {ControlPoint|null}
     * @private
     */
    _getControlPointByPoint(point){
        let controlPoints = this.getControlPoints();
        let checkPoint = this.board._convertToLocalCoordinateSystem(point);
        for(let p of controlPoints){
            /** @Var {Rect} */
            let r = this._createControlPointRect(p);
            if(r.contain(checkPoint)){
                return p;
            }
        }
        return null;
    }

    isControlPoint(point){
        let controlPoint = this._getControlPointByPoint(point);
        return controlPoint!=null;
    }

    contain(point){
        if(this._elements.length>0) {
            let extr = Document.getExtrenumForElements(this._elements);
            let p1Local = this.board._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(extr.min.x, extr.max.y));
            let p2Local = this.board._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(extr.max.x, extr.min.y));

            let p1 = {
                x: p1Local.x - this.rectPadding - this.pointPadding,
                y: p1Local.y - this.rectPadding - this.pointPadding
            };
            let p2 = {
                x: p2Local.x + this.rectPadding + this.pointPadding,
                y: p2Local.y + this.rectPadding + this.pointPadding
            };

            let checkPoint = this.board._convertToLocalCoordinateSystem(point);
            return (new (container.resolve('math')).Rect(p1,p2)).contain(checkPoint) || this.isControlPoint(point);
        }
        return false;
    }
}




/**
 * 3. resize elements
 * 5. move elements on board
 */
export default class ResizeTransformer extends Transformer{
    constructor(document){
        super(document);

        /** @var {ResizeRect} */
        this.resizeRect = null;
            
        this._downPosition = null;

        this.activeControllPoint = null;

        this.dx = 0;
        this.dy = 0;
    }


    removeElemens(){
        super.removeElemens();
        this.resizeRect=null;
        this.activeControllPoint=null;
    }

    addElements(elements){
        this._elements.push(...elements);
        if(!this.resizeRect){
            this.resizeRect = new ResizeRect(this._elements);
        }
        this.resizeRect.elements = this._elements;
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseDown(point){
        super.mouseDown();
        if(this.resizeRect && this.resizeRect.contain(point)){
            this._downPosition = point;
            if (this.resizeRect.isControlPoint(point)){
                this.activeControllPoint = this.resizeRect._getControlPointByPoint(point);
            }
            return false;
        }
        return true;
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseUp(point){
        this._downPosition = null;
        if(this.resizeRect) {
            if(this.dx!=0 || this.dy!=0){
                if(!this.activeControllPoint) {
                    app.moveSelected(this.dx, this.dy);
                }else{
                    app.executeCommand(new ResizeElementsCommand(this.board.document, this._elements,
                        new (container.resolve('math')).Vector(this.dx, this.dy), this.activeControllPoint.alignX, this.activeControllPoint.alignY));
                }
                this.dx = 0;
                this.dy = 0;
            }
            this.activeControllPoint=null;
            return super.mouseUp(point) && this.resizeRect.contain(point);
        }
        return super.mouseUp(point);
    }
    
    mouseMove(point){
        super.mouseMove(point);
        if(this._downPosition){
            let dx = point.x - this._downPosition.x;
            let dy = point.y - this._downPosition.y;
            this.dx+=dx;
            this.dy+=dy;
            if(!this.activeControllPoint) {
                this.resizeRect.move(dx,dy);
            }
            this._downPosition = point;
            return false;
        }

        return true;
    }

    /**
     * @return Promise
     */
    render(board){
        return new Promise(resolve=>{
            this.getTransformElements().then((elements)=>{
                this.renderElements(board, elements);
                resolve(elements);
            });
        });
    }

    renderElements(board,elements){
        for(let element of elements){
            element._renderer.setFocus(true);
            element.render(board);
        }

        if(this.resizeRect){
            this.resizeRect.elements=elements;
            this.resizeRect.render(board);
        }
    }

    /**
     * @return {Promise.<Array.<GraphicElement>>}
     */
    getTransformElements(){
        return new Promise((resolve, reject)=>{
            if(this._downPosition) {
                let changeElements = this._elements.map(e => e.copy());
                if (!this.activeControllPoint) {
                    for (let element of changeElements) {
                        element.move(this.dx, this.dy);
                    }
                    resolve(changeElements);
                } else {
                    let hasArcs = Document.toSimpleListElements(changeElements)
                        .reduce((res, el) => res || (el instanceof Arc && el.incrementAngle != 360), false);
                    let hasText = changeElements.reduce((res, el) => res || (el instanceof Text), false);
                    let command = new ResizeElementsCommand(new Document(), changeElements,
                        new (container.resolve('math')).Vector(this.dx, this.dy), this.activeControllPoint.alignX, this.activeControllPoint.alignY, true);
                    command.needSave = false;
                    if (hasText || (hasArcs && command._isCentralControlPoint())) {
                        command.execute().then((res) => {
                            if (res) {
                                if (command.isReplacedElements()) {
                                    changeElements = command.getElements();
                                }
                            } else {
                                this._downPosition = null;
                                this.activeControllPoint = null;
                            }
                            resolve(changeElements);
                        }).catch(reject);
                    } else {
                        command.executeCommand();
                        if (command.isReplacedElements()) {
                            changeElements = command.getElements();
                        }
                        resolve(changeElements);
                    }
                }
            }else{
                resolve(this._elements);
            }
        });
    }
}
