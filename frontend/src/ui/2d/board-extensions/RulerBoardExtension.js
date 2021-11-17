/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import BoardExtension from './../BoardExtension';

/**
 * The class renders ruler on the left and top sides, with calculation the bias, scale etc. parameters.
 */
export default class RulerBoardExtension extends BoardExtension{

    /**
     * @inheritDoc
     * @param {Board} board
     */
    constructor(board){
        super(board);

        this.isMobile =container.resolve('mobileDetector').mobile()!=null;
    }

    convertToCurrenDimension(value){
        return value;
    }

    /**
     * @inheritDoc
     */
    render(board){
        let rulerWidth = 20;
        let rulerBackgroundColor = '#efefef';
        let fillColor = '#444444';
        if(this.isMobile) {
            fillColor = '#d7d7d7';
        }
        let dimension = 1;

        this.board.style('font','400 9px Arial');
        this.board.style('textBaseline','middle');
        this.board.style('textAlign','center');


        this.board._context.fillStyle = fillColor;
        this.board._context.strokeStyle = fillColor;

        if(!this.isMobile) {
            this.board.style('fillStyle', rulerBackgroundColor);
            this.board._drawRect({ x: rulerWidth, y: 0 }, { x: this.board._width, y: rulerWidth }, true);
        }
        this.board.style('fillStyle',fillColor);
        let convertX =x=>x*this.board._pixelPerOne*this.board._scale*dimension+this.board._initCenterPosition.x+this.board._bias.x;

        let divider = 1;
        if(container.resolve('config').dimension == 'Inches'){
            dimension = 25.4;
            divider = 0.05;
            if(this.board._scale<0.0002)       divider = 500;
            else if(this.board._scale<0.0004)  divider = 200;
            else if(this.board._scale<0.0005)  divider = 100;
            else if(this.board._scale<0.002)  divider = 50;
            else if(this.board._scale<0.003)  divider = 20;
            else if(this.board._scale<0.01)  divider = 10;
            else if(this.board._scale<0.02)   divider = 5;
            else if(this.board._scale<0.04)   divider = 2;
            else if(this.board._scale<0.1)   divider = 1;
            else if(this.board._scale<0.2)    divider = 0.5;
            else if(this.board._scale<0.5)    divider = 0.2;
            else if(this.board._scale<1)      divider = 0.1;
            else if(this.board._scale>500)     divider = 0.0001;
            else if(this.board._scale>130)     divider = 0.0002;
            else if(this.board._scale>100)     divider = 0.0005;
            else if(this.board._scale>40)     divider = 0.001;
            else if(this.board._scale>15)     divider = 0.005;
            else if(this.board._scale>7)     divider = 0.01;
            else if(this.board._scale>2)      divider = 0.02;
        }
        else {
            if(this.board._scale<0.0002)       divider = 10000;
            else if(this.board._scale<0.0005)  divider = 5000;
            else if(this.board._scale<0.001)  divider = 2000;
            else if(this.board._scale<0.002)  divider = 1E3;
            else if(this.board._scale<0.005)  divider = 500;
            else if(this.board._scale<0.01)  divider = 200;
            else if(this.board._scale<0.02)   divider = 100;
            else if(this.board._scale<0.03)   divider = 50;
            else if(this.board._scale<0.1)   divider = 25;
            else if(this.board._scale<0.2)    divider = 10;
            else if(this.board._scale<1)      divider = 5;
            else if(this.board._scale>500)     divider = 0.005;
            else if(this.board._scale>100)     divider = 0.01;
            else if(this.board._scale>40)     divider = 0.05;
            else if(this.board._scale>15)     divider = 0.1;
            else if(this.board._scale>7)     divider = 0.2;
            else if(this.board._scale>2)      divider = 0.5;
        }


        let drawDivision = (x)=>{
            let dcm = 1E3;
            if (divider < 0.001)
                dcm = 1E4;
            x=Math.round((x)*dcm)/dcm;
            let localX = convertX(x);
            let l = Math.round(x*dcm)%(divider*dcm)==0?10:5;
            if(l==10){
                x=Math.round((this.convertToCurrenDimension(x))*dcm)/dcm;
                this.board._context.fillText(x, localX, 6);
            }
            this.board._context.fillRect(localX, rulerWidth-l, 1, l);
        };


        let delta = 1;
        if(divider>5){
            delta = parseInt(divider/5);
        }else {
            if(container.resolve('config').dimension == 'Inches'){
                delta = divider;
            } else {
                delta = divider == 5?1:divider;
            }
        }

        let minX = this.board._convertToGlobalCoordinateSystem({x:0,y:0}).x/dimension - delta*2;
        let maxX = this.board._convertToGlobalCoordinateSystem({x:this.board._width+rulerWidth,y:0}).x/dimension + delta*2;
        minX = Math.floor(minX/divider)*divider;
        if(maxX<=0 || minX>0){
            for (let x = minX; x < maxX; x+=delta) drawDivision(x);
        }else{
            for (let x = 0; x < maxX; x+=delta) drawDivision(x);
            for (let x = 0; x > minX; x-=delta) drawDivision(x);
        }

        if(!this.isMobile) {
            this.board.style('fillStyle', rulerBackgroundColor);
            this.board._drawRect({ x: 0, y: 0 }, { x: rulerWidth, y: this.board._height }, true);
        }
        this.board.style('fillStyle',fillColor);
        this.board._context.rotate(-Math.PI / 2);

        let convertY =y=>y*this.board._pixelPerOne*this.board._scale*dimension+this.board._initCenterPosition.y+this.board._bias.y;


        let drawDivisionY = (x)=>{
            let dcm = 1E3;
            if (divider < 0.001)
                dcm = 1E4;
            let localX = convertY(-x);
            let l = Math.round(x*dcm)%(divider*dcm)==0?10:5;
            if(l==10){
                x=Math.round((this.convertToCurrenDimension(x))*dcm)/dcm;
                this.board._context.fillText(x, -localX, 6);
            }
            this.board._context.fillRect(-localX,rulerWidth-l, 1,l);
        };
        let maxY = this.board._convertToGlobalCoordinateSystem({x:0,y:rulerWidth}).y/dimension + delta*2;
        let minY = this.board._convertToGlobalCoordinateSystem({x:0,y:this.board._height}).y - delta*2;
        minY = Math.floor(minY/divider)*divider;
        if(maxY<=0 || minY>0){
            for (let y = minY; y < maxY; y+=delta) drawDivisionY(y);
        }else{
            for (let y = 0; y < maxY; y+=delta) drawDivisionY(y);
            for (let y = 0; y > minY; y-=delta) drawDivisionY(y);
        }

        this.board._context.rotate(Math.PI / 2);
    }
}