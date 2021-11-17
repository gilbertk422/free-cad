/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Arc from "../../src/model/elements/Arc";

var chai = require('chai');
var expect = chai.expect;

import EraserNearElementsCommand from './../../src/command/EraserNearElements';

import Document from './../../src/model/Document';
import Point from './../../src/model/math/Point';
import LineElement from './../../src/model/elements/LineElement';
import RectElement from './../../src/model/elements/RectElement';


const eps = 0.0001;

describe('EraserNearElements', function(){
    describe('remove single elements', function(){
        it('remove one line', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            let point = new Point();
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.be.empty;
        });

        it('try remove element not near line', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            let point = new Point(10,10);
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.have.lengthOf(1);
        });
    });

    describe('remove shapes', function(){
        it('delete two consecutive lines', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            doc.addElement(new LineElement(new Point(5,5), new Point(10, 5)));
            let point = new Point();
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.be.empty;
        });

        it('delete rect (shape in group)', function () {
            let doc = new Document();
            doc.addElement(new RectElement(new Point(-5,-5), new Point(5, 5)).toElement());
            let point = new Point(0,5);
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.be.empty;
        });

        it('delete the line with the starting point is the starting point for the other two lines', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(), new Point(0, 5)));
            doc.addElement(new LineElement(new Point(), new Point(0, -5)));
            doc.addElement(new LineElement(new Point(), new Point(5, 0)));
            let point = new Point(2.5,0);
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.have.lengthOf(2);
        });

        it('delete line with arc shape', function(){
            let doc = new Document();
            doc.addElement(new LineElement(new Point(0, 5), new Point(10, 5)));
            doc.addElement(new LineElement(new Point(10, 5), new Point(10, -5)));
            doc.addElement(new LineElement(new Point(10, -5), new Point(0, -5)));
            let arc = new Arc(new Point(), 5);
            arc.startAngle=90;
            arc.incrementAngle=180;
            doc.addElement(arc);
            let point = new Point(5, 5);
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            return expect(doc._elements).to.be.empty;
        });
    });

    describe('remove with intersect', function(){
        it('eraser arc by line', function(){
            let doc = new Document();
            doc.addElement(new LineElement(new Point(0,5), new Point(0,-5)));
            doc.addElement(new Arc(new Point(), 2.5));

            let point = new Point(2.5000001,0.000001);
            let eps = 0.0001;
            let command = new EraserNearElementsCommand(doc, point, eps);
            command.executeCommand();
            expect(doc._elements).to.have.lengthOf(2);


            expect(doc._elements[1].startAngle, "start angle must be 90").to.equal(90);

            return expect(doc._elements[1].incrementAngle, "increment angle must be 180").to.equal(180);
        });


        it('three rectangles', function(){
            let doc = new Document();
            doc.addElement(new RectElement(new Point(-5,5), new Point(5,-5)).toElement());
            doc.addElement(new RectElement(new Point(-9,-2), new Point(-2,-9)).toElement());
            doc.addElement(new RectElement(new Point(2,-2), new Point(10,-9)).toElement());

            let eps = 0.0001;

            let point1 = new Point(0,-5);
            let command1 = new EraserNearElementsCommand(doc, point1, eps);
            command1.executeCommand();

            console.log("===================================================");

            let point2 = new Point(0,5);
            let command2 = new EraserNearElementsCommand(doc, point2, eps);
            command2.executeCommand();
            return expect(doc._elements).to.have.lengthOf(6);
        })
    });

});