/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import InteractiveBoardExtension from './InteractiveBoardExtension';

/**
 * The class render current mouse position on top and left sides.
 */
export default class MousePointerBoardExtension extends InteractiveBoardExtension{
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
        let rulerWidth = 20;
        let rulerBackgroundColor = '#efefef';


        this.board.style('fillStyle',getComputedStyle(document.body).getPropertyValue('--base-color'));
        this.board._context.beginPath();
        this.board._context.moveTo(this._mousePosition.x, 20);
        this.board._context.lineTo(this._mousePosition.x - 3, 20 - 9);
        this.board._context.lineTo(this._mousePosition.x + 3, 20 - 9);
        this.board._context.lineTo(this._mousePosition.x, 20);
        this.board._context.fill();


        this.board._context.beginPath();
        this.board._context.moveTo(20, this._mousePosition.y);
        this.board._context.lineTo(20 - 9, this._mousePosition.y - 3);
        this.board._context.lineTo(20 - 9, this._mousePosition.y + 3);
        this.board._context.lineTo(20,this._mousePosition.y);
        this.board._context.fill();

        this.board.style('fillStyle',rulerBackgroundColor);
        this.board._drawRect({x: 0, y: 0}, {x: rulerWidth+5, y: rulerWidth+5}, true);
    }

}