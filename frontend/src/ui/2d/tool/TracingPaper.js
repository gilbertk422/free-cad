import RectElement from "../../../model/elements/RectElement";
import Tool from "./Tool";

const Matrix = container.resolve('math').Matrix;
const Point = container.resolve('math').Point;
const Rect = container.resolve('math').Rect;

export default class TracingPaper extends Tool{

    /**
     * @param document
     * @param {TracingPaper} tracingPaper
     */
    constructor(document, tracingPaper){
        super(document);

        this.name="TracingPaper";
        this._mouseDown = false;

        this.cursor=null;

        this.tracingPaper = tracingPaper;

        this.drag = false;
        this.resize=false;
    }

    createRect(point){
        let p = container.resolve('mainBoard')._convertToLocalCoordinateSystem(point);

        let d=5;
        return new Rect(
            new Point(p.x-d, p.y+d),
            new Point(p.x+d, p.y-d)
        );
    }

    canResize(point){
        let imgRect = this.tracingPaper.getExtremum().toRect();
        let p = container.resolve('mainBoard')._convertToLocalCoordinateSystem(point);
        return  this.createRect(imgRect._p2).contain(p);
    }

    mouseMove(point){
        if(this.drag){
            let dx = point.x - this._mouseDown.x;
            let dy = point.y - this._mouseDown.y;
            this.tracingPaper.position.changeByMatrix(Matrix.createMoveMatrix(dx,dy));
            this._mouseDown=point;
            return true;
        }

        if(this.resize){
            let dx = point.x - this._mouseDown.x;
            let dy = point.y - this._mouseDown.y;
            this.tracingPaper.width+=dx;
            this.tracingPaper.height-=dy;
            this._mouseDown=point;
            return true;
        }

        if(this.canResize(point)){
            app.board._canvas.style.cursor = "nwse-resize";
        }else if(this.tracingPaper.getExtremum().toRect().contain(point)){
            app.board._canvas.style.cursor = "-webkit-grab";
        }else{
            app.board._canvas.style.cursor = "default";
        }

        return false;
    }

    mouseDbClick(point){

    }

    mouseClick(point){

    }

    mouseDown(point, e){
        this._mouseDown = point;
        this.drag=this.tracingPaper.getExtremum().toRect().contain(point);
        this.resize=this.canResize(point);
        if(this.resize){
            this.drag=false;
        }
    }

    mouseUp(point, e){
        this._mouseDown=null;
        this.drag=false;
        this.resize=false;
    }

    render(board){
        let rect = this.tracingPaper.getExtremum().toRect();
        let element = new RectElement(rect._p1, rect._p2).toElement();
        element.render(board);

        let r = this.createRect(rect._p2);
        board.style('fillStyle','#000000');
        board._drawRect(r._p1, r._p2,true);
    }

}