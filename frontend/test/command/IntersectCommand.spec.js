/**
 * Created by dev on 06.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Spline from "../../src/model/elements/Spline";

var assert = require('assert');

import IntersectElementsCommand from '../../src/command/IntersectElementsCommand';

import Document from '../../src/model/Document';
import LineElement from '../../src/model/elements/LineElement';
import Arc from '../../src/model/elements/Arc';
import Point from '../../src/model/math/Point';

import RectElement from '../../src/model/elements/RectElement';


describe('Intersect', function() {
    describe('Line', function() {
        describe('intersect with Line', function() {
            /**
             * the result must be -  Line(Point(-10, -10), Point(10, 10))  Line(Point(-10, 10), Point(0, 0))  Line(Point(0, 0), Point(10, -10))
             */
            it(`after intersect the Line(Point(-10, -10), Point(10, 10)) with the Line(Point(-10, 10), Point(10,-10)) 
                    document must contain 3 lines`, function () {
                let line1  = new LineElement(new Point(-10,-10), new Point(10,10));
                let line2  = new LineElement(new Point(-10,10), new Point(10,-10));

                let doc = new Document();
                doc.addElement(line1);
                doc.addElement(line2);

                let command = new IntersectElementsCommand(doc, [line2]);
                command.executeCommand();

                assert.equal(doc._elements.length, 3);
            });
        });

        describe('intersect with Group of lines', function() {
            it(`after intersect the Line(Point(-10, -10), Point(10, 10)) with the Rect(Point(-10, 5), Point(10,-5)) 
                    document must contain 4 elements`, function () {
                let line1  = new LineElement(new Point(-10,-10), new Point(10,10));
                let rect  = new RectElement(new Point(-10,5), new Point(10,-5));

                let doc = new Document();
                doc.addElement(line1);
                doc.addElement(rect.toElement());

                let command = new IntersectElementsCommand(doc, [line1]);
                command.executeCommand();

                assert.equal(doc._elements.length, 4);
            });
        });

        describe('intersect with Arc', function() {

            it(`after intersect the  Line(Point(-10, -10), Point(10, 10)) with the Arc(Point(0,0), 5) startAngle 0 and increment is 90 degrees 
                    document must contain 2 lines and 1 arc`, function () {
                let line = new LineElement(new Point(-10, -10), new Point(10, 10));
                let arc = new Arc(new Point(), 5);
                arc.startAngle = 0;
                arc.incrementAngle = 90;

                let doc = new Document();
                doc.addElement(line);
                doc.addElement(arc);

                let command = new IntersectElementsCommand(doc, [line]);
                command.executeCommand();

                assert.equal(doc._elements.length, 3);
            });

            it(`after intersect Line & Arc document must contain 4 elements`,function(){
                let line = new LineElement(new Point(-81.05284090254102, -2.6849626246029494),
                                           new Point(-30.271783528768225, -2.6849626246029494));
                let arc = new Arc(new Point(-55.550459666373186, -17.561351679034182), 26.84670898092727);

                let doc = new Document();
                doc.addElement(line);
                doc.addElement(arc);

                let command = new IntersectElementsCommand(doc,[line]);
                command.executeCommand();

                assert.equal(doc._elements.length, 4);
            });

        });
        
    });

    describe('Arc',function(){
        describe('Line',function(){
            it(`after intersect the  Line(Point(-10, -10), Point(10, 10)) with the Arc(Point(0,0), 5) startAngle 0 and increment is 90 degrees 
                    document must contain 1 line and 2 arcs`, function () {
                let line = new LineElement(new Point(-10, -10), new Point(10, 10));
                let arc = new Arc(new Point(), 5);
                arc.startAngle = 0;
                arc.incrementAngle = 90;

                let doc = new Document();
                doc.addElement(line);
                doc.addElement(arc);

                let command = new IntersectElementsCommand(doc, [arc]);
                command.executeCommand();

                assert.equal(doc._elements.length, 3);
            });
        });
        describe('Arc', function(){
            it('after intersection 3 Circles document must contain 12 elements', function () {
                let circle1 = new Arc(new Point(0, 0), 5);
                let circle2 = new Arc(new Point(0, 5), 5);
                let circle3 = new Arc(new Point(5, 5), 5);

                let doc = new Document();
                doc.addElement(circle1);
                doc.addElement(circle2);
                doc.addElement(circle3);

                let command = new IntersectElementsCommand(doc, [circle1,circle2, circle3]);
                command.executeCommand();

                assert.equal(doc._elements.length, 12);

            });
        });
    });

    describe('Group & Arc', function(){
        it('after intersect Rect(Point(-4,4),Point(4,-4)) & Arc(Point(0,0), 5) document must have 20 elements', function(){
            let arc  = new Arc(new Point(), 5);
            let rect  = new RectElement(new Point(-4,4), new Point(4,-4)).toElement();

            let doc = new Document();
            doc.addElement(arc);
            doc.addElement(rect);

            let command = new IntersectElementsCommand(doc, [arc, rect]);
            command.executeCommand();

            assert.equal(doc._elements.length, 20);
        });

        it('after intersect Rect & Arc document must have 20 elements', function(){
            let arc  = new Arc(new Point(-12.859033711811408,4.293780907986459), 3.825238131061844);
            let rect  = new RectElement(new Point(-16.398512488754154, 7.189718089121433),
                                        new Point(-9.319554934868663, 1.3978437268514852)).toElement();

            let doc = new Document();
            doc.addElement(arc);
            doc.addElement(rect);

            let command = new IntersectElementsCommand(doc, [arc, rect]);
            command.executeCommand();

            assert.equal(doc._elements.length, 20);
        });
    });

    describe('Spline', function () {
        describe('Line', function () {
            let line  = new LineElement(new Point(-10,-10), new Point(10,10));
            let spline = new Spline(new Point(-5,5), new Point(5,-5));
            spline.controlPoint1 = new Point(-5, 0);
            spline.controlPoint2 = new Point(5, 0);

            let doc = new Document();
            doc.addElement(line);
            doc.addElement(spline);

            let command = new IntersectElementsCommand(doc, [spline]);
            command.executeCommand();

            assert.equal(doc._elements.length, 3);

        });
    });

    it(`after intersect the Line(Point(-10, -10), Point(10, 10)) and the Rect(Point(-10, 5), Point(10,-5)) 
                    document must contain 9 elements`, function () {
        let line1  = new LineElement(new Point(-10,-10), new Point(10,10));
        let rect  = new RectElement(new Point(-10,5), new Point(10,-5)).toElement();

        let doc = new Document();
        doc.addElement(line1);
        doc.addElement(rect);

        let command = new IntersectElementsCommand(doc, [line1, rect]);
        command.executeCommand();

        assert.equal(doc._elements.length, 9);
    });
});