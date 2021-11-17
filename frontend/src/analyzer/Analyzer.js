/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Rule from './Rule';

/**
 * The class is Facade for analyzing the document, and propose options for a solution to problems.
 *
 * The Analyzer running the {@class Rule}`s by queue
 *
 * @abstract
 */
export default class Analyzer{

    /**
     * @param {Document} document
     */
    constructor(document){

        /** @type {Document} */
        this.document = document;

        /** @type {Array.<Rule>} */
        this.rules = [];

        this.recheck = false;

        /** @type {ProgressBar} */
        this.progresBar = container.resolve("progressBar");
    }

    /**
     * @async
     * @return {Promise.<boolean>}
     */
    analyze(){
        return new Promise((resolve, reject)=>{
            if(this.document._elements.length==0){
                resolve(false);
            }
            if(this.rules.length>0){
                this.progresBar.show("Analyzing...");
                    this.checkRule(0).then((res) => {
                        if(!res && this.recheck){
                            this.recheck=false;
                            return this.analyze().then(resolve).catch(reject);
                        }else {
                            this.progresBar.hide();
                            setTimeout(()=>{
                                resolve(res);
                            },20); //for browser renderer
                        }
                    }).catch(error => {
                        reject(error);
                    });
            }else{
                reject(new Exception(`The analyzer doesn't have any rules!`, this));
            }
        });
    }

    /**
     * @async
     * @param {number} index - the index of rule
     * @return {Promise}
     */
    checkRule(index){
        this.progresBar.setValue((index*100)/(this.rules.length-1));
        return new Promise((resolve, reject)=>{
            let hasError = this.rules[index].check();
            if(hasError){
                if(ENV=='test'){
                    resolve(false);
                }
                let solutions = this.rules[index].createSolutions();
                let board = container.resolve('mainBoard');
                let currentSolution = solutions[0];
                if(currentSolution) {
                    board.document = currentSolution.getPreviewDocument();
                    board.render();
                }
                container.resolve('expertNotice',[
                    this.rules[index].errorMessage,
                    solutions.map(solution=>{
                        return {
                            text:solution.name,
                            callback:()=>{
                                board.document = solution.getPreviewDocument();
                                board.render();
                                currentSolution = solution;
                            }
                        }
                    }),
                    ()=>{
                        board.document = this.document;
                        if(!currentSolution || currentSolution==solutions[0]){
                            resolve(false);
                        }else {
                            currentSolution.execute().then((resExecute)=>{
                                if(resExecute) {
                                    if(board.tool['clearSelectElements']!=undefined){
                                        board.tool.clearSelectElements();
                                    }
                                    setTimeout(()=>{
                                        this.recheck=true;
                                        resolve(false);
                                    },500);
                                }else{
                                    //todo: show some system error
                                }
                            }).catch(reject);
                        }
                    },
                    ()=>{
                        board.document = this.document;
                        resolve(false);
                    }
                    ]).show();
            }else{
                if(index==this.rules.length-1) {
                    resolve(true);
                }else{
                    setTimeout(()=>{
                        this.checkRule(index+1).then(resolve).catch(reject);
                    },0); //for browser renderer
                }
            }
        });
    }
    
}