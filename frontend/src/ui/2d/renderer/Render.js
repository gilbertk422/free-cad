/**
 * Created by dev on 09.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Renderable from './../Renderable';

/**
 * @inheritDoc
 */
export default class Render extends Renderable{
    /**
     * @param {Element} element
     */
    constructor(element){
        super();
        /** @var {GraphicElement} */
        this.element = element;

        this.new=false;
        this.focus = false;
        this.highlight = false;

        this.error = false;
        this.renderMagnificationPoint=true;
    }

    /**
     * @inheritDoc
     */
    render(board){
        this.setUpStyle(board);
        this.drawElement(board);
        if(this.renderMagnificationPoint && this.focus){
            this.drawMagnificationPoints(board);
        }
    }

    setUpStyle(board){
        let props = this.element.lineType.getLineStyle();
        for(let prop in props){
            board.style(prop, props[prop]);
        }

        if(this.new){
            board.style('dash', [4, 4]);
            board.style('strokeStyle', '#555555');
            board.style('fillStyle', '#555555');
        }
        if(this.focus){
            board.style('strokeStyle', '#ff641a');
            board.style('fillStyle', '#ff641a');
        }
        if(this.highlight) {
            board.style('lineWidth', 2);
        } else {
            board.style('lineWidth', 1);
        }
        if(this.error){
            board.style('strokeStyle', '#ff0000');
            board.style('fillStyle', '#ff0000');
            board.style('lineWidth', 2);
        }
    }

    drawAsNew(){
        this.new = true;
    }

    setFocus(focus){
        this.focus=focus;
    }

    setHighlight(highlight) {
        this.highlight=highlight;
    }

    resetConfig(){
        this.focus=false;
        this.new=false;
        this.error=false;
        this.highlight=false;
        this.renderMagnificationPoint=true;
    }

    /**
     * Render the {@class GraphicElement} with using an instance of the {@class Board}
     * @protected
     */
    drawElement(board){
        throw new Exception("The method doesn't have implementation");
    }

    /**
     * Render the {@class GraphicElement} control points with using an instance of the {@class Board}
     * @protected
     */
    drawMagnificationPoints(board){
        let points = this.element.getMagnificationPoints();
        for(let p of points){
            this.drawControlPoint(board, p);
        }
    }

    /**
     * Draw a control point on a board
     * @param {Point} point
     * @protected
     */
    drawControlPoint(board, point){
        point = board._convertToLocalCoordinateSystem(point);

        board.style('fillStyle', '#000000');
        board._drawArc(point, 3, 0, 2*Math.PI, true);
        board.style('fillStyle', '#ffffff');
        board._drawArc(point, 2, 0, 2*Math.PI, true);
    }
}