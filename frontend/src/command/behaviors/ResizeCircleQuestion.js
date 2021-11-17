/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Arc from '../../model/elements/Arc';

export default class ResizeCircleQuestion extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {ResizeElementsCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(this.isHasAnArc(command) && command._isCentralControlPoint()){
                container.resolve('confirmChangeArcToSplinesDialog').modalOpenConfirmation(
                    ()=>{
                        command.convertCircleToSplines = true;
                        resolve(true);
                    },()=>{
                        command.convertCircleToSplines = false;
                        resolve(false);
                    }
                );
            }else{
                command.convertCircleToSplines = false;
                resolve(true);
            }
        });
    }


    /**
     * @param {ResizeElementsCommand} command
     * @return {boolean}
     * @private
     */
    isHasAnArc(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el instanceof Arc) {
                return true;
            }
        }
        return false;
    }
}