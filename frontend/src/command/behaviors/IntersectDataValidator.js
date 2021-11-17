/**
 * Created by dev on 17.07.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';

export default class IntersectDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {IntersectElementsCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(this.isHasThreads(command)){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("The Intersect tool " +
                    "cannot be used with a threaded hole.");
                resolve(false)
            }else{
                resolve(true);
            }
        });
    }

    /**
     * @param {IntersectElementsCommand} command
     * @return {boolean}
     * @private
     */
    isHasThreads(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el.lineType.name=="Thread") {
                return true;
            }
        }
        return false;
    }
}