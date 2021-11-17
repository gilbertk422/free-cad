/**
 * Created by dev on 20.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var assert = require('assert');

import Arc from './../../src/model/elements/Arc';
import Point from './../../src/model/math/Point';

import ArcArc from './../../src/model/math/algorithms/intersects/ArcArc';

let intersector = new ArcArc();

describe('ArcArc', function(){
    describe('Circle',function() {
        it('Arc(Point(6,2),5) & Arc(Point(-3,2),5) intersection in the points Point(1.5, 4.1794), Point(1.5, -0.1794)', function () {
            let circle1 = new Arc(new Point(6, 2), 5);
            let circle2 = new Arc(new Point(-3,2), 5);

            let points = intersector.getIntersectPoints(circle1, circle2);

            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(4),(1.5).toFixed(4));
            assert.equal(points[0].y.toFixed(4),(4.1794).toFixed(4));

            assert.equal(points[1].x.toFixed(4),(1.5).toFixed(4));
            assert.equal(points[1].y.toFixed(4),(-0.1794).toFixed(4));

        });
        it('Arc(Point(6,6),5) & Arc(Point(-3,5),5) intersection in the points Point(1.7343, 8.6083), Point(1.2657, 7.6083)', function () {
            let circle1 = new Arc(new Point(6, 6), 5);
            let circle2 = new Arc(new Point(-3,5), 5);

            let points = intersector.getIntersectPoints(circle2, circle1);

            assert.equal(points.length, 2);

            assert.equal(points[1].x.toFixed(4),(1.7343).toFixed(4));
            assert.equal(points[1].y.toFixed(4),(3.3917).toFixed(4));

            assert.equal(points[0].x.toFixed(4),(1.2657).toFixed(4));
            assert.equal(points[0].y.toFixed(4),(7.6083).toFixed(4));

        });
        it('Arc(Point(0,0),5) & Arc(Point(5, 5),5) intersection in the points Point(0, 5), Point(5, 0)', function () {
            let circle1 = new Arc(new Point(0, 0), 5);
            let circle2 = new Arc(new Point(5, 5), 5);

            let points = intersector.getIntersectPoints(circle2, circle1);
            assert.equal(points.length, 2);

            assert.equal(points[0].x.toFixed(4),(0).toFixed(4));
            assert.equal(points[0].y.toFixed(4),(5).toFixed(4));

            assert.equal(points[1].x.toFixed(4),(5).toFixed(4));
            assert.equal(points[1].y.toFixed(4),(0).toFixed(4));

        });
    });

});