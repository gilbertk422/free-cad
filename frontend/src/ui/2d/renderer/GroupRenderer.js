/**
 * Created by dev on 11.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Render from './Render';

export default class GroupRenderer extends Render{
    constructor(element){
        super(element);

        this.renderMagnificationPoint=false;
    }

    /**
     * @inheritDoc
     */
    drawElement(board){
        for(let element of this.element.elements){
            element._renderer.renderMagnificationPoint=false;
            element.render(board);
        }
        // let center = this.element.getCenter();
        // board.style('fillStyle', '#ff0000');
        // board.drawArc(center, 0.2, true);
    }

    drawAsNew(){
        for(let element of this.element.elements){
            element._renderer.drawAsNew();
        }
    }

    setFocus(focus){
        for(let element of this.element.elements){
            element._renderer.setFocus(focus);
        }
    }

    setHighlight(highlight){
        for(let element of this.element.elements){
            element._renderer.setHighlight(highlight);
        }
    }

    resetConfig(){
        for(let element of this.element.elements){
            element.resetRendererConfig();
        }
    }
}