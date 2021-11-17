/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Behavior from '../Behavior';


export default class DivideDialog extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {DivideElements} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            let modal = container.resolve('divideWindow', [()=>{
                let data = modal.data;
                command.countParts=data.countParts;
                resolve(true);
            }, ()=>{
                resolve(false);
            }]);
            modal.show();
        });
    }

}