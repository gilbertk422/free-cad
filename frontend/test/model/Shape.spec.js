/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Document from "../../src/model/Document";
import RectElement from "../../src/model/elements/RectElement";
import Point from "../../src/model/math/Point";
import ShapeBuilder from "../../src/analyzer/ShapeBuilder";
import Shape from "../../src/model/elements/Shape";
import Arc from "../../src/model/elements/Arc";
import LineElement from "../../src/model/elements/LineElement";

var chai = require('chai');
var expect = chai.expect;

describe('Shape', function() {
    describe('isContain', function() {
        describe('Point', function(){
            it('Point in rect', function() {
                let doc = new Document();
                doc.addElement(new RectElement(new Point(-5,5), new Point(5, -5)).toElement());

                let shape = new ShapeBuilder(doc).buildShapes()[0];

                let res = shape.isContain(new Point());

                expect(res).to.be.true;
            });
            it('Point out rect', function() {
                let doc = new Document();
                doc.addElement(new RectElement(new Point(-5,5), new Point(5, -5)).toElement());

                let shape = new ShapeBuilder(doc).buildShapes()[0];

                let res = shape.isContain(new Point(10,10));

                expect(res).to.be.false;
            });

            it('Point in rect border', function() {
                let doc = new Document();
                doc.addElement(new RectElement(new Point(-5,5), new Point(5, -5)).toElement());

                let shape = new ShapeBuilder(doc).buildShapes()[0];

                let res = shape.isContain(new Point(0,5)) && shape.isContain(new Point(0,-5));

                return expect(res).to.be.true;
            });

            it('Point in shape with arc', function () {
                let doc = new Document();
                let arc = new Arc(new Point(88.63240660370614, -87.33480959308389), 5);
                arc.incrementAngle=90;
                arc.startAngle=180;
                doc.addElement(arc);
                doc.addElement(new LineElement(new Point(259.45685104815055, -92.33480959308389), new Point(88.63240660370614, -92.33480959308389)));
                doc.addElement(new LineElement(new Point(259.45685104815055, 16.88519040691609), new Point(259.45685104815055, -92.33480959308389)));
                doc.addElement(new LineElement(new Point(83.63240660370616, 16.88519040691609), new Point(259.45685104815055, 16.88519040691609)));
                doc.addElement(new LineElement(new Point(83.63240660370616, -87.33480959308389), new Point(83.63240660370616, 16.88519040691609)));

                let shapes = new ShapeBuilder(doc).buildShapes();
                let shape=shapes[0];

                let res = shape.isContain(new Point(121.21795581005529, -92.33480959308389));

                return expect(res).to.be.true;
            });
        });

        describe('Shape', function(){
            it('rect in rect', function(){
                let shape1 = new Shape();
                let elements = new RectElement(new Point(-5,5), new Point(5, -5)).toElement().toSimpleElements();
                for(let element of elements){
                    shape1.addElement(element);
                }

                let shape2 = new Shape();
                elements = new RectElement(new Point(-2,2), new Point(2, -2)).toElement().toSimpleElements();
                for(let element of elements){
                    shape2.addElement(element);
                }

                expect(shape1.isContain(shape2)).to.be.true;
                expect(shape2.isContain(shape1)).to.be.false;
            });

            it('rect into shape with arc', function(){
                let shape1 = new Shape();
                let elements = new RectElement(new Point(-2,2), new Point(2, -2)).toElement().toSimpleElements();
                for(let element of elements){
                    shape1.addElement(element);
                }

                let shape2 = new Shape();
                let arc = new Arc(new Point(5),5);
                arc.startAngle=270;
                arc.endAngle=90;
                shape2.addElement(arc);
                shape2.addElement(new LineElement(new Point(5,5), new Point(-5,5)));
                shape2.addElement(new LineElement(new Point(5,-5), new Point(-5,-5)));
                shape2.addElement(new LineElement(new Point(-5,5), new Point(-5,-5)));

                expect(shape2.isContain(shape1)).to.be.true;
                expect(shape1.isContain(shape2)).to.be.false;

            });

            it('shape with arc into arc', function(){
                let shape1 = new Shape();
                let element = new Arc(new Point(), 15);
                shape1.addElement(element);

                let shape2 = new Shape();
                let arc = new Arc(new Point(5),5);
                arc.startAngle=270;
                arc.endAngle=90;
                shape2.addElement(arc);
                shape2.addElement(new LineElement(new Point(5,5), new Point(-5,5)));
                shape2.addElement(new LineElement(new Point(5,-5), new Point(-5,-5)));
                shape2.addElement(new LineElement(new Point(-5,5), new Point(-5,-5)));

                expect(shape1.isContain(shape2)).to.be.true;
                expect(shape2.isContain(shape1)).to.be.false;

            });
        });

    });

    describe("IsClose", function(){
        it('one Line', function(){
            let shape = new Shape();
            shape.addElement(new LineElement(new Point(), new Point(5,5)));
            return expect(shape.isClose()).to.be.false;
        })
    });

    describe('square', function () {
        it('should be 25', function () {
            let elements = new RectElement(new Point(-5,5), new Point()).toElement().elements;
            let shape = new Shape();
            for(let el of elements){
                shape.addElement(el);
            }
            let square = shape.square;
            return expect(square).to.equals(25);
        })
    })
});