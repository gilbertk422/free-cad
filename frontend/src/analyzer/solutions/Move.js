import Extend from './Extend';

export default class Move extends Extend{

    /**
     * @param {Document} document
     * @param {GraphicElement} element
     */
    constructor(document, oldElement, newElement){
        super(document, [oldElement], [newElement]);
        this.name = "Move line";
    }
}