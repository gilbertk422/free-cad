/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Text from '../../model/elements/Text';
import LineElement from "../../model/elements/LineElement";
import Bend from "../../model/line_types/Bend";
import CommentToSelf from "../../model/line_types/CommentToSelf";
import CommentToMachine from "../../model/line_types/CommentToMachine";
import Arc from "../../model/elements/Arc";

export default class ChangeLineTypeDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {ChangeLineTypeCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(this.isHasNotLineElements(command) && command.lineType instanceof Bend){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Use only straight lines for bend.");
                resolve(false);
            }else if(command.lineType.name=='Thread' && !this.isHasOnlyCircles(command)) {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please select a circle.");
                resolve(false);
            }else{
                resolve(true);
            }
        });
    }


    /**
     * @param {ChangeLineTypeCommand} command
     * @return {boolean}
     * @private
     */
    isHasNotLineElements(command){
        let elements = command.elements;
        for(let el of elements) {
            if (!(el instanceof LineElement)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {ChangeLineTypeCommand} command
     * @return {boolean}
     * @private
     */
    isHashText(command){
        let elements = command.elements;
        for(let el of elements) {
            if (el instanceof Text) {
                return true;
            }
        }
        return false;
    }

    isHasOnlyCircles(command){
        let elements = command.elements;
        for(let el of elements) {
            if (!(el instanceof Arc) || el.incrementAngle!=360) {
                return false;
            }
        }
        return true;
    }

}