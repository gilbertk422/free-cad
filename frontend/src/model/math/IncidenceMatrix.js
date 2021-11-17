/**
 * Created by dev on 27.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Matrix from './Matrix';

/**
 * Incidence matrix - is math view of a graph.
 * The class need for executing operation with incidence matrix.
 */
export default class IncidenceMatrix extends Matrix{

    /**
     * @param {Array.<Array.<number>>} array
     */
    constructor(array){
        super(array);
    }

    /**
     * this method works for unweighted graphs
     * todo: maybe need to move this method to a Graph class
     * @param {number} startIndex
     * @param {number} endIndex
     * @return {number[]}
     */
    findShortestPath(startIndex, endIndex){
        let queue = [{index:startIndex,path:[]}];
        let search = endIndex;

        let doneIndex = [];

        let pathLenght =0;
        while(true){
            if(pathLenght>=1000000){
                throw new Exception('To long path');
            }
            pathLenght++;
            if (queue.length == 0) {
                return true;
            }
            let current = queue.shift();
            doneIndex.push(current.index);
            m: for (let i = 0; i < this.array[current.index].length; i++) {
                if (this.array[current.index][i] != 0) {
                    if (current.path.length > 0 && current.path[0] == i) {
                        continue m;
                    }
                    for(let done of doneIndex){
                        if(done==i){
                            continue m;
                        }
                    }

                    let newElement = {index: i, path: [...current.path, current.index]};
                    if (i == search) {
                        return newElement.path;
                    } else {
                        queue.push(newElement);
                    }
                }
            }
        }
    }




    /**
     * @see https://en.wikipedia.org/wiki/Component_(graph_theory)
     * @return {Array.<Array<number>>} - the list of connecting components
     */
    getConnectedComponents(){
        let listOfVertex = new Array(this.array.length);
        for(let i=0; i<this.array.length; i++){
            listOfVertex[i]=false;
        }

        let falseIndex = 0;

        let res = [];
        do{
            res.push(this.buildComponent(listOfVertex, falseIndex));
            falseIndex = this.getFalseIndex(listOfVertex);
        }while (falseIndex!=-1);

        return res;
    }

    getFalseIndex(array){
        for(let i=0; i<array.length; i++){
            if(array[i]==false){
                return i;
            }
        }
        return -1;
    }


    buildComponent(visitedVertex, currentVertexIndex){
        let res = [];
        visitedVertex[currentVertexIndex]=true;
        for(let i=0; i<this.array.length; i++){
            if(this.array[currentVertexIndex][i] && !visitedVertex[i]){
                res.push(...this.buildComponent(visitedVertex, i));
            }
        }
        res.push(currentVertexIndex);
        return res;

    }


    elementToString(i,j){
        if(!this.array[i][j]){
            return "0";
        }else{
            if(this.array[i][j]===true){
                return "1";
            }else{
                return this.array[i][j];
            }
        }
    }

    toString(){
        let temp = "";
        for(let i=0; i<this.array.length; i++){
            for(let j=0; j<this.array[i].length; j++){
                temp +=this.elementToString(i, j)+" ";
            }
            temp+='\n';
        }
        return temp;
    }
}