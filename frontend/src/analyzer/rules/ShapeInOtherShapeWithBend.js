import Rule from "../Rule";
import ShapeBuilder from "../ShapeBuilder";
import SetZValue from "../solutions/SetZValue";
import GraphicElement from "../../model/GraphicElement";
import RemoveElement from "../solutions/RemoveElement";


export default class ShapeInOtherShapeWithBend extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Bending is allowed only for flat shapes (can have cutouts and holes). Remove protrusions or omit bend. ";

        this._previewDoc = null;
    }

    get previewDoc(){
        if(this._previewDoc==null){
            let preview = this.document.getSnapshot();

            let previewError = this._getErrorShapeByDocument(preview).elements;

            for(let el of previewError){
                el._renderer.error=true;
            }
            this._previewDoc = preview;
        }
        return this._previewDoc;
    }

    /**
     * @return {boolean} - true if the document has an error
     * @abstract
     */
    check(){
        return this._getErrorShapeByDocument(this.document)!=null;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){

        let solutions = super.createSolutions();
        solutions[0].previewDocument=this.previewDoc;


        let errorShape = this._getErrorShapeByDocument(this.document);

        solutions.push(this.createSetZToAirInsideSolution(errorShape.elements));
        let s2 = this.createRemoveBendsSolution(errorShape);
        if(s2) {
            solutions.push(s2);
        }

        let s3 = this.createRemoveShapeSolution(errorShape);
        if(s3) {
            solutions.push(s3);
        }
        return solutions;
    }

    createRemoveBendsSolution(errorShape){
        if(errorShape.bends.length==0){
            return null;
        }
        let preview  = this.document.getSnapshot();
        let errorShapePreview = this._getErrorShapeByDocument(preview);


        for(let bend of errorShapePreview.bends){
            bend._renderer.error=true;
        }

        let solution = new RemoveElement(this.document, errorShape.bends, preview);

        solution.name=" Remove bends";
        return solution;
    }


    createRemoveShapeSolution(errorShape){
        if(errorShape.bends.length>0){
            return null;
        }
        let preview  = this.document.getSnapshot();
        let errorShapePreview = this._getErrorShapeByDocument(preview);


        for(let element of errorShapePreview.elements){
            element._renderer.error=true;
        }

        let solution = new RemoveElement(this.document, errorShape.elements, preview);

        solution.name=" Remove shape";
        return solution;
    }

    createSetZToAirInsideSolution(errorElements){
        let res = new SetZValue(this.document, errorElements, GraphicElement.AirInside);
        res.previewDoc=this.previewDoc;
        return res;
    }

    /**
     * @param {Document} document
     * @return {Shape|null}
     * @private
     */
    _getErrorShapeByDocument(document){
        let shapeBuilder = new ShapeBuilder(document);

        let shapes = shapeBuilder.buildShapes(false);

        /** @type {Array.<Shape>} */
        let otherShapes = shapes.filter(s=>s.bends.length==0 && s.height!=GraphicElement.AirInside);
        /** @type {Array.<Shape>} */
        let shapesWithBends = shapes.filter(s=>s.bends.length>0 && s.height!=GraphicElement.AirInside);

        for(let shapeWithBends of shapesWithBends){
            for(let shape of otherShapes){
                if(shapeWithBends.isContain(shape)){
                    return shape;
                }else if(shape.isContain(shapeWithBends)){
                    return shapeWithBends;
                }
            }
        }
        return null;
    }
}