/**
 * Copyright (c) 2019 Micro Logic Corp.
 * Created by dev on 20.03.19.
 *
 * The class need for getting intersect points
 * @interface
 */
export default class IntersectCalculator{

    /**
     * @param {GraphicElement} element1
     * @param {GraphicElement} element2
     * @return {Array.<Point>}
     */
    getIntersectPoints(element1, element2){
        throw new Exception(`The getIntersectPoints method doesn't have implementation.`);
    }

}
