import Board from "./board/Board";

export default class DocumentRendererBoard extends Board{
    constructor() {
        super();

        /**
         * It's abstraction with data structure and implementation the {@class Renderable}.
         * @type {Renderable}
         * @private
         */
        this._document = null;

        if(ENV !='test') {
            setTimeout(() => {
                try {
                    this.render()
                } catch (e) {
                    console.warn(e);
                }
            }, 100);
        }

        container.resolve('config').addHandler('change', (e)=>{
            if(e=='dimension'){
                this.render();
            }
        });
    }


    /**
     * @inheritDoc
     */
    setSize(width, height){
        super.setSize(width, height);
        this.render();
    }

    render() {
        this.clear('#ffffff');
        if(this.document){
            this.document.render(this);
        }
    }

    /**
     * @returns {boolean} - true if zoomed
     */
    zoomToFitScreen(){
        if(this.document._elements.length==0){
            return false;
        }
        let ext = this._document.getExtrenum();
        let width = ext.max.x-ext.min.x;
        let height = ext.max.y-ext.min.y;

        let O = this._convertToGlobalCoordinateSystem({x:0,y:0});
        let wh = this._convertToGlobalCoordinateSystem({x:this._width-25,y:this._height-25});

        let localWidth = wh.x-O.x;
        let localHeight = O.y-wh.y;

        let zoom = Math.min(localWidth/width,localHeight/height);

        let coef = 1.2;
        if(zoom!=localWidth/width){
            coef=1.5;
        }

        this._setScale((this._scale*zoom)/coef);


        let leftUpPoint = this._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(ext.min.x, ext.max.y));
        let rightDownPoint = this._convertToLocalCoordinateSystem(new (container.resolve('math')).Point(ext.max.x, ext.min.y));
        this._bias.x-=leftUpPoint.x-this._width/2+(rightDownPoint.x-leftUpPoint.x)/2+10;
        this._bias.y-=leftUpPoint.y-this._height/2+(rightDownPoint.y-leftUpPoint.y)/2+50;

        this.render();
        return true;
    }

    /**
     * @param {{x: number, y: number}} point
     * @param {number} dZoom -  0..1..*
     * @protected
     */
    zoomAroundPoint(dZoom, point){
        super.zoomAroundPoint(dZoom, point);
        this.render();
    }

    set document(doc){
        this._document=doc;
    }

    get document(){
        return this._document;
    }

}