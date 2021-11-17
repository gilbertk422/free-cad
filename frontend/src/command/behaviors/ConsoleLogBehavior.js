/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';

/**
 * The mock behavior
 */
export default class ConsoleLogBehavior extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {ResizeElementsCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            console.log("sdfsdf console. log");
            resolve(false);
        });
    }
}