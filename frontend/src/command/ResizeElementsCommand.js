/**
 * Created by dev on 21.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';

import Group from '../model/elements/Group';
import Arc from '../model/elements/Arc';
import Line from '../model/math/Line';
import LineElement from '../model/elements/LineElement';
import ResizeCircleQuestionBehavior from './behaviors/ResizeCircleQuestion';
import ResizeDataValidator from './behaviors/ResizeDataValidator';
import Point from '../model/math/Point';
import Document from '../model/Document';
/**
 * The resizing command. 
 * If resize a circle the circle translates to group with four splines (ask user)
 */
export default class ResizeElementsCommand extends ElementModificationCommand{

    /**
     * The list of constants for resizing by OX
     * @return {{canter: string, left: string, right: string}}
     */
    static get CONTROL_POINT_X(){
        return {
            center:'Not resizing',
            left:"left",
            right:"right"
        };
    }

    /**
     * The list of constants for resizing by OY
     * @return {{center: string, top: string, bottom: string}}
     */
    static get CONTROL_POINT_Y(){
        return {
            center:"Not resizing",
            top: "top",
            bottom: "bottom"
        };
    }

    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {Vector} vector - the vector of bias the control point
     * @param {string} controlPointX - this is the control point position, use the ChangeElementsSizeCommand.CONTROL_POINT_X
     *     for get list of value
     * @param {string} controlPointY - this is the control point position, use the ChangeElementsSizeCommand.CONTROL_POINT_Y
     *     for get list of value
     * @param {boolean} convertCircleToSplines - if is true all Ars will be transformation to list of splines,
     *     if is false and selected some Arc then will be throw Exception
     */
    constructor(document, elements, vector , controlPointX, controlPointY, convertCircleToSplines=false){
        super(document, elements);

        /** @type {string} */
        this.controlPointX = controlPointX;

        /** @type {string} */
        this.controlPointY = controlPointY;

        /** @type {Vector} */
        this._vector=vector;

        /** @type {boolean} */
        this.convertCircleToSplines = convertCircleToSplines;

        this.newElements = [];

        this.behaviors.push(
            new ResizeDataValidator(),
            new ResizeCircleQuestionBehavior()
        );

        this.name= 'ResizeElementsCommand';
    }


    /**
     * @inheritDoc
     */
    isReplacedElements(){
        return this.newElements.length>0;
    }

    /**
     * @inheritDoc
     */
    getReplaceElements(){
        return this.newElements;
    }



    /**
     * @inheritDoc
     */
    executeCommand(){

        let elements = null;

        if(this._isCentralControlPoint()) {
            elements = this._changeArcsToSplines();
            this.newElements = elements;
        }else{
            elements=this.elements;
        }

        let group = new Group();

        for(let element of elements){
            group.addElement(element);
        }

        if(!this._isCentralControlPoint()) {
            this._changeVector(group);
        }

        let {dx, dy} = this._calculateDelta();

        let center = group.getCenter();

        group.resize(dx,dy, center, group.getExtrenum());

        let dxDelta =dx/2;
        let dyDelta =dy/2;
        if(this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.left){
            dxDelta = -dxDelta;
        }
        if(this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.bottom){
            dyDelta = -dyDelta;
        }
        group.move(dxDelta, dyDelta);

        
        return true;
    }

    _changeVector(group){
        let tempLine =  new (container.resolve('math')).Line(
            new (container.resolve('math')).Point(),
            new (container.resolve('math')).Point()
        );
        let extr = group.getExtrenum();

        if(extr.max.x == extr.min.x){
            this._vector.x=0;
        }else if(extr.max.y == extr.min.y){
            this._vector.y=0;
        }else {
            let controlPointPosition = this._getControlPoint(extr);
            let opositeControlPointPosition = this._getOppositeControlPoint(extr);
            let mousePosition = new (container.resolve('math')).Point(controlPointPosition.x + this._vector.x, controlPointPosition.y + this._vector.y);
            if ((this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.left && this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.top) ||
                (this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.right && this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.bottom)) {
                tempLine._p1 = new (container.resolve('math')).Point(extr.min.x, extr.max.y);
                tempLine._p2 = new (container.resolve('math')).Point(extr.max.x, extr.min.y);
            } else {
                tempLine._p1 = new (container.resolve('math')).Point(extr.min.x, extr.min.y);
                tempLine._p2 = new (container.resolve('math')).Point(extr.max.x, extr.max.y);

            }
            let x = tempLine.x(mousePosition.y);
            let y = tempLine.y(mousePosition.x);
            let l1 = new LineElement(opositeControlPointPosition.copy(), new (container.resolve('math')).Point(x, mousePosition.y));

            let l2 = new LineElement(opositeControlPointPosition.copy(), new (container.resolve('math')).Point(mousePosition.x, y));
            if (l1.length() > l2.length()) {
                this._vector.x = l2.p2.x - controlPointPosition.x;
                this._vector.y = l2.p2.y - controlPointPosition.y;
            } else {
                this._vector.x = l1.p2.x - controlPointPosition.x;
                this._vector.y = l1.p2.y - controlPointPosition.y;
            }
        }
    }

    _changeArcsToSplines(){
        let res = [];

        let isChanged=false;

        for(let el of this.elements){
            if(el instanceof Arc){
                if(!this.convertCircleToSplines){
                    throw new Exception('You cannot perform this operation with the Arc highlighted and the ' +
                        'convertCircleToSplines flag cleared.', this);
                }
                this._document.removeElement(el);
                let group = new Group();
                let splines = el.convertToSplines();
                for(let spline of splines){
                    group.addElement(spline);
                }
                el=group;
                this._document.addElement(el);
                isChanged=true;
            }else if(el instanceof Group){
                 isChanged|=this._changeArcsToSplinesInGroup(el);
            }
            res.push(el);
        }

        return res;
    }

    /**
     * @param {Group} group
     * @private
     */
    _changeArcsToSplinesInGroup(group){

        //todo: the code has a bug. If use it for group -> group -> element
        let res = false;
        for(let el of group.elements){
            if(el.typeName == 'Arc'){
                if(!this.convertCircleToSplines){
                    throw new Exception('You cannot perform this operation with the Arc highlighted and the ' +
                        'convertCircleToSplines flag cleared.', this);
                }
                console.log(group, 'before er');
                group.removeElement(el);
                let group = new Group();
                let splines = el.convertToSplines();
                for(let spline of splines){
                    group.addElement(spline);
                }
                el=group;
                group.addElement(el);
                res=true;
            }else {
                if (el.typeName == 'Group') {
                    console.log("s group");
                    res|=this._changeArcsToSplinesInGroup(el);
                }
            }
        }
        return res;
    }

    _isCentralControlPoint(){
        return this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.center || this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.center;
    }

    /**
     *
     * @return {{dx: *, dy: *}}
     * @private
     */
    _calculateDelta(){
        let dx = this._vector.x;
        let dy = this._vector.y;
        if(this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.left){
            dx = -dx;
        }

        if(this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.bottom){
            dy = -dy;
        }

        if(this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.center){
            dx=0;
        }
        if(this.controlPointY == ResizeElementsCommand.CONTROL_POINT_Y.center){
            dy=0;
        }
        return {dx:dx, dy:dy};
    }

    _getControlPoint(extr){
        let mousePosition = new (container.resolve('math')).Point();
        if((this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.left && this.controlPointY==ResizeElementsCommand.CONTROL_POINT_Y.top) ||
            (this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.right && this.controlPointY==ResizeElementsCommand.CONTROL_POINT_Y.bottom)){

            if(this.controlPointX != ResizeElementsCommand.CONTROL_POINT_X.right) {
                mousePosition.x = extr.min.x;
                mousePosition.y = extr.max.y ;
            }else{
                mousePosition.x = extr.max.x;
                mousePosition.y = extr.min.y;
            }

        }else{
            if(this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.right){
                mousePosition.x = extr.max.x;
                mousePosition.y = extr.max.y;
            }else{
                mousePosition.x = extr.min.x;
                mousePosition.y = extr.min.y;
            }
        }
        return mousePosition;
    }

    _getOppositeControlPoint(extr){
        let mousePosition =new (container.resolve('math')).Point();
        if((this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.left && this.controlPointY==ResizeElementsCommand.CONTROL_POINT_Y.top) ||
            (this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.right && this.controlPointY==ResizeElementsCommand.CONTROL_POINT_Y.bottom)){

            if(this.controlPointX == ResizeElementsCommand.CONTROL_POINT_X.right) {
                mousePosition.x = extr.min.x;
                mousePosition.y = extr.max.y ;
            }else{
                mousePosition.x = extr.max.x;
                mousePosition.y = extr.min.y;
            }

        }else{
            if(this.controlPointX != ResizeElementsCommand.CONTROL_POINT_X.right){
                mousePosition.x = extr.max.x;
                mousePosition.y = extr.max.y;
            }else{
                mousePosition.x = extr.min.x;
                mousePosition.y = extr.min.y;
            }
        }
        return mousePosition;
    }
}