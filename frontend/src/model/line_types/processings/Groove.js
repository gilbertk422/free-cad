/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Processing from "../Processing";

export default class Groove extends Processing{

    constructor(){
        super();

        /** @type {number} */
        this.topDepth = 0;

        /** @type {number} */
        this.width = 0;

        /** @type {number} */
        this.horisontalDepth = 0;
    }

    /**
     * @return {Groove}
     */
    copy(){
        let res = new Groove();
        res.topDepth=this.topDepth;
        res.width=this.width;
        res.horisontalDepth=this.horisontalDepth;
        return res;
    }

}
