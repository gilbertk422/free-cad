import Observable from "../../../Observable";

let Trigonometric = container.resolve('math').Trigonometric;

/**
 * The class need for drawing simple graphic elements with using abstract coordinate system (not in pixel).
 * The class is a virtual canvas. The class provides the ability to move and scale the
 * canvas with using the virtual coordinate system (not in pixels).
 */
export default class Board extends Observable{
    constructor() {
        super();
        this._scale = 1;
        this._bias = {x: 0, y: 0}; // pixel
        this._initCenterPosition = {x: 0, y: 0}; //pixel

        this._pixelPerOne=50;

        this._canvas= document.createElement('canvas');
        this._canvas.addEventListener('contextmenu', event => event.preventDefault());
        this._context = this._canvas.getContext('2d');

        this._width = 500;
        this._height = 500;
    }

    get canvas(){
        return this._canvas;
    }

    /**
     * Use the method when init and resize the canvas. To display the correct proportions.
     * @param {number} width - in pixel
     * @param {number} height - in pixel
     */
    setSize(width, height) {
        this._width = width;
        this._height = height;
        this._context.canvas.width  = width;
        this._context.canvas.height = height;
        this._initCenterPosition.x=width/2;
        this._initCenterPosition.y=height/2;
    }

    /**
     * The method of sketching the entire canvas given colors
     * @param {string} color - clean color
     */
    clear(color) {
        this.style('fillStyle', color?color:'#ffffff');
        this._drawRect({x: 0, y: 0}, {x: this._width, y: this._height}, true);
    }

    /**
     * Method sets styles for drawing elements.
     * @see(https://www.w3.org/TR/2dcontext/#line-styles) - for example
     * @param {string} property -  <code>fillStyle</code> - is example
     * @param {string|number} value - <code>#664334</code> - is example
     */
    style(property, value){
        switch(property){
            case 'dash':
                this._context.setLineDash(value);
                break;
            default:
                this._context[property]=value;
        }

    }

    /**
     * @return {{x: number, y: number}} - pixel center
     */
    getCenter(){
        return {x: this._width/2, y: this._height/2};
    }

    /**
     * @param {Point} point
     * @return {{x: number, y: number}}
     * @private
     */
    _convertToLocalCoordinateSystem(point, round=true){
        let multiplier = this._pixelPerOne*this._scale;
        let res = {x:point.x*multiplier+this._initCenterPosition.x+this._bias.x
            , y:-point.y*multiplier+this._initCenterPosition.y+this._bias.y};

        if(round){
            res.x=parseInt(res.x);
            res.y=parseInt(res.y);
        }

        return res;
    }

    /**
     * @param {{x: number, y: number}} point
     * @return {Point}
     * @private
     */
    _convertToGlobalCoordinateSystem(point){
        let divider = this._pixelPerOne*this._scale;
        return new (container.resolve('math')).Point(
            (point.x-this._initCenterPosition.x-this._bias.x)/divider,
            -(point.y-this._initCenterPosition.y-this._bias.y)/divider,
            0
        );
    }

    /**
     * @param {{x: number, y: number}} point
     * @param {number} dZoom -  0..1..*
     * @protected
     */
    zoomAroundPoint(dZoom, point){
        let was = this._convertToGlobalCoordinateSystem(point);
        if(this._setScale(this._scale*dZoom)) {
            let now = this._convertToGlobalCoordinateSystem(point);
            this._setBias(this._bias.x+((now.x-was.x)*this._pixelPerOne*this._scale)
                ,this._bias.y-((now.y-was.y)*this._pixelPerOne*this._scale));
        }
    }

    /**
     * @param {Point} point
     */
    moveCenterTo(point){
        let position = this._convertToLocalCoordinateSystem(point);

        let x = this._bias.x-(this._bias.x-(position.x-this._width/2));
        let y = this._bias.y-(this._bias.y-(position.y-this._height/2));

        this._setBias(x,y);
    }

    //<editor-fold desc="methods for drawing simple elements">

    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    drawLine(p1,p2){
        this._drawLine(this._convertToLocalCoordinateSystem(p1), this._convertToLocalCoordinateSystem(p2));
    }

    /**
     * counterclockwise angle
     * @param {Point} center
     * @param {number} radius - in global coordinate system
     * @param {number} startAngle - in degrees
     * @param {number} endAngle - in degrees
     * @param {boolean} fill
     */
    drawArc(center, radius, startAngle, endAngle, fill){
        let start = 0;
        let end = 2*Math.PI;
        if((startAngle!=0 || endAngle!=0) && startAngle!=endAngle){
            start = Trigonometric.gradToRad(startAngle);
            end = Trigonometric.gradToRad(endAngle);
        }
        center = this._convertToLocalCoordinateSystem(center);
        radius = radius*this._pixelPerOne*this._scale;
        this._drawArc(center,radius, start, end, fill);
    }

    /**
     * @param {Array.<Point>} points
     */
    drawPolyLine(points){
        let localPoints = [];
        for(let p of points){
            localPoints.push(this._convertToLocalCoordinateSystem(p));
        }
        this._drawPolyLine(localPoints);
    }

    /**
     * @param {Point} position
     * @param {string} text
     * @param {number} angle - in degrees.
     * @param {boolean} fill
     */
    drawText(position,text, angle, fill){
        this._drawText(this._convertToLocalCoordinateSystem(position), text, angle, fill);
    }

    /**
     * @param {Point} start
     * @param {Point} controlPoint1
     * @param {Point} controlPoint2
     * @param {Point} end
     */
    drawBezier(start, controlPoint1, controlPoint2, end){
        this._drawBezier(
            this._convertToLocalCoordinateSystem(start),
            this._convertToLocalCoordinateSystem(controlPoint1),
            this._convertToLocalCoordinateSystem(controlPoint2),
            this._convertToLocalCoordinateSystem(end)
        )
    }

    /**
     * @param {Image} image
     * @param {Point} position
     */
    drawImage(image, position, width, height, alpha){
        let w = width*this._pixelPerOne*this._scale;
        let h = height*this._pixelPerOne*this._scale;
        this._drawImage(image, this._convertToLocalCoordinateSystem(position), w, h, alpha);
    }

    /**
     * @param {Point} p1
     * @param {Point} p2
     * @param {boolean} fill
     */
    drawRect(p1, p2, fill) {
        this._drawRect(this._convertToLocalCoordinateSystem(p1), this._convertToLocalCoordinateSystem(p2), fill);
    }

    /**
     *
     * @param {Image}image
     * @param {{x: number, y: number}} position
     * @private
     */
    _drawImage(image, position, width, height, alpha){
        let gat = this._context.globalAlpha;
        this._context.globalAlpha = alpha;
        this._context.drawImage(image, position.x, position.y, width, height);
        this._context.globalAlpha = gat;
    }

    /**
     *
     * @param {{x: number, y: number}} start
     * @param {{x: number, y: number}} controlPoint1
     * @param {{x: number, y: number}} controlPoint2
     * @param {{x: number, y: number}} end
     */
    _drawBezier(start, controlPoint1, controlPoint2, end){
        this._context.beginPath();
        this._context.moveTo(start.x, start.y);
        this._context.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, end.x, end.y);
        this._context.stroke();
    }

    /**
     * @param {{x: number, y: number}} position
     * @param {string} text
     * @param {number} angle - in degrees.
     * @param {boolean} fill
     */
    _drawText(position,text, angle=0, fill){
        let radianAngle = Trigonometric.gradToRad(angle);

        this._context.save();
        this._context.translate(position.x, position.y);
        this._context.rotate(-radianAngle);

        if(fill) {
            this._context.fillText(text, 0, 0);
        }else {
            this._context.strokeText(text, 0, 0);
        }
        this._context.restore();
    }

    /**
     * @param {Array.<{x: number, y: number}>}points
     * @param {boolean} fill
     * @private
     */
    _drawPolyLine(points, fill){
        this._context.beginPath();
        this._context.moveTo(parseInt(points[0].x), parseInt(points[0].y));
        for(let i=1; i<points.length; i++) {
            this._context.lineTo(points[i].x, points[i].y);
        }

        if(fill){
            this._context.fill();
        }else {
            this._context.stroke();
        }
    }

    /**
     * counterclockwise angle
     * @param {{x: number, y: number}} center
     * @param {number} radius - in pixel
     * @param {number} startAngle - in radians  * 0 is by Ox axis
     * @param {number} endAngle - in radians
     * @param {boolean} fill
     */
    _drawArc(center, radius, startAngle, endAngle, fill){
        this._context.beginPath();
        this._context.arc(center.x, center.y, radius, -endAngle, -startAngle);

        if(fill){
            this._context.fill();
        }else {
            this._context.stroke();
        }
    }

    _drawLine(p1, p2) {
        this._context.beginPath();
        this._context.moveTo(parseInt(p1.x), parseInt(p1.y));
        this._context.lineTo(parseInt(p2.x), parseInt(p2.y));
        this._context.stroke();
    }

    /**
     * @param {{x:number,y:number}} p1
     * @param {{x:number,y:number}} p2
     * @param {boolean} fill
     * @private
     */
    _drawRect(p1, p2, fill) {
        this._context.beginPath();
        this._context.moveTo(p1.x, p1.y);
        this._context.lineTo(p2.x, p1.y);
        this._context.lineTo(p2.x, p2.y);
        this._context.lineTo(p1.x, p2.y);
        if (fill) {
            this._context.fill();
        } else {
            this._context.stroke();
        }
    }

    //</editor-fold>

    //<editor-fold desc="private methods">

    _setBias(x,y){
        this._bias.x=x;
        this._bias.y=y;

    }

    _setScale(scale){
        if(scale>1E4 || scale <1E-4){
            return false;
        }
        this._scale=scale;
        return true;
    }
    //</editor-fold>
}

