

/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import Bezier from "bezier-js";
import Arc from "../model/elements/Arc";
import Group from "../model/elements/Group";
import SimplifyDataValidator from "./behaviors/SimplifyDataValidator";
import Document from "../model/Document";

const Trigonometric = container.resolve('math').Trigonometric;

export default class Simplify extends ElementModificationCommand{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     */
    constructor(document, elements){
        super(document, Document.toSimpleListElements(elements));
        this.name= 'SimplifyCommand';
        this.newElements = [];

        this.behaviors.push(new SimplifyDataValidator());

        this.errorThreshold=0.1;
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        let els = this.elements.filter(e=>e.typeName=="Spline");

        if(els.length==0){
            return false;
        }

        for(let el of els){
            let curve = new Bezier(el.startPoint.x, el.startPoint.y,
                el.controlPoint1.x, el.controlPoint1.y,
                el.controlPoint2.x, el.controlPoint2.y,
                el.endPoint.x, el.endPoint.y);
            let arcs = curve.arcs(this.errorThreshold);

            let group = new Group();
            for(let arc of arcs){
                let newArc = new Arc(new (container.resolve('math').Point)(arc.x, arc.y), arc.r);
                newArc.startAngle = Trigonometric.radToGrad(arc.s);
                newArc.endAngle = Trigonometric.radToGrad(arc.e);
                group.addElement(newArc);
            }
            this._document.removeElement(el);
            this._document.addElement(group);
            this.newElements.push(group);
        }

        return true;
    }

    /**
     * @inheritDoc
     */
    isReplacedElements(){
        return this.newElements.length>0;
    }

    /**
     * @inheritDoc
     */
    getReplaceElements(){
        return this.newElements;
    }
}