/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Arc from '../../model/elements/Arc';
import Text from '../../model/elements/Text';

export default class ResizeDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {ResizeElementsCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(this.isHasAnText(command)){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Stretching text " +
                    "is not currently supported. Use the font size property field, please.");
                resolve(false);
            }else if(this.isHasAnArc(command) && command._isCentralControlPoint()){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Arcs cannot be " +
                    "stretched currently. Please use splines.");
                resolve(false);
            }else if(this.isHasThreads(command)){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("A circle associated" +
                    " with a thread can only be changed via the thread drop list.");
                resolve(false);
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
    isHasThreads(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el.lineType.name=="Thread") {
                return true;
            }
        }
        return false;
    }


    /**
     * @param {ResizeElementsCommand} command
     * @return {boolean}
     * @private
     */
    isHasAnText(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el instanceof Text) {
                return true;
            }
        }
        return false;
    }



    /**
     * @param {ResizeElementsCommand} command
     * @return {boolean}
     * @private
     */
    isHasAnArc(command){
        let elements = Document.toSimpleListElements(command.elements);
        for(let el of elements) {
            if (el instanceof Arc && el.incrementAngle!=360) {
                return true;
            }
        }
        return false;
    }
}