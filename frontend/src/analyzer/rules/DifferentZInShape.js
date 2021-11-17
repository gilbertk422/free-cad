/**
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ShapeBuilder from "../ShapeBuilder";
import Rule from "../Rule";
import SetZValue from "../solutions/SetZValue";


export default class DifferentZInShape extends Rule{

    constructor(document){
        super(document);

        this.errorMessage = `Error: The selected lines have multiple Z values. Please use one value.`;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();
        res[0].previewDocument = this.document.getSnapshot();
        let shape = this.getIncorrectZValueShape(res[0].previewDocument);

        for(let el of shape.elements){
            el._renderer.error=true;
        }

        let realShape = this.getIncorrectZValueShape(this.document);

        let Z=this.getDafaultZ(realShape.elements);

        let solution = new SetZValue(this.document, realShape.elements, Z);
        solution.previewDoc=res[0].previewDocument;

        res.push(solution);
        return res;
    }


    /**
     * @param {Array.<GraphicElement>} elements
     * @return number
     */
    getDafaultZ(elements){
        /** @type Array.<{value:number, count:number}> */
        let temp = [];

        m: for(let el of elements){
            let Z = el.height;
            for(let t of temp){
                if(t.value==Z){
                    t.count++;
                    continue m;
                }
            }
            temp.push({value:Z, count:1});
        }
        let imax = 0;
        for(let i=1; i<temp.length; i++){
            if(temp[i].count>temp[imax].count){
                imax=i;
            }
        }
        return temp[imax].value;
    }

    /**
     * @return {boolean} - true if the document has an error
     */
    check(){
        let shape = this.getIncorrectZValueShape(this.document);
        if(shape){
            return true;
        }
        return false;
    }


    getIncorrectZValueShape(doc){
        let shapeBuilder = new ShapeBuilder(doc);

        let shapes = shapeBuilder.buildShapes();

        for(let shape of shapes){
            let elements = shape.elements.filter(e=>e.lineType.name!="Bend");

            let h = elements[0].height;

            for(let el of elements){
                if(el.height!=h){
                    return shape;
                }
            }
        }
        return null;
    }

}

