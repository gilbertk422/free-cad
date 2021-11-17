/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Behavior from '../Behavior';
import Corner from '../Corner'


export default class CornerDialog extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {Corner} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            let modal = container.resolve('cornerWindow', [()=>{
                let data = modal.data;
                command.type=data.type;
                if(data.type==Corner.TYPE_CHAMFER) {
                    command.radius = data.distance;
                }else{
                    command.radius = data.radius;
                }
                resolve(true);
            }, ()=>{
                resolve(false);
            }]);
            modal.show();
        });
    }

}