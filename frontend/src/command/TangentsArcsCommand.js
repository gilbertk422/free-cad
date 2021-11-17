/**
 * Created by dev on 19.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import ElementModificationCommand from './ElementModificationCommand';
import Document from '../model/Document';
import LineElement from '../model/elements/LineElement';
import Arc from '../model/elements/Arc';
import Line from '../model/math/Line';

import TangentsDataValidator from './behaviors/TangentsDataValidator';

import ArcArcIntersector from '../model/math/algorithms/intersects/ArcArc';
import LineArcIntersector from '../model/math/algorithms/intersects/LineArc';

let arcArcIntersector = new ArcArcIntersector();
let lineArcIntersector = new LineArcIntersector();

export default class TangentsArcsCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     */
    constructor(document, elements){
        super(document, elements);

        this.name = 'TangentsArcsCommand';

        this.newElements = [];

        this.behaviors.push(new TangentsDataValidator());
    }

    /**
     * @inheritDoc
     * @return {boolean} - return true if the command replacing or adding any elements
     */
    isReplacedElements(){
        return this.newElements.length>0;
    }

    /**
     * The realisation of the  @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     * @protected
     */
    getReplaceElements(){
        return this.newElements;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        let arcs = this.elements.filter(el=>el instanceof Arc);

        for(let i=0; i<arcs.length; i++){
            for(let j=i+1; j<arcs.length; j++){
                let newEl = TangentsArcsCommand.tangentsArcs(arcs[i], arcs[j]);
                this.newElements.push(...newEl);
                for(let el of newEl){
                    this._document.addElement(el);
                }
            }
        }
        this.newElements.push(...this.elements);
        return true;
    }


    /**
     *
     * @param {Arc} arc1
     * @param {Arc} arc2
     * @return {Array.<LineElement>}
     */
    static tangentsArcs(arc1,arc2){
        let res = [];
        if(arc1.radius==arc2.radius){
            res.push(...TangentsArcsCommand.getOutsideTangentsForEqualsArcs(arc1,arc2));
            res.push(...TangentsArcsCommand.getInsideTangents(arc1,arc2));
        }else{
            //arc1 is smaller arc than arc2
            if(arc1.radius>arc2.radius){
                let temp = arc1;
                arc1=arc2;
                arc2=temp;
            }
            res.push(...TangentsArcsCommand.getOutsideTangents(arc1,arc2));
            res.push(...TangentsArcsCommand.getInsideTangents(arc1,arc2));
        }
        return res;
    }

    /**
     *
     * @param {Arc} arc1 - the arc with smaller radius than arc2
     * @param {Arc} arc2
     * @returns {Array.<GraphicElement>} - new graphicElements
     */
    static getOutsideTangents(arc1,arc2){
        let res = [];
        let addArcInCenter = new Arc(arc2.center, arc2.radius-arc1.radius);
        let tempLine =  new (container.resolve('math')).Line(arc1.center, arc2.center);
        let addArcBetween = new Arc(tempLine.getPointOffset(0.5), tempLine.length()/2);

        let intersectPoints = arcArcIntersector.getIntersectPoints(addArcInCenter, addArcBetween);
        for(let p of intersectPoints){
            let tempLine =  new (container.resolve('math')).Line(arc2.center.copy(), p.copy());
            tempLine.setLength(arc2.radius+1);

            let lineElement = new LineElement(tempLine._p1, tempLine._p2);

            let intersectPoints = lineArcIntersector.getIntersectPoints(lineElement, arc2);
            if(intersectPoints.length==1){
                let p1 = intersectPoints[0];

                lineElement.move(arc1.center.x-arc2.center.x, arc1.center.y-arc2.center.y);

                intersectPoints = lineArcIntersector.getIntersectPoints(lineElement, arc1);
                if(intersectPoints.length==1){
                    res.push(new LineElement(p1,intersectPoints[0]));
                }
            }
        }
        return res;
    }

    /**
     *
     * @param {Arc} arc1
     * @param {Arc} arc2
     */
    static getOutsideTangentsForEqualsArcs(arc1, arc2){
        let res = [];
        let middleLine = new LineElement(arc1.center.copy(), arc2.center.copy());
        let intersectPoints1 = lineArcIntersector.getIntersectPoints(middleLine, new Arc(arc1.center, arc1.radius));
        if(intersectPoints1.length==1){
            let tempLine = new LineElement(arc1.center.copy(), intersectPoints1[0]);
            tempLine.rotate(arc1.center.copy(), 90);
            let tangentPoint1 = lineArcIntersector.getIntersectPoints(tempLine, arc1);
            if(tangentPoint1.length==1){
                let p1=tangentPoint1[0];
                let p2 = new (container.resolve('math')).Point(p1.x+(arc2.center.x-arc1.center.x), p1.y+(arc2.center.y-arc1.center.y));
                res.push(new LineElement(p1,p2));
            }
            tempLine.rotate(arc1.center.copy(), 180);
            tangentPoint1 = lineArcIntersector.getIntersectPoints(tempLine, arc1);
            if(tangentPoint1.length==1){
                let p1=tangentPoint1[0];
                let p2 = new (container.resolve('math')).Point(p1.x+(arc2.center.x-arc1.center.x), p1.y+(arc2.center.y-arc1.center.y));
                res.push(new LineElement(p1,p2));
            }
        }
        return res;
    }

    /**
     *
     * @param {Arc} arc1 - the arc with smaller radius than arc2
     * @param {Arc} arc2
     * @returns {Array.<GraphicElement>} - new graphicElements
     */
    static getInsideTangents(arc1,arc2){
        let res = [];
        let addArcInCenter = new Arc(arc2.center, arc2.radius+arc1.radius);

        let intersectPoints = TangentsArcsCommand.getTangentByPoint(addArcInCenter, arc1.center);
        for(let p of intersectPoints){
            let lineElement = new LineElement(arc2.center.copy(), p.copy());

            let intersectPoints = lineArcIntersector.getIntersectPoints(lineElement, arc2);
            if(intersectPoints.length==1){
                let p1 = intersectPoints[0];

                lineElement.move(arc1.center.x-arc2.center.x, arc1.center.y-arc2.center.y);
                lineElement.rotate(arc1.center, 180);
                intersectPoints = lineArcIntersector.getIntersectPoints(lineElement, arc1);
                if(intersectPoints.length==1){
                    res.push(new LineElement(p1,intersectPoints[0]));
                }
            }
        }
        return res;
    }

    /**
     *
     * @param {Arc} arc
     * @param {Point} point
     * @return {Array.<Point>}
     */
    static getTangentByPoint(arc, point){
        let line =  new (container.resolve('math')).Line(arc.center, point);
        if(line.length()<arc.radius){
            return [];
        }
        let center = line.getPointOffset(0.5);
        
        let tempArc = new Arc(center, line.length()/2);

        let intersectPoints = arcArcIntersector.getIntersectPoints(arc, tempArc);

        return intersectPoints;
    }

}