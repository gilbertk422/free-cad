/**
 * Created by dev on 15.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Transformer from './Transformer';
import Group from '../../../../model/elements/Group';
import MagnificationCreatorToolDecorator from '../decorators/MagnificationCreatorToolDecorator'

let Trigonometric = container.resolve('math').Trigonometric;
let Point = container.resolve('math').Point;
/**
 *  rotate elements
 */
export default class RotateTransformer extends Transformer{
    constructor(document){
        super(document);

        this._downPosition = null;
        this.grad=0;
        this.Dgrad=0;
        this._createGroup();
        this.center=null;

        this._underCenter = false;
        this._moveCenter = false;

        this.magnific = null;
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseDown(point){
        if(this.group){
            if(this._underCenter){
                this._moveCenter=true;
                this.magnific = new MagnificationCreatorToolDecorator(this.document, this);
                this._downPosition = point;
            }else {

                let scale = this.board._scale;
                let r = (scale * this.board._pixelPerOne * this.radius + 10 + 4) / (this.board._pixelPerOne * scale);

                if (r > this.center.distanceTo(point)) { //into transformer
                    this._downPosition = point;
                    // this._createGroup();
                    // this._calculateRadius();
                } else {
                    return true;
                }
            }
        }
        return super.mouseDown(point);
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseUp(point){
        this._downPosition = null;
        this._moveCenter=false;
        this.magnific=null;
        if(this.Dgrad!=0) {
            app.rotateSelected(this.Dgrad, this.center);
            this.Dgrad = 0;
        }
        return super.mouseUp(point);
    }

    /**
     * @param {Point} point
     * @return {boolean} - false if transformer do some work
     */
    mouseMove(point){
        let center = this.center;

        if(this._downPosition) {
            if(this._moveCenter){
                this.center = this.magnific.magnificPoint(point);
                this._calculateRadius(this.center);
            }else {
                let delt_x1 = this._downPosition.x - center.x;
                let delt_y1 = center.y - this._downPosition.y;

                var delt_x2 = point.x - center.x;
                var delt_y2 = center.y - point.y;
                //
                var angle1 = Math.atan2(delt_x1, delt_y1) * 180 / Math.PI;
                var angle2 = Math.atan2(delt_x2, delt_y2) * 180 / Math.PI;

                var angleDelta = angle1 - angle2;

                this.grad += angleDelta;
                this.Dgrad += angleDelta;
                this.group.rotate(center, angleDelta);
            }
            this._downPosition= point;
        }else {
            let pointsPixel = this.board._convertToLocalCoordinateSystem(point);
            let centerPixel = this.board._convertToLocalCoordinateSystem(center);
            if(new Point(pointsPixel.x, pointsPixel.y).distanceTo(new Point(centerPixel.x, centerPixel.y))<8){
                this._underCenter = true;
            }else{
                this._underCenter = false;
            }
        }

        return super.mouseMove(point);
    }

    render(board){
        return new Promise(resolve=>{
            for(let el of this._elements){
                el._renderer.setFocus(true);
                el.render(board);
            }
            if(this.group) {
                let centerPoint = this.board._convertToLocalCoordinateSystem(this.center);

                let localRadius = this._localRadius();
                board.style('strokeStyle', '#000000');
                board.style('lineWidth', 1);   //todo: use theme
                board.style('dash', [4, 4]);

                board._drawArc(centerPoint, localRadius, 0, 2*Math.PI);
                let grad45 = Trigonometric.gradToRad(45 + this.grad);
                board.style('fillStyle', '#000000');
                board.style('lineWidth', 1);   //todo: use theme
                board.style('dash', []);
                board._drawArc({
                    x: centerPoint.x + localRadius * Math.sin(grad45),
                    y: centerPoint.y - localRadius * Math.cos(grad45)
                }, 4, 0, 2*Math.PI, true);
                board._drawArc({
                    x: centerPoint.x - localRadius * Math.sin(grad45),
                    y: centerPoint.y + localRadius * Math.cos(grad45)
                }, 4, 0, 2*Math.PI, true);
                board._drawArc({
                    x: centerPoint.x - localRadius * Math.cos(grad45),
                    y: centerPoint.y - localRadius * Math.sin(grad45)
                }, 4, 0, 2*Math.PI, true);


                board._drawArc({
                    x: centerPoint.x + localRadius * Math.cos(grad45),
                    y: centerPoint.y + localRadius * Math.sin(grad45)
                }, 4, 0, 2*Math.PI, true);

                let centerRadius = 8;
                if(this._underCenter){
                    centerRadius=10;
                }
                board._drawArc(centerPoint, centerRadius, 0, 2*Math.PI, true);
                board.style('fillStyle', '#ffffff');
                board._drawArc(centerPoint, 6, 0, 2*Math.PI, true);
                board.style('fillStyle', '#000000');
                board._drawArc(centerPoint, 2, 0, 2*Math.PI, true);
            }
            resolve();
        });
    }

    addElements(elements){
        super.addElements(elements);
        this._createGroup();
        this._calculateRadius();
    }

    _createGroup(){
        this.group = new Group(this.document);
        for (let el of this._elements) {
            this.group.addElement(el);
        }
    }

    _calculateRadius(center=null){
        if(!center) {
            this.center = this.group.getCenter();
            center=this.center;
        }
        this.radius = 0;
        for(let p of this.group._points){
            let temp = center.distanceTo(p);
            if(temp>this.radius){
                this.radius = temp;
            }
        }
    }

    _localRadius(){
        return this.board._scale * this.board._pixelPerOne * this.radius + 10;
    }
}