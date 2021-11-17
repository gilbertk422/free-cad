/**
 * Created by dev on 27.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Tool from './Tool';
import ShapeBuilder from "../../../analyzer/ShapeBuilder";

/**
 * The class need for selected elements by click
 */
export default class SelectTool extends Tool{
    constructor(document){
        super(document);

        this.cursor=null;

        /**
         * @type {Array.<GraphicElement>} - the list of current selected elements (references on the document elements)
         */
        this._selectElements = [];
    }


    /**
     * The method need for selecting elements without using the tool
     * @param {Array.<GraphicElement>} elements
     * @param {boolean} [addToApp=true]  
     */
    selectElements(elements, addToApp=true){
        for(let el of elements) {
            this._selectElements.push(el);
        }
        if(addToApp) {
            app.addSelectElements(elements);
        }
    }

    /**
     * @param elements
     * @protected
     */
    addSelectElements(elements){
        if(!Helper.Key.ctrlKey) {
            this.clearSelectElements();
        }
        this._selectElements.push(...elements);
        app.addSelectElements(elements);
    }

    /**
     * @protected
     */
    clearSelectElements(clearApp=true){
        if(clearApp) {
            app.clearSelectElements();
        }
        this._selectElements=[];
    }

    unselectElements(elements){
        let selected = app.selectElements;
        let newSelect = [];

        m: for(let el of selected){
            for(let element of elements){
                if(el.compare(element)) {
                    continue m;
                }
            }
            newSelect.push(el);
        }
        this.clearSelectElements();
        this.addSelectElements(newSelect);
    }


    mouseMove(point, e){
        return super.mouseMove(point, e);
    }

    /**
     *
     * @param point
     * @param e
     * @return {boolean} true if was selected any element
     */
    mouseDown(point, e){
        let res = this.selectElementByMouseDown(point);
        if(!res){
            if(!Helper.Key.ctrlKey) {
                this.clearSelectElements();
            }
        }

        return res;
    }

    selectElementByMouseDown(point){
        let newSelectElements = this.getNearElements(point);

        if(newSelectElements.length!=0) {
            let newSelected = [];
            let newUnselected = [];

            m: for (let el of newSelectElements) {
                for (let element of app.selectElements) {
                    if (el.compare(element)) {
                        newUnselected.push(el);
                        continue m;
                    }
                }
                newSelected.push(el);
            }

            if(Helper.Key.shiftKey) {
                let cleared = false;

                let shapeBuilder = new ShapeBuilder(this._document);
                let shapes = shapeBuilder.buildShapes();
                for(let shape of shapes){
                    if(shape.isNear(point,this.Eps)){
                        if(!cleared){
                            cleared=true;
                            newSelected=[];
                        }
                        for(let el of shape.elements){
                            newSelected.push(el);
                        }
                    }
                }
            }

            if (newSelected.length > 0) {
                if(newUnselected.length>0 && (app.selectElements.length-newUnselected.length)>0){
                    console.log(newUnselected);
                    this.unselectElements(newUnselected);
                }
                this.addSelectElements(newSelected);
                return true;
            }else {
                if (newUnselected.length > 0 && (app.selectElements.length-newUnselected.length)>0) {
                    this.unselectElements(newUnselected);
                    return true;
                }
            }
        }
        return false;
    }

    mouseUp(point, e){
        return true;
    }

    get Eps(){
        let mul = container.resolve('mobileDetector').mobile()==null?1:3;
        let scale = container.resolve('mainBoard')._scale; //todo: maybe set from the using place
        return  ((scale>1?0.2:0.05)/scale)*mul;
    }

    /**
     * @param {Point} point
     * @return {*|Array.<GraphicElement>}
     * @protected
     */
    getNearElements(point){
        return this._document.getNearElements(point, this.Eps);
    }
}

