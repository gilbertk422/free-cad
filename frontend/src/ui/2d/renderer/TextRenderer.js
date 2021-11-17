/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Render from './Render';
import Trigonometric from "../../../model/math/Trigonometric";
import FontManager from "../../../model/elements/text/FontManager";

export default class TextRenderer extends Render{
    /**
     * @param {Text} element
     */
    constructor(element){
        if(!element instanceof Text){
            throw new Exception('The renderer can render only Text objects');
        }
        super(element);
    }

    /**
     * @inheritDoc
     */
    drawElement(board){
        let height = this.element.fontSize * board._pixelPerOne*board._scale;

        let p = board._convertToLocalCoordinateSystem(this.element.position);

        let radianAngle = Trigonometric.gradToRad(this.element.angle);
        board._context.save();
        board._context.translate(p.x, p.y);
        board._context.rotate(-radianAngle);

        if(this.element.font && this.element.font.isLoad && this.element.lineType.name=='Auto') {
            height*=1.325;
            let font = this.element.font.font;

            let path = font.getPath(this.element.text, 0, 0, height);

            let props = this.element.lineType.getLineStyle();
            path.stroke= props['strokeStyle'];
            path.fill =props['fillStyle'];
            if(this.focus){
                path.stroke= '#ff641a';
                path.fill ='#ff641a';
            }
            if(this.error){
                path.stroke='#ff0000';
                path.fill ='#ff0000';
            }

            if(this.element.lineType.name=="Auto"){
                path.fill=null;
            }

            path.draw(board._context);

            if(global.debug.showTextMetrics) {
                font.drawMetrics(board._context, this.element.text, 0, 0, height);
                board._drawText({x:0, y:20}, "Font size:"+height+" px");
            }


        }else{
            // let f = JSON.parse(Helper.Request.httpGet('/resources/data/specialFont.json'));

            let right = 0;

            let m = height/100;
            for(let s=0; s<this.element.text.length; s++) {
                let symbol = FontManager.getCharacter(this.element.text.charCodeAt(s));
                for (let str of symbol.char.stroke) {
                    let points = [];
                    for (let i = 0; i < str.length; i++) {

                        points.push(
                            {
                                x: (parseFloat(str[i].x*m)+right),
                                y: (-str[i].y*m)
                            }
                        );
                    }
                    board._drawPolyLine(points, false);
                }
                right+=symbol.right*m;
            }

        }

        board._context.restore();

    }

}