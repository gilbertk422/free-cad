/**
 * Created by dev on 04.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Exception from './../Exception';
// import Document from '../../model/Document';


/**
 * Command is an abstract class. The class need for document modification.
 * If you need to modify a current document, you need use one of command instance or create new implementation a command.
 *
 * Command need for making snapshot current document and delegate modification to document object.
 */
export default class Command{
    constructor(document){
        // if(!document instanceof Document){
        //     throw new Exception("Document is required parameter");
        // }

        this.id=container.resolve('commandIdGenerator').generateId();
        /** @var {Document} */
        this._document = document;

        this._snapshotBefore = null;
        this._snapshotAfter = null;

        /** @type {boolean} - if the variable equals false the command will not save in the command history.*/
        this.needSave = true;

        /** @type {Array.<Behavior>} */
        this.behaviors=[];

        this.name= 'Command';
    }

    /**
     * @return {Document}
     */
    get document(){
        return this._document;
    }


    /**
     * The method create snapshot on current document and execute command.
     *
     * @return {boolean} true if the command was correct execute
     */
    execute(){
        return new Promise((resolve, reject)=>{
            this.executeBehaviors().then((response)=>{
                if(response) {
                    if(this.needSave) {
                        this._snapshotBefore = this._document.getSnapshot();
                    }
                    let res = this.executeCommand();
                    if(this.needSave) {
                        this._snapshotAfter = this._document.getSnapshot();
                    }
                    resolve(res);
                }else{
                    resolve(false);
                }
            }).catch((error)=>{
                reject(error);
            });
        });
    }

    /**
     * The method should be extensions in children classes
     * @return {boolean} true if the command must be save in commandHistory
     * @protected
     */
    executeCommand(){
        throw new Exception('The method dosn\'t have implementation');
    }

    /**
     * The method need for revert current command from snapshot
     */
    undo(){
        this._document.load(this._snapshotBefore);
    }

    redo(){
        this._document.load(this._snapshotAfter);
    }

    compare(command){
        return this.id==command.id;
    }

    /**
     * The method need use with @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     */
    getElements(){
        if(this.isReplacedElements()){
            return this.getReplaceElements();
        }else{
            return null;
        }
    }


    /**
     * The method need for operation witch replacing or adding any elements.
     * For example command copy, the command creates new element so the method will return true.
     * @return {boolean} - return true if the command replacing or adding any elements
     */
    isReplacedElements(){
        return false;
    }
    
    /**
     * The realisation of the  @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     * @protected
     */
    getReplaceElements(){
        throw new Exception('The method dosn\'t have implementation');
    }


    /**
     * the method is executing all behaviors
     * @private
     * @return {Promise}
     */
    executeBehaviors(){
        if(this.behaviors.length>0) {
            return this.executeBehavior(0);
        }else{
            return new Promise((resolve, reject)=>{ resolve(true)});
        }
    }
    
    executeBehavior(index){
        return new Promise((resolve, reject)=>{
            this.behaviors[index].execute(this).then((res)=>{
                if(index==this.behaviors.length-1) {
                    resolve(res);
                }else{
                    if(res) {
                        this.executeBehavior(index + 1).then((resNext) => {
                            resolve(resNext && res);
                        }).catch(error => {
                            reject(error);
                        });
                    }else{
                        resolve(res);
                    }
                }
            }).catch((error)=>{
                reject(error);
            })
        });
    }
}