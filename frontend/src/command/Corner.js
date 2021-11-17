/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import ElementModificationCommand from './ElementModificationCommand';

import LineElement from '../model/elements/LineElement';
import CornerDataValidator from "./behaviors/CornerDataValidator";
import Document from './../model/Document';
import Arc from "../model/elements/Arc";
import CornerDialog from "./behaviors/CornerDialog";
import CommentToSelf from '../model/line_types/CommentToSelf'
import Line from '../model/math/Line'
import Group from '../model/elements/Group';

let Trigonometric = container.resolve('math').Trigonometric;

export default class Corner extends ElementModificationCommand{

    static TYPE_ROUND = "round";
    static TYPE_CHAMFER = "chamfer";

    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     */
    constructor(document, elements){
        super(document, elements);

        this.groupElements = elements.length == 1;
        this.elements = Document.toSimpleListElements(elements).filter(e=>e.typeName=="Line");        

        this.name= 'Corner';

        this.type = Corner.TYPE_ROUND;

        this.behaviors.push(new CornerDataValidator(this));
        this.behaviors.push(new CornerDialog(this));

        this.newElements = [];

        /** @type {number} - the radius fo corner. Millimeters */
        this.radius = 5;
    }


    addNewElement(element){
        for(let el of this.newElements){
            if(el.compare(element)){
                return;
            }
        }
        this.newElements.push(element);
    }

    /**
     * The method need for operation witch replacing or adding any elements.
     * For example command copy, the command creates new element so the method will return true.
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
        let res = false;
        switch (this.type) {
            case Corner.TYPE_ROUND:
            case Corner.TYPE_CHAMFER:
                res = this.corner();
                break;

            default:
                console.error("Unsupported corner type.");
        }


        return res;
    }

    corner(){
        let res = false;
        for(let i=0; i<this.elements.length-1; i++){
            for(let j=i+1; j<this.elements.length; j++) {
                switch (this.type) {
                    case Corner.TYPE_ROUND:                        
                        res |= this.cornerRoundTwoLines(this.elements[i], this.elements[j]);
                        break;
                    case Corner.TYPE_CHAMFER:
                        res |= this.cornerChamferTwoLines(this.elements[i], this.elements[j]);
                        break;
                }

            }
            this.document.removeElement(this.elements[i]);
            this.document.addElement(this.elements[i]);
        }

        if (this.groupElements && this.isReplacedElements()) {
            let group = new Group();
            for(let el of this.newElements) {
                group.addElement(el);
                this.document.removeElement(el);
            }
            this.newElements = [group];
            this.document.addElement(group);
        } else {
            this.document.removeElement(this.elements[this.elements.length-1]);
            this.document.addElement(this.elements[this.elements.length-1]);
        }

        return res;
    }

    /**
     *
     * @param {LineElement} line1
     * @param {LineElement} line2
     * @return {boolean}
     */
    cornerChamferTwoLines(line1, line2){
        let intersectPoint  = line1._line.getCrossPoint(line2._line);
        if(!intersectPoint || !(intersectPoint.compare(line1.p1) || intersectPoint.compare(line1.p2)
            || intersectPoint.compare(line2.p1) || intersectPoint.compare(line2.p2))){
            return false;
        }

        let points = [];
        if(line1.p2.compare(intersectPoint)){
            line1._line.setLength(line1.length()-this.radius);
            points.push(line1.p2.copy());
        }else{
            let temp = new (container.resolve('math')).Line(line1.p2.copy(), line1.p1.copy());
            temp.setLength(line1.length()-this.radius);
            line1.p1=temp._p2;
            points.push(line1.p1.copy());
        }

        if(line2.p2.compare(intersectPoint)){
            line2._line.setLength(line2.length()-this.radius);
            points.push(line2.p2.copy());
        }else{
            let temp = new (container.resolve('math')).Line(line2.p2.copy(), line2.p1.copy());
            temp.setLength(line2.length()-this.radius);
            line2.p1=temp._p2;
            points.push(line2.p1.copy());
        }

        let newElement = new LineElement(points[0], points[1]);

        this.document.addElement(newElement);
        this.addNewElement(newElement);
        this.addNewElement(line1);
        this.addNewElement(line2);
        return true;
    }


    /**
     *
     * @param {LineElement} line1
     * @param {LineElement} line2
     * @return {boolean}
     */
    cornerRoundTwoLines(line1, line2){
        let intersectPoint  = line1._line.getCrossPoint(line2._line);
        if(!intersectPoint || !(intersectPoint.compare(line1.p1) || intersectPoint.compare(line1.p2)
            || intersectPoint.compare(line2.p1) || intersectPoint.compare(line2.p2))){
            return false;
        }
        let baseVector = new (container.resolve('math')).Vector(1);

        let parallel = line1._line.getParallels(this.radius);
        parallel.push(...line2._line.getParallels(this.radius));

        let center = null;
        m: for(let i=0; i<parallel.length; i++){
            for(let j=i+1; j<parallel.length; j++){
                let temp = parallel[i].getCrossPoint(parallel[j]);
                if(temp){
                    center = temp;
                    break m;
                }
            }
        }

        let points = [
            line1._line.perpendicularPoint(center),
            line2._line.perpendicularPoint(center)
        ];

        let v1 = new (container.resolve('math')).Line(center, points[0]).toVector();
        let v2 = new (container.resolve('math')).Line(center, points[1]).toVector();

        let angle = v1.getAngle(v2);
        let newArc = new Arc(center, this.radius);
        if(angle<180){
            newArc.startAngle = baseVector.getAngle(v1);
            newArc.endAngle = baseVector.getAngle(v2);
        }else{
            newArc.startAngle = baseVector.getAngle(v2);
            newArc.endAngle = baseVector.getAngle(v1);
        }

        if(intersectPoint.compare(line1.p1)){
            line1.p1=points[0].copy();
        }else{
            line1.p2=points[0].copy();
        }

        if(intersectPoint.compare(line2.p1)){
            line2.p1=points[1].copy();
        }else{
            line2.p2=points[1].copy();
        }

        newArc.height=line1.height;
        this.document.addElement(newArc);
        this.addNewElement(newArc);
        this.addNewElement(line1);
        this.addNewElement(line2);
        return true;
    }

}