/**
 * Created by Panasenco Yurii on 21.07.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import * as THREE from 'three';
var ThreeBSP = require('three-js-csg')(THREE);

import ShapeBuilder from "../../../analyzer/ShapeBuilder";
import Shape from './../../../model/elements/Shape';
import MultilayerMeshBuilder from "./MultilayerMeshBuilder";
import BendMeshBuilder from "./BendMeshBuilder";

export default class MeshBuilder{

    constructor(material){
        this.material=material;
        /** @type {ProgressBar} */
        this.progressBar = container.resolve("progressBar");
    }

    /**
     * @param {Document} document
     */
    getMeshes(document){
        this.progressBar.show("Rendering 3D view...");
        let shapeBuilder = new ShapeBuilder(document);
        let shapes = shapeBuilder.buildShapes(false);
        let res = null;
        if(this._areShapesHasBand(shapes)) {
            res = this._generateMeshWithBend(shapes);
        }else {
            res = this._generateMeshWithoutBend(shapes)
        }
        return new Promise(resolve=> {
            res.then((res) => {
                this.progressBar.hide();
                resolve(res);
            });
        });
    }

    /**
     * @param {Array<Shape>} shapes
     * @return {Promise<Mesh|null>}
     * @private
     */
    _generateMeshWithBend(shapes){
        this.progressBar.setValue(5);
        let builder = new BendMeshBuilder(shapes, this.material);

        return new Promise((resolve, reject)=>{
            builder.build().then(meshes=>{
                resolve(meshes);
                // this._groupMeshes(meshes).then(resolve);
            });
        });
    }

    /**
     * @param {Array<Shape>} shapes
     * @return {Promise<Mesh|null>}
     * @private
     */
    _generateMeshWithoutBend(shapes){
        this.progressBar.setValue(10);
        let builder = new MultilayerMeshBuilder(shapes, this.material, true);
        this.progressBar.setValue(20);

        return new Promise((resolve, reject)=>{
            builder.build().then(meshes=>{
                resolve(meshes);
                // this._groupMeshes(meshes).then(resolve);
            });
        });
    }

    /**
     * @param {Array} addMeshList
     * @return {Promise.<Mesh|null>}
     * @private
     */
    _groupMeshes(addMeshList){
        return new Promise((resolve, reject)=>{
            console.log("_groupMeshes")
            if(addMeshList.length>1) {
                let res = new ThreeBSP(addMeshList[0]);
                let index =0;
                let interval = setInterval(()=>{
                    console.log("_groupMeshes int")
                    if(index==addMeshList.length){
                        resolve(new THREE.Mesh(res.toGeometry(),this.material));
                        clearInterval(interval);
                        return;
                    }
                    res =res.union(new ThreeBSP(addMeshList[index++]));
                },20);
            }else{
                if(addMeshList.length==1) {
                    resolve(addMeshList[0]);
                }else {
                    resolve(null); //todo: throw some Exception
                }
            }
        });
    }

    /**
     * @param {Array<Shape>} shapes
     * @return {boolean}
     * @private
     */
    _areShapesHasBand(shapes){
        for(let shape of shapes){
            if(shape.bends.length>0){
                return true;
            }
        }
        return false;
    }
}