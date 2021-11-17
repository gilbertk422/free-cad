/**
 * Created by dev on 20.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var assert = require('assert');

import LineElement from './../../src/model/elements/LineElement';
import Arc from './../../src/model/elements/Arc';
import Point from './../../src/model/math/Point';

import LineArc from './../../src/model/math/algorithms/intersects/LineArc';

let intersector = new LineArc();

describe('LineArc', function () {
    describe('Circle', function(){

        it(`intersect Line(Point(-10, -10), Point(10, 10)) with the Arc(Point(0,0), 5) is two points`, function () {
            let line  = new LineElement(new Point(-10,-10), new Point(10,10));
            let circle = new Arc(new Point(), 5);

            let points = intersector.getIntersectPoints(line, circle);

            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(8),(5*Math.cos(Math.PI/4)).toFixed(8));
            assert.equal(points[0].y.toFixed(8),(5*Math.sin(Math.PI/4)).toFixed(8));

            assert.equal(points[1].x.toFixed(8),(-5*Math.cos(Math.PI/4)).toFixed(8));
            assert.equal(points[1].y.toFixed(8),(-5*Math.sin(Math.PI/4)).toFixed(8));
        });

        it(`intersect Line(Point(0, -10), Point(0, 10)) with the Arc(Point(0,0), 3) is two points`, function () {
            let line  = new LineElement(new Point(0,-10), new Point(0,10));
            let circle = new Arc(new Point(), 3);

            let points = intersector.getIntersectPoints(line, circle);

            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(8),0);
            assert.equal(points[0].y.toFixed(8),3);

            assert.equal(points[1].x.toFixed(8),0);
            assert.equal(points[1].y.toFixed(8),-3);
        });

        it(`intersect Line(Point(-10, 0), Point(10, 0)) with the Arc(Point(0,0), 3) is two points`, function () {
            let line  = new LineElement(new Point(-10,0), new Point(10,0));
            let circle = new Arc(new Point(), 3);

            let points = intersector.getIntersectPoints(line, circle);

            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(8),3);
            assert.equal(points[0].y.toFixed(8),0);

            assert.equal(points[1].x.toFixed(8),-3);
            assert.equal(points[1].y.toFixed(8),0);
        });

        it(`intersect Line(Point(5, 5), Point(-5, -5)) witch moved on the radius with the Arc(Point(0,0), 5) is one points`, function () {
            let line  = new LineElement(new Point(5,5), new Point(-5,-5));
            line.move(3*Math.cos(Math.PI*0.75), 3*Math.sin(Math.PI*0.75));

            let circle = new Arc(new Point(), 3);

            let points = intersector.getIntersectPoints(line, circle);
            assert.equal(points.length, 1);
            assert.equal(points[0].x.toFixed(8),(3*Math.cos(Math.PI*0.75)).toFixed(8));
            assert.equal(points[0].y.toFixed(8),(3*Math.sin(Math.PI*0.75)).toFixed(8));

        });

        it('intersect Line(Point(130.99955016716146, -60.27173383060068), Point(130.99955016716146, -51.408202291056114)) ' +
            'with Arc(Point(132.99955016716152, -53.40820229105614), 2) is one point', function(){
            let circle = new Arc(new Point(132.99955016716152, -53.40820229105614), 2);
            let line = new LineElement(new Point(130.99955016716146, -51.408202291056114),
                                       new Point(144.20011295946424, -51.408202291056085));

            let points = intersector.getIntersectPoints(line, circle);
            assert.equal(points.length, 1);
        });

        it(`intersect Line(Point(6, 1), Point(4, 7)) witch the Arc(Point(5,4), sqrt(10)) is two points`, function () {
            let line  = new LineElement(new Point(6,1), new Point(4,7));
            let circle = new Arc(new Point(5,4), Math.sqrt(10));

            let points = intersector.getIntersectPoints(line, circle);
            assert.equal(points.length, 2);
            assert.equal(points[0].x.toFixed(8),6);
            assert.equal(points[0].y.toFixed(8),1);

            assert.equal(points[1].x.toFixed(8),4);
            assert.equal(points[1].y.toFixed(8),7);

        });

        it(`intersect Line(Point(5, -5), Point(5, 5)) with the Arc(Point(0,0), 3) is 0 points`, function () {

            let line  = new LineElement(new Point(5,-5), new Point(5,5));
            let circle = new Arc(new Point(), 3);

            let points = intersector.getIntersectPoints(line, circle);

            assert.equal(points.length, 0);
        });

        it(`intersect Line(Point(5, -5), Point(6, 5)) with the Arc(Point(0,0), 3) is 0 points`, function () {

            let line  = new LineElement(new Point(5,-5), new Point(6,5));
            let circle = new Arc(new Point(), 3);

            let points = intersector.getIntersectPoints(line, circle);

            assert.equal(points.length, 0);
        });

        it(`t1 intersect Line with the Arc is two points`,function(){
            let line = new LineElement(new Point(-81.05284090254102, -2.6849626246029494),
                new Point(-30.271783528768225, -2.6849626246029494));
            let arc = new Arc(new Point(-55.550459666373186, -17.561351679034182), 26.84670898092727);

            let points = intersector.getIntersectPoints(line,arc);
            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(4),(-33.2023).toFixed(4));
            assert.equal(points[0].y.toFixed(4),(-2.685).toFixed(4));

            assert.equal(points[1].x.toFixed(4),(-77.8986).toFixed(4));
            assert.equal(points[1].y.toFixed(3),(-2.685).toFixed(3));
        });


        it('error test 1', function () {
            let line  = new LineElement(new Point(40.795188377534174, 24.769781859279803), new Point(40.79518837753416, 11.73151843758905));
            let arc = new Arc(new Point(39.67389393355712, 18.250650148434428), 2);

            let points = intersector.getIntersectPoints(line,arc);

            assert.strictEqual(points.length, 2);
        });
    });

    describe('Arc', function () {
        it(`intersect Line(Point(-10, -10), Point(10, 10)) with the Arc(Point(0,0), 5) startAngle 0 and increment is 90 degrees is one points`, function () {
            let line = new LineElement(new Point(-10, -10), new Point(10, 10));
            let arc = new Arc(new Point(), 5);
            arc.startAngle = 0;
            arc.incrementAngle = 90;
            let points = intersector.getIntersectPoints(line, arc);
            assert.equal(points.length, 1);
            assert.equal(points[0].x.toFixed(8), (5 * Math.cos(Math.PI / 4)).toFixed(8));
            assert.equal(points[0].y.toFixed(8), (5 * Math.sin(Math.PI / 4)).toFixed(8));
        });
    });

});