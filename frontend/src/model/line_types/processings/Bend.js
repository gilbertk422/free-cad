/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Processing from './../Processing';

export default class Bend extends Processing{

    constructor(){
        super();

        this.angle = 90;
        this.radius = 0.79;
    }

    copy(){
        let res = new Bend();
        res.angle=this.angle;
        res.radius=this.radius;
        return res;
    }
}