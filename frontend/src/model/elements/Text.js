/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import GraphicElement  from '../GraphicElement';
import Point from '../math/Point';

import Matrix from '../math/Matrix';
import RectElement from './RectElement';
import Font from "./text/Font";
import Group from "./Group";
import LineElement from "./LineElement";
import Spline from "./Spline";
import Trigonometric from "../math/Trigonometric";
import FontManager from "./text/FontManager";
import Shape from "./Shape";

/**
 * @inheritDoc
 */
class Text extends GraphicElement{
    constructor(position, text){
        super();
        this.position=position;
        this.angle = 0; //degrees
        this._text = text;
        this._fontSize = app.config.fontSize / app.board._scale / 120; // to apply like real text size in text editor
        this.typeName = 'Text';
        /** @type {Font} */
        this._font = null;

        this._renderer = container.resolve('rendererFactory', [this]);
    }

    get text(){
        return this._text;
    }

    set text(value){
        this._text=value;
    }

    get fontSize(){
        return this._fontSize;
    }

    set fontSize(value){
        this._fontSize=value;
    }

    set font(value){
        this._font=value;
    }

    get font(){
        return this._font;
    }

    get _points(){
        let ext = this.getExtrenum();
        return [this.position,
            new (container.resolve('math')).Point(ext.min.x, ext.max.y),
            new (container.resolve('math')).Point(ext.max.x, ext.max.y),
            new (container.resolve('math')).Point(ext.max.x, ext.min.y)
        ];
    }

    set _points(points){

    }


    /**
     * @return {null} - text can't have extreme points
     */
    get extremePoints(){
        return null;
    }

    /**
     * @inheritDoc
     */
    rotate(center,grad){
        let rotateMatrix = Matrix.createRotateMatrix(grad);

        let moveMatrix = Matrix.createMoveMatrix(-center.x, -center.y);
        let removeMatrix = Matrix.createMoveMatrix(center.x, center.y);

        this.position.changeByMatrix(moveMatrix);
        this.position.changeByMatrix(rotateMatrix);
        this.position.changeByMatrix(removeMatrix);


        this.angle-=grad;
    }


    /**
     * The method need for magnification mode
     * @return {Array.<Point>} - points that can be magnetised
     */
    getMagnificationPoints(){
        //todo: add center point (can be to slow)
        return [this.position.copy()];
    }

    /**
     * @return {Group}
     * @protected
     */
    _getBorder(){
        let fontSize = this.fontSize;

        if(/.*[jgpyq].*/.test(this.text)){
            fontSize*=1.325;
        }

        let l = FontManager.defaltFontTextWidth(this.text, this.fontSize);
        let rect = new RectElement(
            new (container.resolve('math')).Point(this.position.x, this.position.y + fontSize),
            new (container.resolve('math')).Point(this.position.x + l, this.position.y)
        );
        let el = rect.toElement();
        if(/.*[jgpyq].*/.test(this.text)){
            el.move(0, this.fontSize - fontSize);
        }
        el.rotate(this.position, -this.angle);
        return el;
    }

    /**
     * @inheritDoc
     */
    getExtrenum(){
        let graphicElements = this.convertToGeometries();
        if (graphicElements) {
            return graphicElements.getExtrenum();
        } else {
            return this._getBorder().getExtrenum();
        }
    }

    /**
     * @inheritDoc
     */
    isIntoFigure(figure){
        let res = true;
        for(let p of this._points){
            res &= figure.contain(p);
        }
        return res;
    }

    /**
     * @inheritDoc
     */
    isNear(point, eps){
        let s = new Shape();

        let lines = this._getBorder().elements;
        for(let l of lines) {
            s.addElement(l);
        }

        return s.isContain(point);
    }

    /**
     * @inheritDoc
     * @return {Text}
     */
    copy(){
        let res = new this.constructor(this.position.copy(), this.text);
        res.height=this.height;
        res.id=this.id;
        res.lineType = this.lineType.copy();
        res.angle=this.angle;
        res.text=this.text;
        res.position = this.position.copy();
        res.fontSize = this.fontSize;
        res.font=this.font;
        return res;
    }


    convertToGeometries() {
        if(!(this.font && this.font.isLoad  && this.lineType.name=="Auto")){
            return null;
        }

        let res = new Group();
        const path = this.font.font.getPath(this.text, 0,0, this.fontSize*1.325);
        let sumbol = new Group();
        for (let i = 0; i < path.commands.length; i++) {
            let el = null;
            switch (path.commands[i].type) {
                case "L":
                    el = new LineElement(
                        new (container.resolve('math').Point)(path.commands[i - 1].x, path.commands[i - 1].y),
                        new (container.resolve('math').Point)(path.commands[i].x, path.commands[i].y)
                    );
                    if(Helper.Math.equals(el.length(),0, 1E-5)){
                        el=null;
                    }
                    break;
                case 'Q':
                    let x0 = path.commands[i - 1].x;
                    let y0 = path.commands[i - 1].y;
                    let x1 = path.commands[i].x1;
                    let y1 = path.commands[i].y1;
                    let x2 = path.commands[i].x;
                    let y2 = path.commands[i].y;

                    el = new Spline(new (container.resolve('math').Point)(x0, y0), new (container.resolve('math').Point)(x2, y2));
                    el.controlPoint1 = new (container.resolve('math').Point)(x0 + ((2 * (x1 - x0)) / 3), y0 + ((2 * (y1 - y0)) / 3));
                    el.controlPoint2 = new (container.resolve('math').Point)(x1 + ((x2 - x1) / 3), y1 + ((y2 - y1) / 3));
                    break;
                case 'C':
                    el = new Spline(
                        new (container.resolve('math').Point)(path.commands[i - 1].x, path.commands[i - 1].y),
                        new (container.resolve('math').Point)(path.commands[i].x, path.commands[i].y)
                    );
                    el.controlPoint1 = new (container.resolve('math').Point)(path.commands[i].x1, path.commands[i].y1);
                    el.controlPoint2 = new (container.resolve('math').Point)(path.commands[i].x2, path.commands[i].y2);
                    break;
                case "Z":
                    res.addElement(sumbol);
                    sumbol = new Group();
                    break;
            }
            if (el) {
                sumbol.addElement(el);
            }
        }
        res.mirror(Trigonometric.axisY, new (container.resolve('math').Point)());
        res.move(this.position.x, this.position.y);
        res.rotate(this.position, -this.angle);


        if (res.elements.length == 1) {
            res = res.elements[0];
            res.height=this.height;
            return res;
        } else if (res.elements.length == 0) {
            return null;
        } else {
            res.height=this.height;
            return res;
        }

    }


    /**
     * @inheritDoc
     */
    toPolyLines(){
        //todo: need use font module

        let res = new (container.resolve('math')).PolyLine(this._points);
        return [res];
    }
}


export default class CacheText extends Text{

    constructor(position, text){
        super(position, text);
        this._extrenum = null;

        this.border = null;
    }


    move(x, y) {
        super.move(x, y);
        this._extrenum.max.x+=x;
        this._extrenum.max.y+=y;
        this._extrenum.min.x+=x;
        this._extrenum.min.y+=y;
        this.border=null;
    }

    rotate(center, grad) {
        super.rotate(center, grad);
        this._extrenum=null;
        this.border=null;
    }

    set text(value){
        super.text = value;
        this._extrenum=null;
        this.border=null;
    }

    get text(){
        return super.text;
    }


    set font(value){
        super.font = value;
        this._extrenum=null;
        this.border=null;
    }

    get font(){
        return super.font;
    }

    set fontSize(value){
        super.fontSize=value;
        this._extrenum=null;
        this.border=null;
    }

    get fontSize(){
        return super.fontSize;
    }

    /**
     * @param {LineType} lineType
     */
    set lineType(lineType){
        super.lineType=lineType;
        this._extrenum=null;
        this.border=null;
    }

    /**
     * @return {LineType}
     */
    get lineType(){
        return super.lineType;
    }

    /**
     * @return {RectElement}
     * @protected
     */
    _getBorder(){
        if(!this.border) {
            this.border = super._getBorder();
        }
        return this.border;
    }

    getExtrenum() {
        if(!this._extrenum){
            this._extrenum = super.getExtrenum();
        }
        return {
            min: {x: this._extrenum.min.x, y: this._extrenum.min.y},
            max: {x: this._extrenum.max.x, y: this._extrenum.max.y}
        };
    }

    /**
     * @inheritDoc
     * @return {Text}
     */
    copy(){
        let res = new CacheText(this.position.copy(), this.text);
        res.height=this.height;
        res.id=this.id;
        res.lineType = this.lineType.copy();
        res.angle=this.angle;
        res.text=this.text;
        res.position = this.position.copy();
        res.fontSize = this.fontSize;
        res.font=this.font;
        if(this._extrenum) {
            res._extrenum = {
                min: {x: this._extrenum.min.x, y: this._extrenum.min.y},
                max: {x: this._extrenum.max.x, y: this._extrenum.max.y}
            };
        }
        return res;
    }
}
