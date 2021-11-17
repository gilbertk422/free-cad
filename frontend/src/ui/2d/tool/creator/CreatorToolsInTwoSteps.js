/**
 * Created by dev on 31.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import CreatorTool from '../CreatorTool';

export default class CreatorToolsInTwoSteps extends CreatorTool{
    constructor(document){
        super(document);

        this._element = null;
        this.step=0
    }

    get graphicElement(){
        return this._element;
    }

    mouseMove(point, e){
        super.mouseMove(point);
        if(this._element){
            this.setPosition2(point);
            return true;
        }
        return false;
    }

    mouseClick(point, e){
        if(this.step==2) {
            this._element = null;
        }
    }

    mouseDown(point, e){
        if(!this._element){
            this._element = this.createElement(point);
            this.graphicElement._renderer.drawAsNew();
            this.step = 1;
        }else{
            if(e.button==2){ //Right
                this._element = null;
                this.step=0;
            }
            this.step=2;
        }
    }

    mouseUp(point, e){
        if(this._element){
            if(this.step ==2) {
                this.setPosition2(point);
                this.addElementToDocument(this.graphicElement);
                this.graphicElement._renderer.resetConfig();
                this._element = null;
            }
        }
    }

    render(board){
        if(this.graphicElement){
            this.graphicElement.render(board);
        }
        super.render(board);
    }

    setPosition2(point){
        throw new Exception("The method doesn't have implementation");
    }

    createElement(point){
        throw new Exception("The method doesn't have implementation");
    }
}