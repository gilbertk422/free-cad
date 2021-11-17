import Behavior from '../Behavior'

export default class DivideDataValidator extends Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {DivideElements} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command){
        return new Promise((resolve, reject)=>{
            if(command.elements.length>1){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please select only one line to perform this command.");
                resolve(false)
            }else{
                resolve(true);
            }
        });
    }

}