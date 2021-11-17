import Board from "./Board";


/**
 * The class is interactive board. It's mean that class can processing mouse events.
 * For example: move the board with using mouse.
 *
 */
export default class InteractiveBoard extends Board{
    /**
     * @inheritDoc
     */
    constructor(){
        super();

        this._mouseDown = null;
        this._touchDistance = 0;
        this._scaling = false;

        this._canvas.addEventListener('mousemove', e=>this.mouseMove(e));
        this._canvas.addEventListener('mousedown', e=>this.mouseDown(e));
        this._canvas.addEventListener('mouseup', e=>this.mouseUp(e));

        this._canvas.addEventListener("touchmove", e=>this.touchMove(e));
        this._canvas.addEventListener("touchstart", e=>this.touchDown(e));
        this._canvas.addEventListener("touchend", e=>this.touchUp(e));

        let lastWheel=0;
        if (this._canvas.addEventListener) {
            if ('onwheel' in document) {
                this._canvas.addEventListener("wheel", e=>{
                    let delay = new Date().getTime()-lastWheel;
                    this.mouseWheel(e, delay);
                    lastWheel=new Date().getTime();
                });
            } else if ('onmousewheel' in document) {
                this._canvas.addEventListener("mousewheel", e=>{
                    let delay = new Date().getTime()-lastWheel;
                    this.mouseWheel(e, delay);
                    lastWheel=new Date().getTime();
                });
            } else {
                this._canvas.addEventListener("MozMousePixelScroll", e=>{
                    let delay = new Date().getTime()-lastWheel;
                    this.mouseWheel(e, delay);
                    lastWheel=new Date().getTime();
                });
            }
        } else {

            this._canvas.attachEvent("onmousewheel", e=>{
                let delay = new Date().getTime()-lastWheel;
                this.mouseWheel(e, delay);
                lastWheel=new Date().getTime();
            });
        }
        this._canvas.addEventListener('click',  e=>this.mouseClick(e));
        this._canvas.addEventListener('dblclick',  e=>this.mouseDbClick(e));
    }


    _touchDistanceCaculate(tt1,tt2){
        return new (container.resolve('math')).Point(
            tt1.pageX - tt1.target.offsetLeft,
            tt1.pageY - tt1.target.offsetTop
        ).distanceTo(new (container.resolve('math')).Point(
            tt2.pageX - tt2.target.offsetLeft,
            tt2.pageY - tt2.target.offsetTop
        ));
    }

    _touchCenter(tt1,tt2){
        let rect = tt1.target.getBoundingClientRect();
        let x1 = tt1.pageX - rect.left;
        let x2 = tt2.pageX - rect.left;
        let y1 = tt1.pageY - rect.top;
        let y2 = tt2.pageY - rect.top;

        return {x:x1+(x2-x1)/2, y:y1+(y2-y1)/2};
    }

    _convertTouchCoordinates(touch){
        let element = touch.target;
        let rect = element.getBoundingClientRect();
        return {
            offsetX:touch.pageX - rect.left,
            offsetY:touch.pageY - rect.top
        }
    }

    touchDown(e){
        e.preventDefault();
        let tt = e.targetTouches;
        if (tt.length >= 2) {
            this._touchDistance = this._touchDistanceCaculate(tt[0],tt[1]);
            this._scaling = true;
        } else {
            this._scaling = false;
            this._mouseDown = null;
            this.mouseDown(this._convertTouchCoordinates(e.touches[0]));
        }
    }

    touchMove(e){
        e.preventDefault();
        let tt = e.targetTouches;
        if (this._scaling) {
            let newDistance = this._touchDistanceCaculate(tt[0],tt[1]);
            let curr_scale =  newDistance/ this._touchDistance;
            this._touchDistance = newDistance;
            this.zoomAroundPoint(curr_scale, this._touchCenter(tt[0], tt[1]));
        }else {
            this.mouseMove(this._convertTouchCoordinates(e.touches[0]));
        }
    }

    touchUp(e){
        e.preventDefault();
        this._scaling=false;
        let p = this._mouseDown;
        this.mouseUp(p);
        this.mouseClick(p);
    }


    /**
     * @param e
     * @return {boolean} - if false the mouse move event will not be call
     */
    beforeMouseMove(e){
        console.warn("The method doesn't have implementation!");
        return true;
    }

    mouseMove(e) {
        if (this.beforeMouseMove(e)) {
            if (this._mouseDown) {
                this._setBias(this._bias.x - (this._mouseDown.offsetX - e.offsetX)
                    ,this._bias.y - (this._mouseDown.offsetY - e.offsetY));
                this._mouseDown = e;
            }
        }
    }

    mouseUp(e) {
        this._mouseDown = null;
    }

    mouseDown(e) {
        this._mouseDown = e;
    }

    mouseClick(e) {
        console.warn("The method doesn't have implementation!");
    }

    mouseWheel(e, delay) {
        let k = 0;
        if(delay>500){
            k=1000;
        }else if(delay>50){
            k=500;
        }else{
            k=200;
        }
        let dScale = e.deltaY / k;
        this.zoomAroundPoint(1-dScale,{x:e.offsetX, y:e.offsetY});
    }

    mouseDbClick(e) {
        console.warn("The method doesn't have implementation!");
    }

}