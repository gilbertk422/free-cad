/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';
import Bend from "../../model/line_types/Bend";
import Intersect from '../../model/math/algorithms/intersects/Intersect'
import ShapeBuilder from '../ShapeBuilder'
import Replace from '../solutions/Replace'

export default class IncorrectBends extends Rule{
    constructor(document){
        super(document);

        this.errorMessage = "Error: Incorrect parts of bend line";
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        return this.getCrossBendsByDocument(this.document)!=null;
    }

    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        return [
            this._createNoChangeSolution(),
            this._createRemoveSolution()
        ];
    }

    _createNoChangeSolution(){
        let res = super.createSolutions();

        /** @type {Array<{base:GraphicElement, parts:Array<GraphicElement>, errors:Array<GraphicElement>}>}*/
        let errorBends = this.getCrossBendsByDocument(res[0].document);
        for(let el of errorBends){
            res[0].document.removeElement(el.base);
            for(let part of el.parts){
                res[0].document.addElement(part);
            }
            for(let error of el.errors){
                error._renderer.error=true;
            }

        }
        return res[0];
    }

    _createRemoveSolution(){
        let preview = this.document.getSnapshot();

        /** @type {Array<{base:GraphicElement, parts:Array<GraphicElement>, errors:Array<GraphicElement>}>}*/
        let errorBends = this.getCrossBendsByDocument(this.document);
        let add = [];
        let remove = [];
        for(let el of errorBends){
            remove.push(el.base);
            m: for(let part of el.parts){
                for(let er of el.errors){
                    if(er.compare(part)){
                        continue m;
                    }
                }
                add.push(part);
            }
        }

        /** @type {Array<{base:GraphicElement, parts:Array<GraphicElement>, errors:Array<GraphicElement>}>}*/
        let errorBendsPreview = this.getCrossBendsByDocument(preview);
        for(let el of errorBendsPreview){
            preview.removeElement(el.base);
            for(let part of el.parts){
                preview.addElement(part);
            }
            for(let error of el.errors){
                preview.removeElement(error);
            }
        }

        return new Replace(this.document,remove,preview,add);
    }

    /**
     *
     * @param doc
     * @return {Array<{base:GraphicElement, parts:Array<GraphicElement>, errors:Array<GraphicElement>}>|null}
     */
    getCrossBendsByDocument(doc){
        /** @type {Array.<LineElement>} - because bend can be only by line*/
        let bends = doc.getListSimpleElements().filter(el=>el.lineType instanceof Bend);
        let elements = doc.getListSimpleElements().filter(el=>!(el.lineType instanceof Bend));

        let shapes = new ShapeBuilder(doc).buildShapes();

        let errors = [];
        for(let i=0; i<bends.length; i++){
            let points = Intersect.getIntersectPointsWithElements(bends[i], elements);
            if(points.length>0){
                let bendParts = bends[i].intersectByPoints(points);
                let error = {base:bends[i], parts:bendParts, errors:[]}
                m: for(let part of bendParts) {
                    for (let shape of shapes) {
                        if(shape.isContain(part.getCenter())){
                            continue m;
                        }
                    }
                    error.errors.push(part);
                }
                if(error.errors.length>0){
                    errors.push(error);
                }
            }
        }
        if(errors.length>0){
            return errors;
        }else {
            return null;
        }
    }

}
