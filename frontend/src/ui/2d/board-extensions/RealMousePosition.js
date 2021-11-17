/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import InteractiveBoardExtension from './InteractiveBoardExtension';

/**
 * The class render current mouse position.
 * Used for debug
 */
export default class RealMousePosition extends InteractiveBoardExtension{
    /**
     * @inheritDoc
     * @param {InteractiveBoard} board
     */
    constructor(board){
        super(board);
        /** @type {{x:number,y:number}} - current mouse position */
        this._mousePosition = {x: 0, y: 0};
    }

    /**
     * @inheritDoc
     * @param {{x:number,y:number}} position
     */
    mouseMove(position){
        this._mousePosition=position;
    }


    /**
     * @inheritDoc
     */
    render(board){
        this.board.style('fillStyle','rgba(200, 0, 50, 1.0)');
        this.board.style('font','12px Arial');
        this.board._drawText(this._mousePosition, 'x:'+this._mousePosition.x.toFixed(3)+"  y:"+this._mousePosition.y.toFixed(3), 0,  true);

    }

}