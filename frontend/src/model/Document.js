/**
 * Created by dev on 04.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import Exception from '../Exception';
import GraphicElement from './GraphicElement';
import Renderable from '../ui/2d/Renderable';
import Group from "./elements/Group";
import Extremum from "./math/Extremum";

let id=0;

export default class Document extends Renderable{

    /**
     * @param {Array.<GraphicElement>} elements
     * @return {Extremum}
     */
    static getExtremumForElements(elements) {
        return this.getExtrenumForElements(elements);
    }

    /**
     * @param {Array.<GraphicElement>} elements
     * @return {{max: {x: number, y: number}, min: {x: number, y: number}}}
     * @deprecated use the Document::getExtremumForElements function
     */
    static getExtrenumForElements(elements){
        if(!elements[0] instanceof GraphicElement){
            throw new Exception('Array have not GraphicElement object', element);
        }

        elements = elements.filter(e=>!(e instanceof Group && e.elements.length==0)); //todo: why here are groups without elements

        let ext = elements[0].getExtrenum();
        let minX = ext.min.x;
        let minY = ext.min.y;
        let maxY = ext.max.y;
        let maxX = ext.max.x;
        for(let i=1; i<elements.length; i++){
            if(!elements[i] instanceof GraphicElement){
                throw new Exception('Array have not GraphicElement object', element);
            }
            ext = elements[i].getExtrenum();
            if(ext.max.x>maxX){
                maxX = ext.max.x;
            }
            if(ext.min.x<minX){
                minX = ext.min.x;
            }
            if(ext.max.y>maxY){
                maxY = ext.max.y;
            }
            if(ext.min.y<minY){
                minY = ext.min.y;
            }
        }
        return new Extremum(minX, minY, maxX, maxY);
    }


    constructor(){
        super();

        this.id= id++;
        /** @var {Array.<GraphicElement>}*/
        this._elements = [];

        this.fileName = '';

    }

    /**
     * @param {GraphicElement} element
     */
    addElement(element){
        // if(element instanceof GraphicElement) {

        // for(let i=0; i<this._elements.length; i++){
        //     if (this._elements[i].compare(element)) {
        //         return;
        //     }
        // } //todo: without it the corner round function has an error
        this._elements.push(element);
        // }else{
        //     throw new Exception("To document can be added only elements which instances GraphicElement class.",element);
        // }
    }

    removeElement(element){
        for(let i=0; i<this._elements.length; i++){
            if (this._elements[i].compare(element)) {
                this._elements.splice(i, 1);
                return;
            }
        }

        for(let i=0; i<this._elements.length; i++){
            if(this._elements[i].typeName=='Group'){
                this._elements[i].removeElement(element);
                if(this._elements[i].elements.length==0){
                    this._elements.splice(i, 1);
                }
            }
        }
    }
    

    /**
     * @param {Point} point
     * @param {float} eps
     * @return {Array.<GraphicElement>}
     */
    getNearElements(point, eps){
        let res = [];
        for(let element of this._elements){
            if(element.isNear(point, eps)){
                res.push(element);
            }
        }
        return res;
    }

    /**
     * @deprecated  The method can have an error if the figure is a concave element
     *
     * @param {ClosedFigure} figure
     * @return {Array.<GraphicElement>}
     */
    getElementsIntoFigure(figure){
        let res = [];
        for(let element of this._elements){
            if(element.isIntoFigure(figure)){
                res.push(element);
            }
        }
        return res;
    }

    /**
     * @param {Array.<GraphicElement>|GraphicElement|null} elements - if null return extrenum for all elements
     * @deprecated to use new getExtremum method
     * @returns {{max:{x:number, y:number}, min:{x:number, y:number}}}
     */
    getExtrenum(elements){
        if(elements instanceof Array){
            return Document.getExtrenumForElements(elements);
        }else{
            if(elements instanceof GraphicElement){
                return elements.getExtrenum();
            }else{
                return Document.getExtrenumForElements(this._elements);
            }
        }
    }

    getExtremum(elements){
        let ext = this.getExtrenum(elements);
        return new (container.resolve('math').Extremum)(ext.min.x, ext.min.y, ext.max.x, ext.max.y);
    }

    /**
     * @return {Array.<GraphicElement>}
     */
    getListSimpleElements(){
        return Document.toSimpleListElements(this._elements);
    }

    /**
     * @inheritDoc
     * 
     */
    render(board){
        m: for(let element of this._elements){
            for(let el of app.selectElements){
                if(el.compare(element)){
                    continue m;
                }
            }
            element.render(board);
        }
    }

    resetRendererConfig(){
        for(let element of this._elements) {
            element.resetRendererConfig();
        }
    }

    getSnapshot(){
        let sn = new Document();
        for(let el of this._elements){
            sn.addElement(el.copy());
        }
        return sn;
    }

    load(snapshot){
        this._elements = snapshot._elements;
    }

    // /**
    //  * This is a modifier method.
    //  * It finds lines that overlap each other and merge them into one line.
    //  */
    // mergeLines(){
    //     /** @type {Array.<LineElement>} */
    //     let lines = this._elements.filter(el=>el instanceof LineElement);
    //     let baseVector = new Vector(1);
    //
    //
    //     for(let i=0; i<lines.length; i++){
    //         for(let j=0; j<lines.length; j++){
    //             if(i==j){
    //                 continue;
    //             }
    //             let angle = lines[i]._line.toVector().getAngle(lines[j]._line.toVector());
    //
    //             angle = parseFloat(angle.toFixed(4));
    //
    //             console.log(angle);
    //             if(angle==0 || angle==180){
    //                 //merge
    //                 //mark i & j like merged
    //             }
    //         }
    //     }
    //
    // }

    /**
     * @param elements
     * @return {Array.<GraphicElement>}
     */
    static toSimpleListElements(elements){
        let res = [];
        for(let el of elements){
            res.push(...el.toSimpleElements());
        }
        return res;
    }
}