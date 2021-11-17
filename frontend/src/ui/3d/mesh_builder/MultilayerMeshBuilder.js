/**
 * Created by Panasenco Yurii on 21.07.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import * as THREE from 'three';
var ThreeBSP = require('three-js-csg')(THREE);

import Shape from './../../../model/elements/Shape';
import ShapeNode from "../../../model/elements/shape/ShapeNode";
import ShapeTree from '../../../model/elements/shape/ShapeTree'
import ShapeGeometryBuilder from "../ShapeGeometryBuilder";



class ShapeCalculatorNode extends ShapeNode{
    constructor(shape){
        super(shape);
        /** @type {ProgressBar} */
        this.progressBar = container.resolve("progressBar");
    }

    buildGeometry(mainGeometry=null, minProgress=null, maxProgress=null){
        return new Promise((resolve)=>{
            setTimeout(()=> {
                let height = this.shape.height;

                let tempGeometry = ShapeGeometryBuilder.getGeometry(this.shape.getConsistentlyPoints(), Math.abs(height));
                tempGeometry.translate(0, 0, this.shape.baseZ);
                if (mainGeometry == null) {
                    mainGeometry = tempGeometry;
                } else {
                    if (height > 0) {
                        mainGeometry = new ThreeBSP(mainGeometry).union(new ThreeBSP(tempGeometry)).toGeometry();
                    } else {
                        mainGeometry = new ThreeBSP(mainGeometry).subtract(new ThreeBSP(tempGeometry)).toGeometry();
                    }
                }
                if(maxProgress) {
                    this.progressBar.setValue(minProgress + (maxProgress - minProgress) / 10);
                }
                if(this.children.length>0) {
                    this.buildChildGeometry(this.children, 0, mainGeometry, minProgress, maxProgress).then((mainGeometryRes) => {
                        resolve(mainGeometryRes);
                    });
                }else{
                    resolve(mainGeometry);
                }
            }, 20);
        });
    }

    buildChildGeometry(children, i, mainGeometry, minProgress, maxProgress){
        return new Promise(resolve=>{
            setTimeout(()=>{
                children[i].buildGeometry(mainGeometry).then(mainGeometryRes=>{
                    if(i==children.length-1){
                        resolve(mainGeometryRes);
                    }else{
                        if(maxProgress) {
                            this.progressBar.setValue(minProgress + ((maxProgress - minProgress-(maxProgress - minProgress) / 10)*(i+1))/children.length);
                        }
                        this.buildChildGeometry(children, i+1, mainGeometryRes, minProgress, maxProgress).then(resolve);
                    }
                });
            },10);
        });
    }
}

class ShapeCalculatorTree extends ShapeTree{

    createNode (shape) {
        return new ShapeCalculatorNode(shape);
    }

    buildGeometry(minProgress, maxProgress){
        return this.root.buildGeometry(null, minProgress, maxProgress);
    }
}



export default class MultilayerMeshBuilder{

    /**
     * @param {Array.<Shape>}shapes
     * @param material
     */
    constructor(shapes, material, showLoader){
        /** @type {Array.<ShapeCalculatorTree>} */
        this.shapeTrees = ShapeTree.buildTrees(shapes, ShapeCalculatorTree);

        this.material = material;

        this.showLoader=showLoader;
        this.progressBar = container.resolve("progressBar");
    }

    calculateShapesBaseLine(){
        for (let tree of this.shapeTrees){
            tree.calculate();
        }
    }

    buildTreeMesh(i, res){
        return new Promise(resolve=>{
            let maxProgress = 30+(60*(i+1))/this.shapeTrees.length;
            let minProgress = 30+(60*i)/this.shapeTrees.length;
            this.shapeTrees[i].buildGeometry(minProgress, maxProgress).then(geometry=>{
                this.progressBar.setValue(maxProgress);
                setTimeout(()=>{
                    res.push(new THREE.Mesh(new ThreeBSP(geometry).toGeometry(), this.material));
                    if(i==this.shapeTrees.length-1){
                        resolve(res);
                    }else{
                        this.buildTreeMesh(i+1,res).then(resolve);
                    }
                },0);
            });
        });
    }


    build(){
        this.calculateShapesBaseLine();
        this.progressBar.setValue(30);
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(this.shapeTrees.length>0) {
                    this.buildTreeMesh(0, []).then(resolve);
                }else{
                    resolve([]);
                }
            },0); // for browser render
        });
    }
}