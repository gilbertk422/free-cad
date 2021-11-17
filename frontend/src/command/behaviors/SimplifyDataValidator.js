/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Arc from '../../model/elements/Arc';
import Text from '../../model/elements/Text';

export default class SimplifyDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {Simplify} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(command.elements.length==0){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please select at least one line to perform this command.");
                resolve(false);
            }else{
                let modal = container.resolve('simplifyWindow', [()=>{
                    let data = modal.data;
                    command.errorThreshold=data.errorThreshold;
                    resolve(true);
                }, ()=>{
                    resolve(false);
                }]);
                modal.show();
            }
        });
    }
}