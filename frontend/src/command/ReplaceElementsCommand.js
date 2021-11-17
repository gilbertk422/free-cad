/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './Command';
import GraphicElement from '../model/GraphicElement'
import LineElement from "../model/elements/LineElement";
import Bend from "../model/line_types/Bend";
import Auto from "../model/line_types/Auto";

export default class ReplaceElementsCommand extends Command{
    /**
     * @param {Document} document
     * @param {Array<GraphicElement>} addElements
     * @param {Array<GraphicElement>} removeElements
     */
    constructor(document, addElements, removeElements){
        super(document);

        this._elements = addElements;
        this._removeElements = removeElements;

        this.name= 'ReplaceElementsCommand';
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this._elements){
            this.addElement(el);
        }
        for(let el of this._removeElements){
            this._document.removeElement(el);
        }
        return true;
    }

    addElement(element){
        if(!(element instanceof LineElement) && (element.lineType instanceof Bend)){
            element.lineType = new Auto();
        }

        this._document.addElement(element);
    }
}