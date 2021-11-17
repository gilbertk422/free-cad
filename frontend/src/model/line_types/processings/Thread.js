/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Processing from "../Processing";

export default class Thread extends Processing{

    static TYPE_UN = "UN";
    static TYPE_M = "M";
    static TYPE_NTP = "NTP";
    static TYPE_UD = "User defined";

    static _threads = [
        {id:1 , type:"UN" ,size:'00-90',majorDiameter:0.047 ,drillDiameter:0.035 ,maxDepth:0.261},
        {id:2 , type:"UN" ,size:'80'   ,majorDiameter:0.06 ,drillDiameter:0.047 ,maxDepth:0.326},
        {id:3 , type:"UN" ,size:'1-64' ,majorDiameter:0.073 ,drillDiameter:0.059 ,maxDepth:0.391},
        {id:4 , type:"UN" ,size:'1-72' ,majorDiameter:0.073 ,drillDiameter:0.059 ,maxDepth:0.391},
        {id:5 , type:"UN" ,size:'2-56' ,majorDiameter:0.086 ,drillDiameter:0.07 ,maxDepth:0.456},
        {id:6 , type:"UN" ,size:'2-64' ,majorDiameter:0.086 ,drillDiameter:0.07 ,maxDepth:0.456},
        {id:7 , type:"UN" ,size:'3-48' ,majorDiameter:0.09 ,drillDiameter:0.079 ,maxDepth:0.476},
        {id:8 , type:"UN" ,size:'3-56' ,majorDiameter:0.09 ,drillDiameter:0.082 ,maxDepth:0.476},
        {id:9 , type:"UN" ,size:'4-40' ,majorDiameter:0.112 ,drillDiameter:0.089 ,maxDepth:0.586},
        {id:10 , type:"UN" ,size:'4-48' ,majorDiameter:0.112 ,drillDiameter:0.094 ,maxDepth:0.586},
        {id:11 , type:"UN" ,size:'5-40' ,majorDiameter:0.125 ,drillDiameter:0.101 ,maxDepth:0.651},
        {id:12 , type:"UN" ,size:'5-44' ,majorDiameter:0.125 ,drillDiameter:0.104 ,maxDepth:0.651},
        {id:13 , type:"UN" ,size:'6-32' ,majorDiameter:0.138 ,drillDiameter:0.106 ,maxDepth:0.716},
        {id:14 , type:"UN" ,size:'6-40' ,majorDiameter:0.138 ,drillDiameter:0.113 ,maxDepth:0.716},
        {id:15 , type:"UN" ,size:'8-32' ,majorDiameter:0.164 ,drillDiameter:0.136 ,maxDepth:0.846},
        {id:16 , type:"UN" ,size:'8-36' ,majorDiameter:0.164 ,drillDiameter:0.136 ,maxDepth:0.846},
        {id:17 , type:"UN" ,size:'10-24' ,majorDiameter:0.19 ,drillDiameter:0.149 ,maxDepth:0.976},
        {id:18 , type:"UN" ,size:'10-32' ,majorDiameter:0.19 ,drillDiameter:0.159 ,maxDepth:0.976},
        {id:19 , type:"UN" ,size:'12-24' ,majorDiameter:0.216 ,drillDiameter:0.177 ,maxDepth:1.106},
        {id:20 , type:"UN" ,size:'12-28' ,majorDiameter:0.216 ,drillDiameter:0.182 ,maxDepth:1.106},
        {id:21 , type:"UN" ,size:'1/4-20' ,majorDiameter:0.25 ,drillDiameter:0.201 ,maxDepth:1.276},
        {id:22 , type:"UN" ,size:'1/4-28' ,majorDiameter:0.25 ,drillDiameter:0.213 ,maxDepth:1.276},
        {id:23 , type:"UN" ,size:'1/4-36' ,majorDiameter:0.25 ,drillDiameter:0.221 ,maxDepth:1.276},
        {id:24 , type:"UN" ,size:'5/16-18' ,majorDiameter:0.313 ,drillDiameter:0.257 ,maxDepth:1.588},
        {id:25 , type:"UN" ,size:'5/16/24' ,majorDiameter:0.313 ,drillDiameter:0.272 ,maxDepth:1.588},
        {id:26 , type:"UN" ,size:'3/8-16' ,majorDiameter:0.375 ,drillDiameter:0.313 ,maxDepth:1.901},
        {id:27 , type:"UN" ,size:'3/8-24' ,majorDiameter:0.375 ,drillDiameter:0.332 ,maxDepth:1.901},
        {id:28 , type:"UN" ,size:'7/16-14' ,majorDiameter:0.437 ,drillDiameter:0.368 ,maxDepth:2.213},
        {id:29 , type:"UN" ,size:'7/16-20' ,majorDiameter:0.437 ,drillDiameter:0.391 ,maxDepth:2.213},
        {id:30 , type:"UN" ,size:'1/2-13' ,majorDiameter:0.5 ,drillDiameter:0.422 ,maxDepth:2.526},
        {id:31 , type:"UN" ,size:'1/2-20' ,majorDiameter:0.5 ,drillDiameter:0.453 ,maxDepth:2.526},
        {id:32 , type:"UN" ,size:'1/2-28' ,majorDiameter:0.5 ,drillDiameter:0.469 ,maxDepth:2.526},
        {id:33 , type:"UN" ,size:'9/16-12' ,majorDiameter:0.563 ,drillDiameter:0.484 ,maxDepth:2.838},
        {id:34 , type:"UN" ,size:'9/16-18' ,majorDiameter:0.563 ,drillDiameter:0.516 ,maxDepth:2.838},
        {id:35 , type:"UN" ,size:'5/8-11' ,majorDiameter:0.625 ,drillDiameter:0.531 ,maxDepth:3.151},
        {id:36 , type:"UN" ,size:'5/8-18' ,majorDiameter:0.625 ,drillDiameter:0.578 ,maxDepth:3.151},
        {id:37 , type:"UN" ,size:'11/16-11' ,majorDiameter:0.687 ,drillDiameter:0.594 ,maxDepth:3.463},
        {id:38 , type:"UN" ,size:'11/16-16' ,majorDiameter:0.687 ,drillDiameter:0.625 ,maxDepth:3.463},
        {id:39 , type:"UN" ,size:'3/4-10' ,majorDiameter:0.75 ,drillDiameter:0.656 ,maxDepth:3.776},
        {id:40 , type:"UN" ,size:'3/4-16' ,majorDiameter:0.75 ,drillDiameter:0.688 ,maxDepth:3.776},
        {id:41 , type:"UN" ,size:'7/8-9' ,majorDiameter:0.875 ,drillDiameter:0.766 ,maxDepth:4.401},
        {id:42 , type:"UN" ,size:'7/8-14' ,majorDiameter:0.875 ,drillDiameter:0.813 ,maxDepth:4.401},
        {id:43 , type:"UN" ,size:'1-8' ,majorDiameter:1 ,drillDiameter:0.875 ,maxDepth:5.026},
        {id:44 , type:"UN" ,size:'1-12' ,majorDiameter:1 ,drillDiameter:0.938 ,maxDepth:5.026},
        {id:45 , type:"UN" ,size:'1-14' ,majorDiameter:1 ,drillDiameter:0.938 ,maxDepth:5.026},
        {id:46 , type:"M" ,size:'M1.6x0.35' ,majorDiameter:1.6 ,drillDiameter:1.25 ,maxDepth:8.65},
        {id:47 , type:"M" ,size:'M2x0.4' ,majorDiameter:2 ,drillDiameter:1.6 ,maxDepth:10.65},
        {id:48 , type:"M" ,size:'M2.5x0.45' ,majorDiameter:2.5 ,drillDiameter:2.05 ,maxDepth:13.15},
        {id:49 , type:"M" ,size:'M3x0.5' ,majorDiameter:3 ,drillDiameter:2.499 ,maxDepth:15.65},
        {id:50 , type:"M" ,size:'M3.5x0.6' ,majorDiameter:3.5 ,drillDiameter:2.901 ,maxDepth:18.151},
        {id:51 , type:"M" ,size:'M4x0.7' ,majorDiameter:4 ,drillDiameter:3.299 ,maxDepth:20.65},
        {id:52 , type:"M" ,size:'M4.5x0.75' ,majorDiameter:4.5 ,drillDiameter:3.701 ,maxDepth:23.151},
        {id:53 , type:"M" ,size:'M5x0.8' ,majorDiameter:5 ,drillDiameter:4.201 ,maxDepth:25.65},
        {id:54 , type:"M" ,size:'M6x1' ,majorDiameter:6 ,drillDiameter:5.001 ,maxDepth:30.65},
        {id:55 , type:"M" ,size:'M7x1' ,majorDiameter:7 ,drillDiameter:5.999 ,maxDepth:35.65},
        {id:56 , type:"M" ,size:'M8x1' ,majorDiameter:8 ,drillDiameter:7 ,maxDepth:40.65},
        {id:57 , type:"M" ,size:'M8x1.25' ,majorDiameter:8 ,drillDiameter:6.8 ,maxDepth:40.65},
        {id:58 , type:"M" ,size:'M10x1' ,majorDiameter:10 ,drillDiameter:8.999 ,maxDepth:50.65},
        {id:59 , type:"M" ,size:'M10x1.25' ,majorDiameter:10 ,drillDiameter:8.801 ,maxDepth:50.65},
        {id:60 , type:"M" ,size:'M10x1.5' ,majorDiameter:10 ,drillDiameter:8.499 ,maxDepth:50.65},
        {id:61 , type:"M" ,size:'M12x1.25' ,majorDiameter:12 ,drillDiameter:10.8 ,maxDepth:60.65},
        {id:62 , type:"M" ,size:'M12x1.5' ,majorDiameter:12 ,drillDiameter:10.5 ,maxDepth:60.65},
        {id:63 , type:"M" ,size:'M12x1.75' ,majorDiameter:12 ,drillDiameter:10.201 ,maxDepth:60.65},
        {id:64 , type:"M" ,size:'M14x1.25' ,majorDiameter:14 ,drillDiameter:12.799 ,maxDepth:70.65},
        {id:65 , type:"M" ,size:'M14x1.5' ,majorDiameter:14 ,drillDiameter:12.499 ,maxDepth:70.65},
        {id:66 , type:"M" ,size:'M14x2' ,majorDiameter:14 ,drillDiameter:11.999 ,maxDepth:70.65},
        {id:67 , type:"M" ,size:'M16x1.5' ,majorDiameter:16 ,drillDiameter:14.501 ,maxDepth:80.65},
        {id:68 , type:"M" ,size:'M16x2' ,majorDiameter:16 ,drillDiameter:14 ,maxDepth:80.65},
        {id:69 , type:"M" ,size:'M20x1.5' ,majorDiameter:20 ,drillDiameter:18.499 ,maxDepth:100.65},
        {id:70 , type:"M" ,size:'M20x2.5' ,majorDiameter:20 ,drillDiameter:17.501 ,maxDepth:100.65},
        {id:71 , type:"M" ,size:'M22x1.5' ,majorDiameter:22 ,drillDiameter:20.5 ,maxDepth:110.65},
        {id:72 , type:"M" ,size:'M22x2.5' ,majorDiameter:22 ,drillDiameter:19.5 ,maxDepth:110.65},
        {id:73 , type:"M" ,size:'M24x1.5' ,majorDiameter:24 ,drillDiameter:22.499 ,maxDepth:120.65},
        {id:74 , type:"M" ,size:'M24x3' ,majorDiameter:24 ,drillDiameter:21.001 ,maxDepth:120.65},
        {id:75 , type:"M" ,size:'M27x3' ,majorDiameter:27 ,drillDiameter:24 ,maxDepth:135.65},
        {id:76 , type:"M" ,size:'M30x2' ,majorDiameter:30 ,drillDiameter:28.001 ,maxDepth:150.65},
        {id:77 , type:"M" ,size:'M30x3.5' ,majorDiameter:30 ,drillDiameter:26.492 ,maxDepth:150.65},
    ].map(t=>{
        if(t.type==Thread.TYPE_UN) {
            t.majorDiameter *= 25.4;
            t.drillDiameter *= 25.4;
            t.maxDepth *= 25.4;
        }
        return t;
    }).map(t=>Object.assign(new Thread(), t));
    /**
     * 
     * @param {string} type
     * @return {Array<Thread>} 
     */
    static getListTrheadsByType(type){
        switch (type) {
            case Thread.TYPE_UN:
            case Thread.TYPE_M:
                return Thread._threads.filter(t=>t.type==type);
            default:
                return [];
        }
    }


    constructor(){
        super();

        /** @type {number} */
        this.id=-1;

        /** @type {string} */
        this.type = Thread.TYPE_UN;

        /** @type {string} */
        this.size="";

        /** @type {number} - in mm*/
        this.majorDiameter = 0;

        /** @type {number} - in mm*/
        this.drillDiameter = 0;

        /** @type {number} - in mm*/
        this.maxDepth = 0;
    }

    /**
     * @return {Thread}
     */
    copy() {
        let res = Object.assign(new Thread(), this);
        return res;
    }
}