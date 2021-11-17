/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Trigonometric from "./Trigonometric";

/**
 * The class is a mathematical abstraction of Matrices.
 * 
 * The class using for mathematical operations like as multiply, division, adding etc.
 */
export default class Matrix {
    
    /**
     * The method used to create the displacement transform matrix
     * @param {number} x - how much to shift by x
     * @param {number} y - how much to shift by x
     * @param {number} z - how much to shift by z
     * @return {Matrix}
     */
    static createMoveMatrix(x=0,y=0,z=0){
        return new Matrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[x,y,z,1]]);
    }

    /**
     * The method used to create the rotation transformation matrix
     * @param {number} grad -  -360...360
     * @param {string} axis -  axisX|axisY|axisZ - use Trigonometric constants
     * @return {Matrix}
     */
    static createRotateMatrix(grad, axis="axisZ"){
        grad = Trigonometric.gradToRad(grad);

        switch (axis) {
            case Trigonometric.axisX:
                return new Matrix([
                    [1,0,0],
                    [0,Math.cos(grad),-Math.sin(grad)],
                    [0,Math.sin(grad),Math.cos(grad),0],
                    [0,0,0,1]]);
            case Trigonometric.axisY:
                return new Matrix([
                    [Math.cos(grad),0,Math.sin(grad),0],
                    [0,1,0,0],
                    [-Math.sin(grad),0,Math.cos(grad),0],
                    [0,0,0,1]]);
            case Trigonometric.axisZ:
            default:
                return new Matrix([
                    [Math.cos(grad),-Math.sin(grad),0,0],
                    [Math.sin(grad),Math.cos(grad),0,0],
                    [0,0,1,0],
                    [0,0,0,1]]);

        }
    }

    /**
     * Method used to create resize matrix
     * @param {number} x - The x scale factor. More than zero - increase, less - decrease
     * @param {number} y - The y scale factor. More than zero - increase, less - decrease
     * @return {Matrix}
     */
    static createResizeMatrix(x,y){
        return new Matrix([[1+x,0,0,0],[0,1+y,0,0],[0,0,1,0],[0,0,0,1]])
    }

    /**
     * The method used to create the mirror matrix.
     * @param axis - the constant from {@class Trigonometric} class. [axisX|axisY]
     * @return {Matrix}
     */
    static createMirrorMatrix(axis){
        if(axis==Trigonometric.axisX){
            return new Matrix([[-1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
        }else{
            return new Matrix([[1,0,0,0],[0,-1,0,0],[0,0,1,0],[0,0,0,1]]);
        }
    }

    /**
     * @param {Array.<Array.<number>>} array
     */
    constructor(array) {
        /** @var {Array.<Array.<number>>} array */
        this._array = array;
    }

    /**
     * @return {Array.<Array.<number>>} - current matrix as {@class Array}
     */
    get array(){
        return this._array;
    }

    /**
     * @param {Matrix|number} addition
     * @returns {Matrix}
     */
    add(addition){
        let res = [];
        if(typeof addition == "object"){ //instanceof Matrix
            for(let i=0; i<this.array.length; i++){
                res[i]=[];
                for(let j=0; j<this.array[i].length; j++){
                    res[i][j]=this.array[i][j]+addition.array[i][j];
                }
            }
        }else{
            let res = [];
            for(let i=0; i<this.array.length; i++){
                res[i]=[];
                for(let j=0; j<this.array[i].length; j++){
                    res[i][j]=this.array[i][j]+addition;
                }
            }
        }
        return new Matrix(res);
    }


    /**
     * @param {Matrix|number} multiplier
     * @returns {Matrix}
     */
    multiply(multiplier) {
        if(typeof multiplier == "object"){ //instanceof Matrix
            return this._multiplyOnMatrix(multiplier);
        }else{
            let res = [];
            for(let i=0; i<this.array.length; i++){
                res[i]=[];
                for(let j=0; j<this.array[i].length; j++){
                    res[i][j]=this.array[i][j]*multiplier;
                }
            }
            return new Matrix(res);
        }
    }


    /**
     * Compare two matrix by elements
     * @param {Matrix} matrix
     * @return {boolean} - true if elements of the matrices are equals
     */
    compare(matrix){
        for(let i=0; i<this.array.length; i++){
            for(let j=0; j<this.array[i].length; j++){
                if(this.array[i][j]!=matrix.array[i][j]){
                    return false;
                }
            }
        }
        return true;
    }

    _multiplyOnMatrix(matrix){
        let A = this._array;
        let B = matrix._array;

        var rowsA = A.length, colsA = A[0].length,
            rowsB = B.length, colsB = B[0].length,
            C = [];
        if (colsA != rowsB)
            throw new Exception('colsA != rowsB');
        for (let i = 0; i < rowsA; i++)
            C[i] = [];
        for (let k = 0; k < colsB; k++) {
            for (let i = 0; i < rowsA; i++) {
                C[i][k] = 0;
                for (let j = 0; j < rowsB; j++) {
                    C[i][k] += A[i][j] * B[j][k];
                }
            }
        }
        return new Matrix(C);
    }

    transpose(){
        let array = [];
        for(let i=0; i<this.array.length; i++) {
            array.push(new Array(this.array[i].length));
        }

        for(let i=0; i<this.array.length; i++){
            for(let j=0; j<this.array[i].length; j++){
                if(i==j){
                    continue;
                }
                array[i][j]=this.array[j][i];
            }
        }
        return new Matrix(array);
    }
}