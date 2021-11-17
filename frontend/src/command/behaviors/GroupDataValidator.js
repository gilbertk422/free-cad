/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Behavior from '../Behavior';
import Document from '../../model/Document';
import LineElement from "../../model/elements/LineElement";
import ShapeBuilder from "../../analyzer/ShapeBuilder";

export default class GroupDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {GroupCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(this._hasDifferentLineType(command.elements)) {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Multiple settings applied to one line are not permitted.");
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

}