/**
 * Created by dev on 20.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Arc from '../../model/elements/Arc';

export default class TangentsDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {TangentsArcsCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(!this.isHasTwoArc(command)){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Error: Please select at least two circles/arcs.");
                resolve(false)
            }else{
                resolve(true);
            }
        });
    }


    /**
     * @param {ResizeElementsCommand} command
     * @return {boolean}
     * @private
     */
    isHasTwoArc(command){
        let count = 0;
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el instanceof Arc) {
                count++;
            }
        }
        return count>1;
    }
}