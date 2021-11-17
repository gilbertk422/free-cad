/**
 * Created by dev on 13.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import FileLoader from './FileLoader';
import Sax from 'sax';
import Document from './../model/Document';
import Point from '../model/math/Point';
import LineElement from './../model/elements/LineElement';
import Arc from './../model/elements/Arc';
import Spline from './../model/elements/Spline';
import Text from './../model/elements/Text';


import AutoLineType from './../model/line_types/Auto';
import CommentToSelfLineType from './../model/line_types/CommentToSelf';
import GraphicElement from "../model/GraphicElement";
import Bend from "../model/line_types/Bend";
import BendProcessing from "../model/line_types/processings/Bend";
import CommentsToMachinist from "./../model/line_types/CommentToMachine";
import GroupShapesHandler from "../model/handlers/GroupShapes";
import DocumentToXMLTranslator from "./xml/DocumentToXMLTranslator";
import Thread from "../model/line_types/Thread";
import ThreadProcessing from "../model/line_types/processings/Thread";
import Finish from "../model/Finish";
import Color from "../model/Color";
import FontManager from "../model/elements/text/FontManager";


export default class XmlFileLoader extends FileLoader{
    constructor(){
        super();
    }

    /**
     * @inheritDoc
     */
    initRead(reader, file){
        reader.readAsText(file);
    }

    /**
     * @inheritDoc
     * @param {string} data
     */
    validate(data){
        //todo: add xml validation

        

        // throw new InvalidDataFormatException('the data doend\'t corresponds to format.dtd structure.', data);
        return true;
    }


    /**
     * For parsing use @see{@link https://www.npmjs.com/package/sax}
     * @param {string} data
     * @return {Promise}
     */
    convertDataToDocument(data){
        return new Promise((resolve, reject)=>{
            let height=0;
            let lineType = null;
            let doc = new Document();

            let element= null;
            let newElement = false;
            let parser = Sax.parser(true);
            let finish = null;
            parser.onopentag = (tag)=> {
                newElement = false;
                switch (tag.name){
                    case 'Machine':
                        lineType = this._getLineTypeByTag(tag);
                        break;
                    case 'Thread':
                        lineType = new Thread();
                        lineType.processing = [this._createThreadProcessingByTag(tag)];
                        break;
                    case 'Region':
                        height = tag.attributes.Z;
                        break;
                    case 'Straight':
                        element = this._createLineElementByTag(tag);
                        newElement = true;
                        break;
                    case 'Circle':
                    case 'Arc':
                        element = this._createArcByTag(tag);
                        newElement = true;
                        break;
                    case 'Spline':
                        element = this._createSplineByTag(tag);
                        newElement = true;
                        break;
                    case 'Text':
                        element = this._createTextElementByTag(tag);
                        newElement = true;
                        break;
                    case 'Bend':
                        lineType=new Bend();
                        let processing = this._createBendProcessingByTag(tag);
                        lineType.processing = [processing];
                        break;
                    case 'Method':
                        finish = this._createFinishByTag(tag);
                        container.resolve('config').finishes = finish;
                        break;
                }
                if(newElement){
                    if(height=='AirInside'){
                        element.height=GraphicElement.AirInside;
                    }else{
                        element.height=parseFloat(height);
                    }

                    if(lineType){
                        element.lineType = lineType.copy();
                    }else{
                        element.lineType = new AutoLineType();
                    }

                    doc.addElement(element);
                }
            };
            parser.ontext = function (t) {
                if(element && element.typeName=='Text' && element.text==null){
                    element.text=t;
                }
            };
            parser.onend = function () {
                new GroupShapesHandler().handle(doc);
                resolve(doc);
            };

            parser.write(data).close();
        });
    }

    _createFinishByTag(tag){
        let finish = new Finish();
        finish.id = parseInt(tag.attributes.ID);
        finish.name = tag.attributes.Name;
        if(tag.attributes.SpecialColor){
            finish.specialColor=new Color(tag.attributes.SpecialColor, tag.attributes.SpecialColor);
        }
        finish.generateViewName();
        return finish;
    }

    /**
     *@inheritDoc
     */
    getBlobData(document){
        return new Promise((resolve, reject)=>{
            let xml = this.convertInXML(document);
            if(xml) {
                resolve(new Blob([xml], {type: "text/plain;charset=utf-8"}));
            }else{
                reject('Can\'t convert to Xml!');
            }
        });
    }

    convertInXML(doc) {
        return new DocumentToXMLTranslator(doc).getXml();
    }



    _createLineElementByTag(tag){
        let _p1 = tag.attributes.P1.split(',');
        let _p2 = tag.attributes.P2.split(',');

        let p1 = new (container.resolve('math')).Point(parseFloat(_p1[0]),parseFloat(_p1[1]));
        let p2 = new (container.resolve('math')).Point(parseFloat(_p2[0]),parseFloat(_p2[1]));
        return new LineElement(p1,p2);
    }

    _createArcByTag(tag){
        let _center = tag.attributes.Center.split(',');
        let _radius = tag.attributes.Radius;
        let center = new (container.resolve('math')).Point(parseFloat(_center[0]),parseFloat(_center[1]));

        let element = new Arc(center,parseFloat(_radius));
        if(tag.name=='Arc') {
            let _startAngle = tag.attributes.StartAngle;
            let _incAngle = parseFloat(tag.attributes.IncAngle);
            if(_incAngle<0){
                _incAngle=Math.abs(_incAngle);
                _startAngle-=_incAngle;
            }

            element.startAngle = parseFloat(_startAngle);
            element.endAngle = (parseFloat(_startAngle) + _incAngle) % 360;
        }
        return element;
    }

    _createSplineByTag(tag) {
        let _start = tag.attributes.P1.split(',');
        let _end = tag.attributes.P4.split(',');
        let _cp1 = tag.attributes.P2.split(',');
        let _cp2 = tag.attributes.P3.split(',');

        let start = new (container.resolve('math')).Point(parseFloat(_start[0]),parseFloat(_start[1]));
        let end = new (container.resolve('math')).Point(parseFloat(_end[0]),parseFloat(_end[1]));
        let element = new Spline(start, end);

        element.controlPoint1 = new (container.resolve('math')).Point(parseFloat(_cp1[0]),parseFloat(_cp1[1]));
        element.controlPoint2 = new (container.resolve('math')).Point(parseFloat(_cp2[0]),parseFloat(_cp2[1]));
        return element;
    }

    _createTextElementByTag(tag) {
        let _position = tag.attributes.Position.split(',');
        let _fontSize = tag.attributes.Height;
        let _angle = tag.attributes.Angle;
        let _fontName = tag.attributes.FontName;

        let position = new (container.resolve('math')).Point(parseFloat(_position[0]),parseFloat(_position[1]));
        let  element = new Text(position,null);
        element.fontSize= parseFloat(_fontSize);
        element.angle= parseFloat(_angle);

        if(_fontName && _fontName.length>0){
            let font = container.resolve('fontManager').getFont(_fontName);
            if(font instanceof Promise){
                font.then(f=>{
                    element.font=f;
                });
            }else if(font){
                element.font=font;
            }else{
                throw new Exception("The \'"+_fontName+"\' font, not found.");
            }
        }

        return element;
    }

    _getLineTypeByTag(tag){
        let res = null;
        switch(parseInt(tag.attributes.Id)){
            case 14:
                if(tag.attributes.CTM=="1"){
                    res= new CommentsToMachinist()
                }else {
                    res= new CommentToSelfLineType();
                }
                res.type=tag.attributes.LineType;
                return res;
            default:
                return new AutoLineType();
        }
    }

    //============Processing=====================//

    /**
     * @param tag
     * @return {Processing}
     * @private
     */
    _createBendProcessingByTag(tag){
        let res = new BendProcessing();
        res.angle=parseFloat(tag.attributes.Angle);
        res.radius=parseFloat(tag.attributes.Radius);
        return res;
    }

    _createThreadProcessingByTag(tag){
        let size = tag.attributes.Parameters.replace(/\s\(UNF\)/, "");
        return ThreadProcessing.getListTrheadsByType(tag.attributes.Type).find(t=>t.size==size);
    }

}
   