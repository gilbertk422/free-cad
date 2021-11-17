/**
 * Created by dev on 17.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class Trigonometric{

    static get axisX(){return 'X'; }
    static get axisY(){return 'Y'; }
    static get axisZ(){return 'Z'; }

    static gradToRad(grad){
        return grad*(Math.PI/180);
    }

    static radToGrad(rad){
        return rad*(180/Math.PI);
    }
}