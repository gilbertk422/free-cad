/**
 * Created by dev on 22.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Analyzer from './../Analyzer';

import LineInNoShapeRule from './../rules/LineInNoShape';
import TwoLinesInNoShapeRule from './../rules/TwoLinesInNoShape';
import NotClosedShape from './../rules/NotClosedShape';
import DifferentZInShape from './../rules/DifferentZInShape';
import ZValueOfOuterShape from "../rules/ZValueOfOuterShape";
import ShapeCrossing from "../rules/ShapeCrossing";
import ZValueOfInnerShape from "../rules/ZValueOfInnerShape";
import HoleInsideAnotherHole from "../rules/HoleInsideAnotherHole";
import SameZValue from "../rules/SameZValue";
import ShapeSize from "../rules/ShapeSize";
import ShapeMinSize from "../rules/ShapeMinSize";
import ShapeBuilder from "../ShapeBuilder";
import Group from "../../model/elements/Group";
import SelectTool from "../../ui/2d/tool/SelectTool";
import MagnificationDecorator from "../../ui/2d/tool/decorators/MagnificationDecorator";
import CrossItself from "../rules/CrossItself";
import OverlappingLine from "../rules/OverlappingLine";
import GroupShapesHandler from "../../model/handlers/GroupShapes";
import CrossBends from "../rules/CrossBends";
import TooCloseBends from "../rules/TooCloseBends";
import ExtendsBendEdge from "../../model/handlers/ExtendsBendEdge";
import DrawingHasMachine from "../rules/DrawingHasMachine";
import MaxZValueOfBend from "../rules/MaxZValueOfBend";
import ShapeInOtherShapeWithBend from "../rules/ShapeInOtherShapeWithBend";
import IncorrectBends from '../rules/IncorrectBends'
import NotConvertedText from "../rules/NotConvertedText";

export default class ErrorModelAnalyzer extends Analyzer{

    /**
     * @param {Document} document
     */
    constructor(document){
        super(document);

        this.rules.push(new DrawingHasMachine(document));
        this.rules.push(new TwoLinesInNoShapeRule(document));
        this.rules.push(new LineInNoShapeRule(document));
        this.rules.push(new NotConvertedText(document));
        this.rules.push(new LineInNoShapeRule(document));
        this.rules.push(new NotClosedShape(document));
        this.rules.push(new CrossItself(document));
        this.rules.push(new DifferentZInShape(document));
        this.rules.push(new OverlappingLine(document));
        this.rules.push(new ShapeCrossing(document));
        this.rules.push(new ZValueOfOuterShape(document));
        this.rules.push(new MaxZValueOfBend(document));
        // this.rules.push(new ZValueOfInnerShape(document));
        this.rules.push(new HoleInsideAnotherHole(document));
        this.rules.push(new ShapeInOtherShapeWithBend(document));
        this.rules.push(new ShapeSize(document));
        this.rules.push(new ShapeMinSize(document));
        this.rules.push(new SameZValue(document));
        this.rules.push(new CrossBends(document));
        this.rules.push(new IncorrectBends(document));
        this.rules.push(new TooCloseBends(document));

        /** @type {Array.<DataHandler>} */
        this.postHandlers= [
            new GroupShapesHandler(),
        ];

        this.preHandlers = [
            new ExtendsBendEdge()
        ];

    }


    /**
     * @inheritDoc
     * @return {Promise.<boolean>}
     */
    analyze(){
        return new Promise((resolve, reject)=>{
            let finish = container.resolve('config').finishes;
            let material = container.resolve('config').material;
            if(finish && (!finish.isCompatible(material) || !material.isCompatible(finish))){
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Warning: Selected finishing method ("+finish.showName+") is not compatible with "+material.name+".");
                resolve(false);
                return;
            }else {
                this.preHandling();
                super.analyze().then((res) => {
                    if (res) {
                        this.postHandling();
                    }
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }


    /**
     * @private
     */
    preHandling(){
        let isDocumentChanged = false;

        for(let handler of this.preHandlers){
            isDocumentChanged |= handler.handle(this.document);
        }

        if(isDocumentChanged){
            this.clearTool();
        }
    }


    /**
     * @private
     */
    postHandling(){
        let isDocumentChanged = false;

        for(let handler of this.postHandlers){
            isDocumentChanged |= handler.handle(this.document);
        }

        if(isDocumentChanged){
            this.clearTool();
        }
    }

    /**
     * @private
     */
    clearTool(){
        let board = container.resolve('mainBoard');
        let isSelectedTool = board.tool instanceof SelectTool || (board.tool instanceof MagnificationDecorator && board.tool._tool instanceof SelectTool);
        if(isSelectedTool){
            board.tool.clearSelectElements();
        }
    }
}
