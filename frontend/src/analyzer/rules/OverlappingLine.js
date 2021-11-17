/**
 * Created by dev on 25.04.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './../Rule';

import LineElement from "../../model/elements/LineElement";
import Merge from "../solutions/Merge";
import Auto from "../../model/line_types/Auto";
import Bend from "../../model/line_types/Bend";
import ShapeBuilder from '../ShapeBuilder'
import ShapeTree from '../../model/elements/shape/ShapeTree'

export default class OverlappingLine extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);
        this.errorMessage = `Message: The highlighted lines are colinear and overlapping. Correct automatically?`;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();
        let overlap = this.getOverlappingLineByDocument(res[0].previewDocument);
        for(let el of overlap.elements){
            el._renderer.error = true;
        }
        res.push(this.createMergeSolution());
        return res;
    }


    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        return this.getOverlappingLineByDocument(this.document)!=null;
    }


    createMergeSolution(){
        let overlap = this.getOverlappingLineByDocument(this.document);
        let res = new Merge(this.document, overlap.elements, !overlap.canMarge);

        res.previewDocument = this.document.getSnapshot();
        let overlap1 = this.getOverlappingLineByDocument(res.previewDocument);
        for(let el of overlap1.elements){
            el._renderer.error = true;
        }
        return res;
    }


    /**
     *
     * @param {Document} document
     * @return {{elements:Array.<LineElement>, canMarge:boolean}|null}
     * @private
     */
    getOverlappingLineByDocument(document){
        let shapes = new ShapeBuilder(document).buildShapes();
        let trees = ShapeTree.buildTrees(shapes);
        for(let tree of trees){
            tree.calculate();
        }

        let getShapeByLine = (line)=>{
            for(let shape of shapes){
                if(shape.isHas(line)){
                    return shape;
                }
            }
            return null;
        };


        /** @type {Array<LineElement>} */
        let lines = document.getListSimpleElements().filter((el)=>(el instanceof LineElement) && (el.lineType instanceof Auto || el.lineType.name=="Bend"));

        for(let i=0; i<lines.length; i++){
            for(let j=0; j<lines.length; j++){
                if(i!=j && lines[i].isOverlapping(lines[j], 0)){
                    let shape1 = getShapeByLine(lines[i]);
                    let shape2 = getShapeByLine(lines[j]);
                    if(shape1 && shape2 && Helper.Math.equals(shape1.baseZ,shape2.baseZ, 1e-4)) {
                        return {
                            elements: [lines[i], lines[j]],
                            canMarge: lines[i].lineType.name == lines[j].lineType.name
                        };
                    }
                }
            }
        }

        return null;
    }
}
