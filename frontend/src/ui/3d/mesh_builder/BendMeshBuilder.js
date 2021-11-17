/**
 * Created by Panasenco Yurii on 21.07.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import * as THREE from 'three';
var ThreeBSP = require('three-js-csg')(THREE);

import Shape from './../../../model/elements/Shape';
import GraphicElement from "../../../model/GraphicElement";
import MultilayerMeshBuilder from "./MultilayerMeshBuilder";
import ShapeGeometryBuilder from "../ShapeGeometryBuilder";
import Group from "../../../model/elements/Group";
import LineElement from "../../../model/elements/LineElement";
import Arc from "../../../model/elements/Arc";
import RectElement from "../../../model/elements/RectElement";
import Document from "../../../model/Document";
import Utils from "./bend/Utils";
import BendArea from "./bend/BendArea";
import Intersect from "../../../model/math/algorithms/intersects/Intersect";

let Trigonometric = container.resolve('math').Trigonometric;

//todo: need separate Shape & Shape with bends
class ShapeNode extends Shape{
    constructor(material, insideShapes){
        super();

        /** @type {Array<{bendElement:LineElement,node:ShapeNode, bendArea:BendArea}>} */
        this.children = [];

        this._priority = 0;

        /** @type {THREE.Geometry} */
        this._baseGeometry=null;

        this.material = material;

        /** @type {Array<Shape>} */
        this.insideShapes = insideShapes;
    }

    addElement(element) {
        if(element.lineType.name=='Bend'){
            this._priority++;
            return super.addElement(element) && super.addBend(element);
        }else {
            return super.addElement(element);
        }
    }

    get priority(){
        return this._priority;
    }

    /**
     * @return {Point}
     */
    get center(){
        let group = new Group();
        for(let el of this.elements){
            group.addElement(el);
        }
        return group.getCenter();
    }

    getCentroidVector(bend){
        let shapeCenter = null;
        let points = this.getConsistentlyPoints();

        for(let i=0; i<points.length; i++){
            if(points[i].compare(bend.p1)){
                let point = points[i+1];
                if(i+1==points.length){
                    point = points[0];
                }

                if(point.compare(bend.p2)){
                    point = points[i-1];
                    if(i-1==-1){
                        point = points[points.length-1];
                    }
                }

                let triangle = new (container.resolve('math').Triangle)(bend.p1, bend.p2, point);
                shapeCenter=triangle.getCenter();

                break;
            }
        }
        return shapeCenter;
    }

    get baseGeometry(){
        if(this._baseGeometry==null){
            let points = super.getConsistentlyPoints();
            let height = super.height;
            this._baseGeometry = ShapeGeometryBuilder.getGeometry(points, height);
        }
        return this._baseGeometry;
    }

    getGeometries(){
        return new Promise((resolve => {
            this._addChildGeometry(0,[this.baseGeometry]).then(geometry=>{
                resolve(geometry);
            });
        }));
    }

    /**
     * @param {ShapeNode}node
     */
    addChildren(node){
        for(let currentBend of this.bends){
            for(let nodeBend of node.bends){
                if(nodeBend.compare(currentBend)){
                    this.children.push({bendElement:currentBend, node:node, bendArea:null});
                    return true;
                }
            }
        }

        for(let child of this.children){
            if(child.node.addChildren(node)){
                return true;
            }
        }
        return false;
    }

    /**
     * @return {Promise}
     */
    generateBendsArea(){
        return new Promise((resolve)=>{
            if(this.children.length==0 || global.debug.disable3DBendAreas){
                resolve();
                return;
            }
            for(let i=0; i<this.children.length; i++){
                this._generateBendArea(i);
            }
            resolve();
        });
    }

    _generateBendArea(index){
        this.children[index].node.generateBendsArea();
        let height = this.height;
        let bend = this.children[index].bendElement;
        let shapeCenter = this.getCentroidVector(bend);

        let countOfParts = 2;

        for(let shape of this.insideShapes){
            let crossPoints = Intersect.getIntersectPointsWithElements(bend, shape.elements);
            if(crossPoints.length > 0){
                countOfParts=5;
                break;
            }
        }
        let ba = new BendArea(bend, height, shapeCenter, countOfParts);
        ba.generateBendArea();
        this.children[index].bendArea=ba;

        let lastBendAreaGeometry = ba.getSubtractBendArea();

        this._subtractGeometry(lastBendAreaGeometry);
        this.children[index].node._subtractGeometry(lastBendAreaGeometry);
    }

    /**
     * @param {Geometry} insideGeometry
     * @param {boolean} isContour - if true then will calculate without an optimizations
     * @return {Promise}
     */
    subtractInsideAreas(insideGeometry, isContour=false){
        return new Promise((resolve)=>{
            for(let shape of this.insideShapes){
                if(this.isContain(shape, true) || this.isCrossed(shape.elements) || !isContour){
                    this._subtractGeometry(insideGeometry);
                    break;
                }
            }

            this._subtractInsideGeometryInChild(0, insideGeometry, isContour).then(resolve);
        });
    }

    _subtractGeometry(geometry){
        this._baseGeometry = new ThreeBSP(this.baseGeometry).subtract(new ThreeBSP(geometry)).toGeometry();
    }

    _subtractInsideGeometryInChild(index, insideGeometry, isContour){
        return new Promise(resolve=>{
            if(index == this.children.length){
                resolve();
                return;
            }
            if(this.children[index].bendArea) {
                if(isContour){
                    this.children[index].bendArea.subtractGeometry(insideGeometry);
                }else {
                    for (let shape of this.insideShapes) {
                        if (this.children[index].bendArea.isCross(shape)) {
                            this.children[index].bendArea.subtractGeometry(insideGeometry);
                            break;
                        }
                    }
                }
            }
            this.children[index].node.subtractInsideAreas(insideGeometry, isContour).then(()=>{
                this._subtractInsideGeometryInChild(index+1, insideGeometry, isContour).then(resolve);
            });
        });
    }


    rollUp(){
        if(!global.debug.disableRollUp) {
            for (let child of this.children) {
                child.node.rollUp();
            }
            for (let child of this.children) {
                let shapeCenter = this.getCentroidVector(child.bendElement);
                child.node.rotate(child.bendElement, shapeCenter);
            }
        }
    }

    /**
     * @param {LineElement} bendLine
     */
    rotate(bendLine, shapeCenter){
        for(let child of this.children){
            child.node.rotate(bendLine, shapeCenter);
        }

        let center = bendLine.getCenter();
        let bendAngle = bendLine.angle;

        let rotateCoefficient = Utils.getVectorCoefficient(bendLine, shapeCenter);


        this.baseGeometry.translate(-center.x, -center.y, 0);
        this.baseGeometry.rotateZ(-Trigonometric.gradToRad(bendAngle+rotateCoefficient));
        this.baseGeometry.rotateX(-Trigonometric.gradToRad(-bendLine.lineType.processing[0].angle));

        let angle = bendLine.lineType.processing[0].angle;
        let vector = null;
        if(angle>0){
            let height = this.height;
            let b = height * Math.sin(Trigonometric.gradToRad(angle));
            let betta = Trigonometric.gradToRad((180-angle)/2);
            let h = b*(1/Math.tan(betta));
            vector = new (container.resolve('math')).Vector(0,b,h);
            this.baseGeometry.translate(vector.x, vector.y, vector.z);

        }

        for(let child of this.children){
            if(!child.bendArea){
                continue;
            }
            child.bendArea.rotate(bendLine, vector, rotateCoefficient);
        }


        this.baseGeometry.rotateZ(Trigonometric.gradToRad(bendAngle+rotateCoefficient));
        this.baseGeometry.translate(center.x, center.y, 0);

    }

    /**
     * @return {Promise.<THREE.Mesh>}
     */
    getMesh(){

        return new Promise((resolve)=>{
            this.getGeometries().then(geometries=>{
                let res = [];
                for(let geometry of geometries){
                    res.push(new THREE.Mesh(new ThreeBSP(geometry).toGeometry(), this.material));
                }
                resolve(res);
            });
        });
    }


    _addChildGeometry(childIndex, geometry){
        return new Promise((resolve)=>{
            if(childIndex == this.children.length){
                resolve(geometry);
            }else{
                this.children[childIndex].node.getGeometries().then(childGeometry=>{
                    geometry.push(...childGeometry);
                    if(this.children[childIndex].bendArea) {
                        geometry.push(...this.children[childIndex].bendArea.geometries);
                    }
                    this._addChildGeometry(childIndex+1,geometry).then(resolve);
                });
            }
        });
    }

}

class ShapeTree{

    constructor(){
        this.root = null;
    }

    addNode(node){
        if(this.root){
            return this.root.addChildren(node);
        }else{
            this.root=node;
            return true;
        }
    }

    /**
     * @return {Promise}
     */
    generateBendsArea(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                this.root.generateBendsArea().then(resolve);
            }, 0); //for browser render
        });
    }

    /**
     * @param {THREE.Geometry} insideGeometry
     * @param {boolean} isContour - if true then will calculate without an optimizations
     * @return {Promise}
     */
    subtractInsideAreas(insideGeometry, isContour=false){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                if(insideGeometry) {
                    this.root.subtractInsideAreas(insideGeometry, isContour).then(resolve);
                }else{
                    resolve();
                }
            }, 0); //for browser render
        });
    }


    rollUp(){
        this.root.rollUp();
    }

    /**
     * @return {Promise.<THREE.Mesh>}
     */
    getMesh(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                this.root.getMesh().then(resolve);
            }, 0); //for browser render
        });
    }

}

export default class BendMeshBuilder{

    /**
     * @param {Array<Shape>}shapes
     * @param material
     */
    constructor(shapes, material){

        this.simpleShapes = [];

        /** @type {Array<Shape>} */
        this.shapeWithBends = [];

        this.insideShapes = [];

        for(let shape of shapes){
            if(shape.height==GraphicElement.AirInside){
                this.insideShapes.push(shape);
            }else{
                if(shape.bends.length>0){
                    this.shapeWithBends.push(shape);
                }else {
                    this.simpleShapes.push(shape);
                }
            }
        }

        this.material = material;

        this.progressBar = container.resolve("progressBar");
    }

    build(){
        let simpleElements = [...this.simpleShapes, ...this.insideShapes];
        let simpleShapeBuilder = new MultilayerMeshBuilder(simpleElements, this.material);


        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(this.simpleShapes.length>0) {
                    simpleShapeBuilder.build().then(meshes => {
                        this.progressBar.setValue(20);
                        return this._buildBendMesh(meshes);
                    }).then(meshes => {
                        this.progressBar.setValue(60);
                        resolve(meshes);
                    });
                }else{
                    this._buildBendMesh([]).then(resolve);
                }
            }, 0); // for browser render
        });

    }

    _buildBendMesh(meshes){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let shapeTrees = [];
                for(let shape of this.shapeWithBends){
                    let shapeNodeList = this._buildShapeNodes(shape);
                    shapeTrees.push(this._buildShapeTree(shapeNodeList));
                }
                this.progressBar.setValue(25);
                this._buildInsideGeometry(0, null).then(insideGeometry=>{
                    this.progressBar.setValue(30);
                    this._calculateTree(shapeTrees, 0, [], insideGeometry).then(bendMeshes=>{
                        let res = [...meshes,...bendMeshes];
                        resolve(res);
                    });
                });
            },0); // for browser render
        });
    }

    _createContourGeometry(shape){
        let extr = Document.getExtrenumForElements(shape.elements);
        let w = extr.max.x-extr.min.x;
        let h = extr.max.y-extr.min.y;
        let rect = new RectElement(
            new (container.resolve('math')).Point(extr.min.x-w*20, extr.max.y+h*20),
            new (container.resolve('math')).Point(extr.max.x+w*20, extr.min.y-h*20)
        );
        let elements = rect.toElement().toSimpleElements();
        let shapeContour = new Shape();
        for(let element of elements){
            shapeContour.addElement(element);
        }


        let shapeGeometry = ShapeGeometryBuilder.getGeometry(shape.getConsistentlyPoints(), Math.abs(GraphicElement.AirInside));
        shapeGeometry.translate(0, 0, GraphicElement.AirInside/2);
        let geometry = ShapeGeometryBuilder.getGeometry(shapeContour.getConsistentlyPoints(),  Math.abs(GraphicElement.AirInside));
        geometry.translate(0, 0, GraphicElement.AirInside/2);
        return new ThreeBSP(geometry).subtract(new ThreeBSP(shapeGeometry)).toGeometry();
    }

    _buildInsideGeometry(index, res){
        return new Promise(resolve=>{
            setTimeout(()=>{
                if(this.insideShapes.length==0){
                    resolve(null);
                    return;
                }

                if(index == this.insideShapes.length){
                    resolve(res);
                    return;
                }

                let shape = this.insideShapes[index];

                let newGeometry = ShapeGeometryBuilder.getGeometry(shape.getConsistentlyPoints(), Math.abs(shape.height));

                if(shape.height==GraphicElement.AirInside){
                    newGeometry.translate(0,0,GraphicElement.AirInside/2)
                }

                if(res){
                    res = new ThreeBSP(res).union(new ThreeBSP(newGeometry)).toGeometry();
                }else{
                    res = newGeometry;
                }

                this._buildInsideGeometry(index+1, res).then(resolve);
            },0); // for browser render
        });
    }

    /**
     * @param {Array<ShapeTree>} treeList
     * @param {number} index
     * @param {Array<THREE.Mesh>} meshes
     * @param {THREE.Geometry} insideGeometry
     * @return {Promise<Array<THREE.Mesh>>}
     * @private
     */
    _calculateTree(treeList, index, meshes, insideGeometry){
        return new Promise((resolve,reject)=>{
            if(index==treeList.length){
                resolve(meshes);
                return;
            }

            treeList[index].generateBendsArea().then(()=>{
                this.progressBar.setValue(30+(90/treeList.length)*1/5);
                return treeList[index].subtractInsideAreas(insideGeometry);
            }).then(()=> {
                let contourGeometry = this._createContourGeometry(this.shapeWithBends[index]);
                return treeList[index].subtractInsideAreas(contourGeometry, true);
            }).then(()=>{
                this.progressBar.setValue(30+(90/treeList.length)*2/5);
                treeList[index].rollUp(60/treeList.length);
                this.progressBar.setValue(30+(90/treeList.length)*3/5);
                return treeList[index].getMesh()
            }).then((mesh)=>{
                if(mesh) {
                    meshes.push(...mesh);
                }
                this.progressBar.setValue(30+90/treeList.length);
                this._calculateTree(treeList, index+1, meshes, insideGeometry).then((newMeshes)=>{
                    resolve(newMeshes);
                });
            });
        });
    }


    /**
     *
     * @param {Array<ShapeNode>}shapeNodes
     * @return {ShapeTree}
     * @private
     */
    _buildShapeTree(shapeNodes){
        let sortedNodes = shapeNodes.sort((a,b)=>b.priority-a.priority);
        let shapeTree = new ShapeTree();
        do{
            let node = sortedNodes.shift();
            if(!shapeTree.addNode(node)){
                sortedNodes.push(node);
            }
        }while (sortedNodes.length>0);
        return shapeTree;
    }



    /**
     * @param {Shape} shape
     * @return {Array<ShapeNode>} - for current shape
     * @private
     */
    _buildShapeNodes(shape){
        let newElements = [];
        let bendPoints = this._getUniquePoints(shape.bends);

        for(let bend of shape.bends){
            newElements.push(bend.copy());
        }

        for(let el of shape.elements){
            let points = [];
            for(let point of bendPoints) {
                if(el.isNear(point, 1E-4)){
                    points.push(point);
                }
            }
            if(el instanceof Arc){
                points.push(...el.toPolyLines(20)[0].points); //todo: isn't good algorithm for fixing bug
            }
            newElements.push(...el.intersectByPoints(points));
        }
        let uniquePoints = this._getUniquePoints(newElements);

        let incidenceMatrix = this._buildIncidenceMatrix(uniquePoints, newElements);

        let pathList = this._getPathList(incidenceMatrix);

        let shapeNodes = [];

        for(let path of pathList){
            let shapeNode = new ShapeNode(this.material, this.insideShapes);
            for(let i=0; i<path.length-1; i++){
                let element = this._findElementByPoints(newElements,uniquePoints[path[i]],uniquePoints[path[i+1]]);
                shapeNode.addElement(element);
            }
            shapeNodes.push(shapeNode);
        }
        return shapeNodes;
    }

    /**
     * @param {Array<GraphicElement>}elements
     * @param {Point} p1
     * @param {Point} p2
     * @private
     */
    _findElementByPoints(elements, p1, p2){
        for(let element of elements){
            let points = element.extremePoints;
            if(points && points.length==2){
                if((points[0].compare(p1) && points[1].compare(p2)) || (points[0].compare(p2) && points[1].compare(p1))){
                    return element;
                }
            }else{
                console.warn('the element have unusual extreme points (1)', element, points)
            }
        }
    }

    _getPathList(incidenceMatrix){
        let res = [];
        let path = [];
        do{
            try {
                path = this._findPath(incidenceMatrix);
            }catch (e) {
                console.log(incidenceMatrix.toString());
            }
            for(let i=0; i<path.length-1; i++){
                if(incidenceMatrix.array[path[i]][path[i+1]]!=0) {
                    incidenceMatrix.array[path[i]][path[i + 1]]--;
                    incidenceMatrix.array[path[i + 1]][path[i]]--;
                }
            }
            if(path.length>0){
                res.push(path);
            }
        }while (path.length>0);
        return res;
    }

    /**
     * @param {IncidenceMatrix} incidenceMatrix
     * @return {Array<number>}
     * @private
     */
    _findPath(incidenceMatrix) {
        let endIndex = 0;
        let startIndex = 0;
        let mas = incidenceMatrix.array;
        m: for (let i = 0; i < mas.length; i++) {
            for (let j = 0; j < mas.length; j++) {
                if (mas[i][j] != 0 && mas[i][j] != 2) {
                    endIndex = i;
                    startIndex = j;
                    break m;
                }
            }
        }

        if(startIndex==endIndex){
            return [];
        }

        mas[endIndex][startIndex]--;
        mas[startIndex][endIndex]--;

        let path = [endIndex];

        let shapePath = incidenceMatrix.findShortestPath(startIndex, endIndex);
        if (shapePath && shapePath.length>1) {
            path.push(...shapePath, endIndex);
            return path;
        }else{
            return [];
        }
    }

    _buildIncidenceMatrix(uniquePoints, elements){
        let incidence = [];
        for(let i=0;
            i<uniquePoints.length; i++){
            incidence[i]=[];
            for(let j=0; j<uniquePoints.length; j++){
                incidence[i][j]=0;
            }
        }

        for(let element of elements) {
            let points = element.extremePoints;
            if(points && points.length==2){
                let i = this._getIndexOf(uniquePoints, points[0]);
                let j = this._getIndexOf(uniquePoints, points[1]);

                if(element.lineType.name =="Bend"){
                    incidence[i][j]=2;
                    incidence[j][i]=2;
                }else{
                    incidence[i][j]=1;
                    incidence[j][i]=1;
                }
            }else {
                console.warn("the element have unusual extreme points", element, points);
            }
        }

        return new (container.resolve('math')).IncidenceMatrix(incidence);
    }


    _getUniquePoints(elements){
        let points = [];
        for(let el of elements){
            m: for(let point of el.extremePoints){
                if(this._getIndexOf(points, point)!=null){
                    continue m;
                }
                points.push(point);
            }
        }
        return points;
    }

    _getIndexOf(points, searchPoint){
        for(let i=0; i<points.length; i++){
            if(points[i].compare(searchPoint)){
                return i;
            }
        }
        return null;
    }
}