/**
 * Created by dev on 09.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Tool from './tool/Tool';

import RulerBoardExtension from './board-extensions/RulerBoardExtension'
import MousePointerBoardExtension from './board-extensions/MousePointerBoardExtension'
import InteractiveBoardExtension from './board-extensions/InteractiveBoardExtension'
import RealMousePosition from "./board-extensions/RealMousePosition";
import InteractiveBoard from './board/InteractiveBoard';

/**
 * The class have render cycle.
 *
 * 1. some event (for example mouse move)
 * 2. the event redirects the event to {@class Toll}
 * 3. render the tool and document if those properties was set
 * 4. render board extensions
 *  
 *  
 *  
 * Event names:
 *
 * 1. mouseMove - data is {Point} current mouse position (in virtual coordinate system)
 */
export default class AppBoard extends InteractiveBoard{

    constructor() {
        super();

        /**
         * It's abstraction with data structure and implementation the {@class Renderable}.
         * @type {Renderable}
         * @private
         */
        this._document = null;

        /** @type {TracingPaper} */
        this.tracingPaper = null;

        /**
         *
         * @type {Tool}
         */
        this.tool = null;

        /** @type {Array.<BoardExtension>} */
        this.boardExtensions = [];



        if(ENV =='development'){
            this.boardExtensions.push(new RealMousePosition(this));
        }

        if(ENV !='test') {
            setTimeout(() => {
                try {
                    this.render()
                } catch (e) {
                    console.warn(e);
                }
            }, 100);
        }


        if(container.resolve('config').showRuler){
            this.boardExtensions.push(new RulerBoardExtension(this));
            this.boardExtensions.push(new MousePointerBoardExtension(this));
        }

        container.resolve('config').addHandler('change', (e)=>{
            if(e=='dimension'){
                this.render();
            }
            if(e=="showRuler"){
                if(container.resolve('config').showRuler){
                    this.boardExtensions.push(new RulerBoardExtension(this));
                    this.boardExtensions.push(new MousePointerBoardExtension(this));
                }else{
                    this.boardExtensions=[];
                }
                this.render();
            }
        });
    }

    beforeMouseMove(e){
        let globalPoint = this._convertToGlobalCoordinateSystem({x:e.offsetX, y:e.offsetY});
        return !this.tool.mouseMove(globalPoint, e);
    }


    touchDown(e){
        super.touchDown(e);
        this._document.resetRendererConfig();
        this.render();
    }

    touchMove(e){
        super.touchMove(e);
        this._document.resetRendererConfig();
        this.render();
    }

    touchUp(e){
        super.touchUp(e);
        this._document.resetRendererConfig();
        this.render();
    }

    mouseMove(e) {
        this._document.resetRendererConfig();
        super.mouseMove(e);

        for(let extension of this.boardExtensions){
            if(extension instanceof InteractiveBoardExtension) {
                extension.mouseMove({x:e.offsetX, y:e.offsetY});
            }
        }
        this.render();
        this._notifyHandlers('mouseMove', this._convertToGlobalCoordinateSystem({x:e.offsetX, y:e.offsetY}));
    }

    mouseUp(e) {
        super.mouseUp(e);
        this._document.resetRendererConfig();
        this.tool.mouseUp(this._convertToGlobalCoordinateSystem({x: e.offsetX, y: e.offsetY}), e);
        this.render();
    }

    mouseDown(e) {
        super.mouseDown(e);
        this._document.resetRendererConfig();
        this.tool.mouseDown(this._convertToGlobalCoordinateSystem({x: e.offsetX, y: e.offsetY}), e);
        this.render();
    }

    mouseClick(e) {
        this._document.resetRendererConfig();
        this.tool.mouseClick(this._convertToGlobalCoordinateSystem({x:e.offsetX, y:e.offsetY}), e);
    }

    mouseWheel(e, delay) {
        this._document.resetRendererConfig();

        super.mouseWheel(e,delay);
    }

    mouseDbClick(e) {
        this._document.resetRendererConfig();
        this.tool.mouseDbClick(this._convertToGlobalCoordinateSystem({x: e.offsetX, y: e.offsetY}), e);
    }


    /**
     * @inheritDoc
     */
    setSize(width, height){
        super.setSize(width, height);
        for(let extension of this.boardExtensions){
            extension.setSize(width, height);
        }
        this.render();
    }

    /**
     * @param {Tool} tool
     */
    setTool(tool){
        this.tool=tool;
    }

    render() {
        requestAnimationFrame(()=>{
            this.clear('#ffffff');

            if(this.tracingPaper){
                this.tracingPaper.render(this);
            }

            if(this.document){
                this.document.render(this);
            }
            if(this.tool) {
                let res = this.tool.render(this);
                if(res instanceof Promise){
                    res.then(()=>{
                        this.renderExtensions();
                    })
                }else{
                    this.renderExtensions();
                }
            }else {
                this.renderExtensions();
            }
        });
    }

    renderExtensions(){
        for (let extension of this.boardExtensions) {
            extension.render(this);
        }
    }

    /**
     * @returns {boolean} - true if zoomed
     */
    zoomToFitScreen(){
        if(this.document._elements.length==0){
            return false;
        }
        let ext = this._document.getExtrenum();
        let width = ext.max.x-ext.min.x;
        let height = ext.max.y-ext.min.y;

        let O = this._convertToGlobalCoordinateSystem({x:0,y:0});
        let wh = this._convertToGlobalCoordinateSystem({x:this._width-25,y:this._height-25});

        let localWidth = wh.x-O.x;
        let localHeight = O.y-wh.y;

        let zoom = Math.min(localWidth/width,localHeight/height);

        let coef = 1.2;
        if(zoom!=localWidth/width){
            coef=1.5;
        }

        this._setScale((this._scale*zoom)/coef);


        let leftUpPoint = this._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(ext.min.x, ext.max.y));
        let rightDownPoint = this._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(ext.max.x, ext.min.y));
        this._bias.x-=leftUpPoint.x-this._width/2+(rightDownPoint.x-leftUpPoint.x)/2+10;
        this._bias.y-=leftUpPoint.y-this._height/2+(rightDownPoint.y-leftUpPoint.y)/2+50;

        this.render();
        return true;
    }

    /**
     * @param PPI
     */
    zoomToActualSize(PPI){
        let ppm = PPI/25.4;

        let zoom = ppm/this._pixelPerOne;
        this._setScale(zoom);


        if(this.document._elements.length==0){
            return;
        }
        let ext = this._document.getExtrenum();
        let centerDoc  = this._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(
            ext.min.x+(ext.max.x-ext.min.x)/2,
            ext.min.y+(ext.max.y-ext.min.y)/2
        ));
        let realCenter = this.getCenter();

        this._bias.x+=(realCenter.x-centerDoc.x);
        this._bias.y+=(realCenter.y-centerDoc.y);


        this.render();
    }

    /**
     * @param {{x: number, y: number}} point
     * @param {number} dZoom -  0..1..*
     * @private
     */
    zoomAroundPoint(dZoom, point){
        super.zoomAroundPoint(dZoom, point);
        this.render();
    }

    set document(doc){
        this._document=doc;
        this.tool.document=doc;
    }

    get document(){
        return this._document;
    }
}


