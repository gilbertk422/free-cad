/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import NearEdge from "./NearEdge";

export default class Chamfer extends NearEdge{

    constructor(){
        super();

        /** @type {number} */
        this.size=0.508;

        /** @type {number} */
        this.angle=45;
    }

    /**
     * @return {Chamfer}
     */
    copy(){
        let res = new Chamfer();
        res.size=this.size;
        res.angle=this.angle;
        return res;
    }

}