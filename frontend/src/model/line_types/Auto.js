/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ProcessingLineType from './ProcessingLineType';

/**
 * The class can contain this processing:
 * 1. Bend
 * 2. NearEdge of childes classes
 * 3. Groove
 * 4. FarEdge
 */
export default class Auto extends ProcessingLineType{
    constructor(){
        super();
        this.id=41;

        this.sideWallAgle = 90;

        this.stockMaterialWall = false;

        this.helpURL="https://www.emachineshop.com/help-3d-drawing/#3D-machine-settings";

    }

    /**
     * @inheritDoc
     * @return {Auto}
     */
    copy(){
        let res = new Auto();
        res.sideWallAgle=this.sideWallAgle;
        res.stockMaterialWall=this.stockMaterialWall;
        for(let processing of this.processing){
            res.addProcessing(processing.copy());
        }
        return res;
    }
}