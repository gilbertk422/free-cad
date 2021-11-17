/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import * as THREE from 'three';



export default class ShapeGeometryBuilder{


    /**
     * @return {THREE.Geometry}
     */
    static getGeometry(vertices, height){
        var shape = new THREE.Shape();
        shape.moveTo( vertices[0].x, vertices[0].y );
        for(let i=1; i<vertices.length; i++){
            shape.lineTo(vertices[i].x, vertices[i].y );
        }

        var extrudeSettings = {
            steps: 1,
            depth: height,
            bevelEnabled: false
        };

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        geometry.computeVertexNormals();
        return geometry;
    }

}