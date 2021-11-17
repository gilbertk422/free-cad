/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Renderable from './Renderable';

/**
 * The interface is needed for description board extensions.
 *
 * The boarsExtension is needed to display items on the {@class Board} that are not part of the displayed data.
 * For example, a ruler.
 *
 * @interface
 */
export default class BoardExtension extends Renderable{
    /**
     * @param {Board} board
     */
    constructor(board){
        super();

        /** @type {Board} */
        this.board = board;
    }

    setSize(width, height){

    }

}