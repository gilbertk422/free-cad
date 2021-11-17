/**
 * Created by dev on 04.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './Command';
import GraphicElement from '../model/GraphicElement'
import LineElement from "../model/elements/LineElement";
import Bend from "../model/line_types/Bend";
import Auto from "../model/line_types/Auto";

export default class AddElementCommand extends Command{
    /**
     * @param {Document} document
     * @param {GraphicElement} element
     */
    constructor(document, element, moveToCenter=true){
        super(document);

        this._element = element;

        this.name= 'AddElementCommand';

        this.moveToCenter=moveToCenter;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        if(!(this._element instanceof LineElement) && (this._element.lineType instanceof Bend)){
            this._element.lineType = new Auto();
        }

        if(this.document._elements.length==0){
            let point = null;
            switch (this._element.typeName) {
                case "Line":
                    point = this._element.p1.copy();
                    break;
                case "Group":
                    let ext = this._element.getExtrenum();
                    point = new (container.resolve('math').Point)(ext.min.x, ext.min.y);
                    break;
                case "Arc":
                    point = this._element.center.copy();
                    break;
                case "Spline":
                    point = this._element.startPoint.copy();
                    break;
            }
            if(point && this.moveToCenter) {
                this._element.move(-point.x, -point.y);

                /** @type {Board} */
                let board = container.resolve('mainBoard');

                board.moveCenterTo(point);
            }
        }


        this._document.addElement(this._element);
        return true;
    }
}