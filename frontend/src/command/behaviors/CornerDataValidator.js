/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Behavior from '../Behavior';
import Document from '../../model/Document';
import LineElement from "../../model/elements/LineElement";
import ShapeBuilder from "../../analyzer/ShapeBuilder";

export default class CornerDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {Corner} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(!this.isOnlyLines(command)){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Filleting of unconnected lines is not permitted.");
                resolve(false)
            }else if(command.elements.length<2){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please first select two or more straight lines that meet.");
                resolve(false);
            }else if(this._hasDifferentLineType(command.elements)) {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Solution includes lines assigned to multiple machines and cannot be filleted");
                resolve(false);
            }else if(this.isHasTConnections(command.elements)) {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Filleting of line with three-way intersection (e.g. T) is not permitted.");
                resolve(false);
            }else {
                resolve(true);
            }
        });
    }

    /**
     * @param {Array<GraphicElement>} elements
     * @private
     */
    _hasDifferentLineType(elements){
        let lt = elements[0].lineType.name;
        for(let i=1; i<elements.length; i++){
            if(elements[i].lineType.name!=lt){
                return true;
            }
        }
        return false;
    }

    isHasTConnections(elements){
        let el = Document.toSimpleListElements(elements);

        /** @type Array[{point:Point, count:number}]*/
        let points = [];

        for(let e of el){
            let exrtPoints = e.extremePoints;
            if(!exrtPoints){
                continue;
            }
            m: for(let p of exrtPoints){
                for(let point of points){
                    if(point.point.compare(p)){
                        point.count++;
                        continue m;
                    }
                }

                points.push({point:p, count:1});
            }
        }

        for(let point of points){
            if(point.count>2){
                return true;
            }
        }

        return false;
    }

    /**
     * @param {Corner} command
     * @return {boolean}
     * @private
     */
    isOnlyLines(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (!(el instanceof LineElement)) {
                return false;
            }
        }
        return true;
    }

}