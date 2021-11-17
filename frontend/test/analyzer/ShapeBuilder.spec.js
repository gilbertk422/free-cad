/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Shape from "../../src/model/elements/Shape";

var chai = require('chai');
var expect = chai.expect;

import ShapeBuilder from './../../src/analyzer/ShapeBuilder';

import Document from './../../src/model/Document';
import Point from './../../src/model/math/Point';
import LineElement from './../../src/model/elements/LineElement';
import Arc from './../../src/model/elements/Arc';
import RectElement from './../../src/model/elements/RectElement';
import BendLineType from "../../src/model/line_types/Bend";


describe('ShapeBuilder', function(){
    describe('buildShapes', function(){
        it('one line', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            let shapes = new ShapeBuilder(doc).buildShapes();
            expect(shapes).to.have.lengthOf(1);
            return expect(shapes[0].elements, 'The shape must have 1 element').to.have.lengthOf(1);
        });

        it('two consecutive lines', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            doc.addElement(new LineElement(new Point(5,5), new Point(10, 5)));
            let shapes = new ShapeBuilder(doc).buildShapes();
            expect(shapes).to.have.lengthOf(1);
            return expect(shapes[0].elements, 'The shape must have 2 elements').to.have.lengthOf(2);
        });

        it('rect', function () {
            let doc = new Document();
            doc.addElement(new RectElement(new Point(-5,-5), new Point(5, 5)).toElement());
            let shapes = new ShapeBuilder(doc).buildShapes();
            return expect(shapes).to.have.lengthOf(1);
        });

        it('line with the starting point is the starting point for the other two lines', function () {
            let doc = new Document();
            let l1 = new LineElement(new Point(), new Point(0, 5));
            doc.addElement(l1);
            let l2 = new LineElement(new Point(), new Point(0, -5));
            doc.addElement(l2);
            let l3 = new LineElement(new Point(), new Point(5, 0));
            doc.addElement(l3);
            let shapes = new ShapeBuilder(doc).buildShapes();
            expect(shapes).to.have.lengthOf(3);

            expect(shapes[0].elements, 'The 1 shape must have 1 elements').to.have.lengthOf(1);
            expect(shapes[0].elements[0]).to.equal(l1);
            expect(shapes[1].elements, 'The 2 shape must have 1 elements').to.have.lengthOf(1);
            expect(shapes[1].elements[0]).to.equal(l2);
            expect(shapes[2].elements[0]).to.equal(l3);
            return expect(shapes[2].elements, 'The 3 shape must have 1 elements').to.have.lengthOf(1);
        });

        it('line with the starting point is the starting point for the other line and shape', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(), new Point(0, 5)));
            doc.addElement(new LineElement(new Point(), new Point(0, -5)));
            doc.addElement(new LineElement(new Point(), new Point(5, 0)));
            doc.addElement(new LineElement(new Point(5,0), new Point(5, -5)));
            let shapes = new ShapeBuilder(doc).buildShapes();
            return expect(shapes).to.have.lengthOf(3);
        });

        it('line with triangle must build two shapes', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(), new Point(0, 5)));
            doc.addElement(new LineElement(new Point(), new Point(0, -5)));
            doc.addElement(new LineElement(new Point(), new Point(5, 0)));
            doc.addElement(new LineElement(new Point(5,0), new Point(0, 5)));
            let shapes = new ShapeBuilder(doc).buildShapes();
            return expect(shapes).to.have.lengthOf(2);
        });

        it('3 elements by two points', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(0, 5), new Point(0, -5)));
            let arc1 = new Arc(new Point(), 5);
            arc1.startAngle=270;
            arc1.incrementAngle=180;
            doc.addElement(arc1);
            let arc2 = new Arc(new Point(), 5);
            arc2.startAngle=90;
            arc2.incrementAngle=180;
            doc.addElement(arc2);

            let shapes = new ShapeBuilder(doc).buildShapes();
            return expect(shapes).to.have.lengthOf(3);
        });

        it('circle inside shape', function(){
            let doc = new Document();

            doc.addElement(new LineElement(new Point(0,-5), new Point(12,-5)));
            doc.addElement(new LineElement(new Point(0,5), new Point(12,5)));
            let arc= new Arc(new Point(), 5);
            arc.startAngle=90;
            arc.incrementAngle=180;
            doc.addElement(arc);

            arc= new Arc(new Point(12), 5);
            arc.startAngle=270;
            arc.incrementAngle=180;
            doc.addElement(arc);

            arc= new Arc(new Point(), 4);
            doc.addElement(arc);

            let builder = new ShapeBuilder(doc);

            let shapes = builder.buildShapes();

            return expect(shapes).to.have.lengthOf(2);
        });

        describe('with bends', function () {
            it('should be with bend', function () {
                let doc = new Document();
                doc.addElement(new RectElement(new Point(-5, 5), new Point(5, -5)).toElement());
                let bend = new LineElement(new Point(0, 5), new Point(0, -5));
                bend.lineType=new BendLineType();
                doc.addElement(bend);

                let shapeBuilder = new ShapeBuilder(doc);

                let shapes = shapeBuilder.buildShapes(true);

                return expect(shapes[0].bends).to.have.lengthOf(1);
            });

            it('should have 8 elements and 1 bend', function () {
                let doc = new Document();
                doc.addElement(new LineElement(new Point(-2,0), new Point(-5,0)));
                doc.addElement(new LineElement(new Point(-5,0), new Point(-5,5)));
                doc.addElement(new LineElement(new Point(-5,5), new Point(5,5)));
                doc.addElement(new LineElement(new Point(5,5), new Point(5,0)));
                doc.addElement(new LineElement(new Point(5,0), new Point(2,0)));
                doc.addElement(new LineElement(new Point(2,0), new Point(2,-3)));
                doc.addElement(new LineElement(new Point(2,-3), new Point(-2,-3)));
                doc.addElement(new LineElement(new Point(-2,-3), new Point(-2,0)));
                let bend = new LineElement(new Point(-2,0), new Point(2,0));
                bend.lineType = new BendLineType();
                doc.addElement(bend);

                let shapeBuilder = new ShapeBuilder(doc);

                let shapes = shapeBuilder.buildShapes();

                expect(shapes).to.have.lengthOf(1);
                expect(shapes[0].elements).to.have.lengthOf(8);
                expect(shapes[0].bends).to.have.lengthOf(1);
            });
        });
    });


    describe('separateShapesByIntersect',function(){
        it('one line', function () {
            let doc = new Document();
            doc.addElement(new LineElement(new Point(-5,-5), new Point(5, 5)));
            let builder = new ShapeBuilder(doc)
            let shapes = builder.buildShapes();
            shapes = builder.separateShapesByIntersect(shapes[0]);
            expect(shapes).to.have.lengthOf(1);
            return expect(shapes[0].elements, 'The shape must have 1 element').to.have.lengthOf(1);
        });

        it('two rect', function () {
            let doc = new Document();
            doc.addElement(new RectElement(new Point(-5, -5), new Point(5, 5)).toElement());
            let rectElement = new RectElement(new Point(), new Point(10, 10)).toElement();


            doc.addElement(rectElement);

            let shape = new Shape();
            for (let el of rectElement.elements) {
                shape.addElement(el);
            }

            let shapes = new ShapeBuilder(doc).separateShapesByIntersect(shape);
            return expect(shapes).to.have.lengthOf(2);
        });

    });

});