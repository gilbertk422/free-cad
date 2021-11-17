/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import NearEdge from "./NearEdge";

export default class Round extends NearEdge{

    constructor(){
        super();

        /** @type {number} */
        this.radius=45;
    }

    /**
     * @return {Round}
     */
    copy(){
        let res = new Round();
        res.radius=this.radius;
        return res;
    }

}