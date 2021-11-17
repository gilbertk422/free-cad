/**
 * Created by dev on 26.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;


import Arc from '../../src/model/elements/Arc';
import Trigonometric from '../../src/model/math/Trigonometric';
import Point from '../../src/model/math/Point';

import ChangeArcAngleCommand from '../../src/command/ChangeArcAngleCommand';

describe('Arc', function() {
    describe('set inside angle', function() {
        it('arc start 0, end 45 after setting inside angle to 90 must be started 0 and ended 90', function() {
            let arc = new Arc(new Point(10,10), 5);
            arc.startAngle=0;
            arc.endAngle=45;

            let command = new ChangeArcAngleCommand(null, [arc],90, null);
            command.executeCommand();

            assert.equal(arc.startAngle, 0);
            assert.equal(arc.endAngle, 90);
        });

    });

    describe('isBelongsToTheElement', function(){
        it('Point(0,5) is belong to the Circle(new Point(0,0), 5)', function () {
            let circle  = new Arc(new Point(), 5);
            assert(circle.isBelongsToTheElement(new Point(0,5)));
        });
        it('Point(0,5) is belong to the Circle(new Point(0,0), 5)', function () {
            let circle  = new Arc(new Point(), 5);
            assert(circle.isBelongsToTheElement(new Point(Math.cos(Math.PI/4)*5,Math.sin(Math.PI/4)*5)));
        });
    });

    describe('sortPointByTheArc', function(){
       it(`t1`, function(){
           let points = [
               new Point(33.77920006066877, -40.56882737176237),   //00
               new Point(33.77920006066877, -46.69500072876092),   //11
               new Point(32.36289005878956, -48.481914050261636),  //22
               new Point(22.379200060668776, -46.69500072876099),  //43
               new Point(22.379200060668776, -40.568827371762296), //54
               new Point(23.795510062547983, -38.78191405026163),  //65
               new Point(23.79551006254797, -48.481914050261636),  //36
               new Point(32.362890058789546,-38.78191405026163)    //77
           ];

           let sort = [
               new Point(33.77920006066877, -46.69500072876092),
               new Point(32.36289005878956, -48.481914050261636),
               new Point(23.79551006254797, -48.481914050261636),
               new Point(22.379200060668776, -46.69500072876099),
               new Point(22.379200060668776, -40.568827371762296),
               new Point(23.795510062547983, -38.78191405026163),
               new Point(32.362890058789546,-38.78191405026163),
               new Point(33.77920006066877, -40.56882737176237)
           ];
           let arc = new Arc(new Point(28.079200060668764, -43.63191405026164), 6.4708963830369015);

           let sortPoints = arc.sortPointByTheArc(points);

           for(let i=0; i<points.length; i++) {
               assert.equal(sortPoints[i].compare(sort[i]), true, `element ${i} isn't correct must be: ${sort[i].x}:${sort[i].y} but it:${sortPoints[i].x}:${sortPoints[i].y}`);
           }
       });
    });


    describe('mirror', function(){
        it('Arc(new Point(0,0), 5) start angle=45, increment 45 after mirror by OX must be start angle=90, increment 45', function () {
            let arc  = new Arc(new Point(), 5);
            arc.startAngle=45;
            arc.incrementAngle=45;

            arc.mirror(Trigonometric.axisX, arc.center);

            assert.equal(arc.startAngle,90);
            assert.equal(arc.incrementAngle,45);
        });
        it('Arc(new Point(0,0), 5) start angle=0, increment 45 after mirror by OX must be start angle=135, increment 45', function () {
            let arc  = new Arc(new Point(), 5);
            arc.startAngle=0;
            arc.incrementAngle=45;

            arc.mirror(Trigonometric.axisX, arc.center);

            assert.equal(arc.startAngle,135);
            assert.equal(arc.incrementAngle,45);
        });

        it('Arc(new Point(0,0), 5) start angle=45, increment 45 after mirror by OY must be start angle=270, increment 45', function () {
            let arc  = new Arc(new Point(), 5);
            arc.startAngle=45;
            arc.incrementAngle=45;

            arc.mirror(Trigonometric.axisY, arc.center);

            assert.equal(arc.startAngle,270);
            assert.equal(arc.incrementAngle,45);
        });
        it('Arc(new Point(0,0), 5) start angle=0, increment 45 after mirror by OY must be start angle=315, increment 45', function () {
            let arc  = new Arc(new Point(), 5);
            arc.startAngle=0;
            arc.incrementAngle=45;

            arc.mirror(Trigonometric.axisY, arc.center);

            assert.equal(arc.startAngle,315);
            assert.equal(arc.incrementAngle,45);
        });
    });

    describe('getExtrenum', function(){
        it('Arc(Point(0,0), 5) startAngle=270 insideAngle=90', function(){
            let arc = new Arc(new Point(), 5);
            arc.startAngle=270;
            arc.incrementAngle=90;

            let extrenum = arc.getExtrenum();

            expect(extrenum.max.x, "extrenum max x is invalid").to.be.closeTo(5, 2);
            expect(extrenum.max.y, "extrenum max y is invalid").to.be.closeTo(0, 2);
            expect(extrenum.min.x, "extrenum min x is invalid").to.be.closeTo(0, 2);
            expect(extrenum.min.y, "extrenum min y is invalid").to.be.closeTo(-5, 2);
        })
    })

    describe('toPolyLines', function () {
        it('test 1', function () {
            let arc = new Arc(new Point(88.63240660370614, -87.33480959308389), 5);
            arc.startAngle=180;
            arc.incrementAngle=90;

            let p0 = new Point(83.63240660370614, -87.33480959308389);
            let p2 = new Point(88.63240660370614, -92.33480959308389);

            let points = arc.toPolyLines(20)[0].points;
            let i=20;
            expect(Helper.Math.equals(points[0].x, p0.x, 1E-5), "x is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[0].y, p0.y, 1E-5), "y is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[points.length-1].x, p2.x, 1E-5), "x2 is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[points.length-1].y, p2.y, 1E-5), "y2 is invalid for i="+i).to.be.true;
        });

        it('test 2', function () {
            let arc = new Arc(new Point(), 5);
            arc.startAngle=180;
            arc.incrementAngle=90;

            let p0 = new Point(-5,0);
            let p2 = new Point(0, -5);

            let points = arc.toPolyLines(5)[0].points;
            let i=5;
            expect(Helper.Math.equals(points[0].x, p0.x, 1E-5), "x is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[0].y, p0.y, 1E-5), "y is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[points.length-1].x, p2.x, 1E-5), "x2 is invalid for i="+i).to.be.true;
            expect(Helper.Math.equals(points[points.length-1].y, p2.y, 1E-5), "y2 is invalid for i="+i).to.be.true;


        });
    });

    describe('getPointOffset', function () {
        it('0.5 for circle', function () {
            let arc = new Arc(new Point(), 5);
            let offset = arc.getPointOffset(0.5);
            expect(offset.x).to.be.closeTo(-5, 1E-5);
            expect(offset.y).to.be.closeTo(0, 1E-5);
        });

        it('0.5 for arc 180', function () {
            let arc = new Arc(new Point(), 5);
            arc.incrementAngle=180;

            let offset = arc.getPointOffset(0.5);
            expect(offset.x).to.be.closeTo(0, 1E-5);
            expect(offset.y).to.be.closeTo(5, 1E-5);
        });

        it('0.5 for arc 180 and start 90', function () {
            let arc = new Arc(new Point(), 5);
            arc.startAngle=90;
            arc.incrementAngle=180;

            let offset = arc.getPointOffset(0.5);
            expect(offset.x).to.be.closeTo(-5, 1E-5);
            expect(offset.y).to.be.closeTo(0, 1E-5);
        });


        it('0.75 for arc 180 and start 270', function () {
            let arc = new Arc(new Point(), 5);
            arc.startAngle=270;
            arc.incrementAngle=180;

            let offset = arc.getPointOffset(0.75);
            expect(offset.x).to.be.closeTo(Math.cos(Math.PI*0.25)*5, 1E-5);
            expect(offset.y).to.be.closeTo(Math.sin(Math.PI*0.25)*5, 1E-5);
        });
    })
});
