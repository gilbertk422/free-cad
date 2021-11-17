/**
 * Created by dev on 29.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Tool from './Tool';
import Group from '../../../model/elements/Group';
import LineElement from '../../../model/elements/LineElement';

import EraserNearElementsCommand from './../../../command/EraserNearElements';


export default class EraserTool extends Tool{
    constructor(document){
        super(document);

        this.name="Eraser";
        this.cursor.src = 'resources/images/Eraser.png';
    }

    /**
     * @param {Point} point
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseMove(point){
        super.mouseMove(point);
        this._selectNearElements(point);
        return true;
    }

    /**
     * @param {Point} point
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseDbClick(point){
        return true;
    }

    /**
     * @param {Point} point
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseClick(point){
        return true;
    }


    /**
     * @param {Point} point
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseDown(point){
        let scale = container.resolve('mainBoard')._scale; //todo: maybe set from the using place
        let eps = (scale>1?0.2:0.05)/scale;


        this._selectNearElements(point);

        app.executeCommand(new EraserNearElementsCommand(app.currentDocument, point, eps));

        // let all = [];
        // let nearElements = [];
        // let allPolyLines = [];
        // let nearPolyLines = [];
        // for (let el of this._document._elements) {
        //     if (el.typeName == 'Group') {
        //         let elements =  this._getElementsFromGroup(el);
        //         for(let element of elements){
        //             if(element.isNear(point,eps)){
        //                 nearElements.push(element);
        //                 nearPolyLines.push(element.toPolyLines()[0]); //[0] because elements is native element
        //             }else {
        //                 all.push(element);
        //                 allPolyLines.push(element.toPolyLines()[0]); //[0] because elements is native element
        //             }
        //         }
        //     } else {
        //         if(el.isNear(point,eps)){
        //             nearElements.push(el);
        //             nearPolyLines.push(el.toPolyLines()[0]); //[0] because elements is native element
        //         }else {
        //             all.push(el);
        //             allPolyLines.push(el.toPolyLines()[0]); //[0] because elements is native element
        //         }
        //     }
        // }
        //
        // for(let i=0; i<nearPolyLines.length; i++){
        //     /** @var {Array.<Point>} */
        //     let crossPoints = [];
        //     let polylines = [];
        //     for(let j=0; j<allPolyLines.length; j++){
        //         /** @var {Array.<Point>} */
        //         let points = nearPolyLines[i].getCrossPoints(allPolyLines[j]);
        //         for(let p of points) {
        //             crossPoints.push(p);
        //             polylines.push(allPolyLines[j]);
        //         }
        //     }
        //
        //     console.log(crossPoints);
        //
        //     let resPoints = [];
        //
        //     //удалить точки которые не учавствуют в обрезании
        //
        //     for(let j=0; j<crossPoints.length; j++){
        //         let line = new LineElement(point, crossPoints[j]).toPolyLines()[0]; //todo: use PolyLine
        //         let count = 0;
        //
        //         for(let k=0; k<polylines.length; k++){
        //             let points = line.getCrossPoints(polylines[k]);
        //             count +=points.length
        //         }
        //         console.log(count);
        //     }
        //
        //     console.log(resPoints);

            //check count points
            //remove line


        // }
        // console.log(crossPoints);




        // todo: get list erasers elements
        //
        // todo: remove select line
        // todo: create new two parts line
        // todo: add new parts to document



        return true;
    }

    /**
     * @param {Point} point
     * @return {boolean} false if not changing any GraphicElement
     */
    mouseUp(point){
        return true;
    }

    // _getElementsFromGroup(group){
    //     let res = [];
    //     let elements = group.elements;
    //
    //     for(let el of elements){
    //         if(el.typeName == 'Group'){
    //             res.push(...this._getElementsFromGroup(el));
    //         }else{
    //             res.push(el);
    //         }
    //     }
    //     return res;
    // }

    _selectNearElements(point){
        let elements = this._getNearElements(point);
        for(let element of elements){
            element._renderer.setFocus(true);
        }
    }

    _getNearElements(point){
        let scale = container.resolve('mainBoard')._scale; //todo: maybe set from the using place
        return this.document.getNearElements(point, (scale>1?0.2:0.05)/scale);
    }
}