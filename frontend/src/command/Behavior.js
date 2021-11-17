/**
 * Copyright (c) 2019 Micro Logic Corp.
 *
 * The interface is need for executing some operation before execute a command. For example ask user about anything.
 *
 * @interface
 */
export default class Behavior{

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {Command} command - the parameter need for edition the command state
     * @return {Promise}
     */
    execute(command){
        throw new Exception('The method doesn\'t have implementation');
    }

}