/**
 * Created by dev on 27.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import DynamicChangeTool from './DynamicChangeTool';

import Document from '../../../model/Document';
import Vector from '../../../model/math/Vector';
import MoveBasePointsCommand from '../../../command/MoveBasePointsCommand';
import Point from '../../../model/math/Point';
import BlackVirtualCursor from "./BlackVirtualCursor";


export default class EditLineTool extends DynamicChangeTool{
    constructor(document){
        super(document);

        this.cursor=new BlackVirtualCursor();

        this.doc = new Document();
        this.name= "EditLine";

        /** @type {Vector} */
        this.editVector = new (container.resolve('math')).Vector();
        this.nearPoint=null;
    }


    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseMove(point, e){
        let oldPosition = this.mousePosition;
        super.mouseMove(point, e);
        this.editVector.x+=this.dx;
        this.editVector.y+=this.dy;
        if(!this.mouseDownPosition || !this.edited) {
            this.selectNearElements(point);
        }
        this.nearPoint = this._getNearMagnitPoint(point);
        return true;
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing anyGraphicElement GraphicElement
     */
    mouseDown(point, e){
        this.mouseDownPosition=point;
        this.editVector = new (container.resolve('math')).Vector();
        let res = true;
        if(!this._getNearMagnitPoint(point)) {
            res = super.mouseDown(point, e);
            if(res){
                this.edited = true;
            }
        }else{
            this.edited = true;
        }
        return res;
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseUp(point, e){
        app.board._canvas.style.cursor = "default";
        if((this.editVector.x!=0 || this.editVector.y!=0) && this.edited){
            let command = new MoveBasePointsCommand(this._document, this.selectElementsPair.map(e=>e.original)
                , this.mouseDownPosition, this.editVector);
            app.executeCommand(command);
            this.edited=false;
            this.mouseDownPosition=null;
            return true;
        }
        this.edited=false;
        return super.mouseUp(point,e);
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseDbClick(point, e){
        return true;
    }

    /**
     * @param {Point} point
     * @param {MouseEvent} e
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseClick(point, e){
        return true;
    }


    /**
     * @inheritDoc
     */
    render(board){
        for(let el of this.selectElementsPair){
            el.copy = el.original.copy();
        }

        if(this.mouseDownPosition) {
            new MoveBasePointsCommand(this.doc, this.selectElementsPair.map(e => e.copy)
                , this.mouseDownPosition, this.editVector).executeCommand();
        }

        if(this.nearPoint && !this.mouseDownPosition) {
            let board = container.resolve('mainBoard');
            board.style('fillStyle','red');
            board._drawArc(board._convertToLocalCoordinateSystem(this.nearPoint), 4,0,Math.PI*2,true);
        }

        super.render(board);
    }


    _getNearMagnitPoint(pointArg){
        let simpleElements = Document.toSimpleListElements(this.selectElementsPair.map(e=>e.copy));

        for(let element of simpleElements){
            let points = element.getMagnificationPoints();
            for(let point of points){
                if(point.isNear(pointArg, this.Eps*1.5)){
                    return point;
                }
            }
        }
        return null;
    }
}