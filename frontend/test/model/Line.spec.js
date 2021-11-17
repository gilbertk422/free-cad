/**
 * Created by dev on 06.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
var assert = require('assert');

import Line from '../../src/model/math/Line';
import Point from '../../src/model/math/Point';

describe('Line', function() {
    describe('getCrossPoint with Line', function() {
        it('Line(Point(-10, -10), Point(10, 10))   is cross the Line(Point(-10, 10), Point(10,-10)) in the Point(0,0)', function () {
            let line1  = new Line(new Point(-10,-10), new Point(10,10));
            let line2  = new Line(new Point(-10,10), new Point(10,-10));

            let crossPoint = line1.getCrossPoint(line2);
            assert(crossPoint.compare(new Point()));
        });

        it('Line(Point(-10, -10), Point(10, 10)) is cross the Line(Point(0, 5), Point(5,0)) in the Point(2.5,2.5)', function () {
            let line1  = new Line(new Point(-10,-10), new Point(10,10));
            let line2  = new Line(new Point(0,5), new Point(5,0));

            let crossPoint = line1.getCrossPoint(line2);
            assert(crossPoint.compare(new Point(2.5,2.5)));
        });

        it('Line(Point(-10, -10), Point(10, 10)) isn\'t cross the Line(Point(0, 50), Point(50,0))', function () {
            let line1  = new Line(new Point(-10,-10), new Point(10,10));
            let line2  = new Line(new Point(0,50), new Point(50,0));

            let crossPoint = line1.getCrossPoint(line2);
            assert.ifError(crossPoint); //true if crossPint is null
        });

        it('Line(Point(-10, -10), Point(10, 10)) is cross the Line(Point(10, 10), Point(50,0)) in the Point(10,10)', function () {
            let line1  = new Line(new Point(-10,-10), new Point(10,10));
            let line2  = new Line(new Point(10,10), new Point(50,0));

            let crossPoint = line1.getCrossPoint(line2);
            assert(crossPoint.compare(new Point(10,10)));
        });

        it('endpoint lin2 is the point of line1', function () {
            let point = new Point(121.21795581005529, -92.33480959308389);
            let line1 = new Line(new Point(259.45685104815055, -92.33480959308389), new Point(88.63240660370614, -92.33480959308389));
            let line2 = new Line(point, new Point(100, 100));

            let crossPoint = line1.getCrossPoint(line2);
            assert(crossPoint.compare(point));
        });
    });

    describe('A', function(){
        it('for Line(Point(6, 1), Point(4, 7)) A is 6', function () {
            let line  = new Line(new Point(6, 1), new Point(4, 7));
            assert.equal(line.A, 6);
        });
    });

    describe('B', function(){
        it('for Line(Point(6, 1), Point(4, 7)) B is -2', function () {
            let line  = new Line(new Point(6, 1), new Point(4, 7));
            assert.equal(line.B, -2);
        });
    });

    describe('C', function(){
        it('for Line(Point(6, 1), Point(4, 7)) C is 38', function () {
            let line  = new Line(new Point(6, 1), new Point(4, 7));
            assert.equal(line.C, 38);
        });
    });

    describe('b', function(){
        it('for Line(Point(6, 1), Point(4, 7)) b is 38', function () {
            let line  = new Line(new Point(6, 1), new Point(4, 7));
            assert.equal(line.b, 19);
        });
    });

    describe('isParallel', function(){
        it('cross by 90 degrees', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));
            let l2 = new Line(new Point(-5,-5), new Point(5,5));

            assert.equal(l1.isParallel(l2), false);
            assert.equal(l2.isParallel(l1), false);
        });
        it('two parallel lines', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));
            let l2 = new Line(new Point(-5,6), new Point(5,-4));

            assert.equal(l1.isParallel(l2), true);
            assert.equal(l2.isParallel(l1), true);
        });
    });
    describe('isOverlapping', function(){
        it('cross by 90 degrees', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));
            let l2 = new Line(new Point(-5,-5), new Point(5,5));

            assert.equal(l1.isOverlapping(l2), false);
            assert.equal(l2.isOverlapping(l1), false);
        });
        it('two parallel lines', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));
            let l2 = new Line(new Point(-5,6), new Point(5,-4));

            assert.equal(l1.isOverlapping(l2), false);
            assert.equal(l2.isOverlapping(l1), false);
        });
        it('one line', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));

            assert.equal(l1.isOverlapping(l1), true);
        });
        it('two overlapping lines', function(){
            let l1 = new Line(new Point(-5,5), new Point(5,-5));
            let l2 = new Line(new Point(), new Point(10,-10));

            assert.equal(l1.isOverlapping(l2), true);
            assert.equal(l2.isOverlapping(l1), true);
        });

        it('two parallel lines with k==0', function(){
            let l1 = new Line(new Point(0,5), new Point(10,5));
            let l2 = new Line(new Point(0,0), new Point(10,0));

            assert.equal(l1.isOverlapping(l2), false);
            assert.equal(l2.isOverlapping(l1), false);
        });

        it('two parallel lines with b==0', function(){
            let l1 = new Line(new Point(5,5), new Point(5,-5));
            let l2 = new Line(new Point(-5,-5), new Point(-5,5));

            assert.equal(l1.isOverlapping(l2), false);
            assert.equal(l2.isOverlapping(l1), false);
        });

        it('two overlapping lines 1', function(){
            let l1 = new Line(new Point(0, -5), new Point(0,5));
            let l2 = new Line(new Point(0, 5), new Point(0,2));

            assert.equal(l1.isOverlapping(l2), true);
            assert.equal(l2.isOverlapping(l1), true);
        });
        it('two overlapping lines 2', function(){
            let y =  -8.673617379884035e-19;
            let l1 = new Line(new Point(-2.5, y), new Point(4,0));
            let l2 = new Line(new Point(-1,0), new Point(-2.5, y));

            assert.equal(l1.isOverlapping(l2), true);
            assert.equal(l2.isOverlapping(l1), true);
        });
    });

    describe('isBelongsToTheElement', function () {
        it('Line(Point(130.99955016716146, -51.408202291056114), Point(144.20011295946424, -51.408202291056085)) should be belong to the Point(132.99955016716152, -51.408202291056114,)', function () {
            let point = new Point(132.99955016716152, -51.408202291056114);
            let line = new Line(new Point(130.99955016716146, -51.408202291056114), new Point(144.20011295946424, -51.408202291056085));

            assert(line.isBelongsToTheLine(point));
        });
    });

    describe('distanceTo', function () {
        it('should be Near Point', function () {
            let line = new Line(new Point(121.539532, -70.375535), new Point(157.507794, -70.375535));
            let testPoint = new Point(151.048486, -70.375535);

            return assert(line.distanceTo(testPoint)==0);
        });
    });


    describe('perpendicularPoint', function () {
        it('should be 0,0', function () {
            let line = new Line(new Point(-5, -5), new Point(5, 5));

            let perpendicular = line.perpendicularPoint(new Point(-5, 5));

            assert(Helper.Math.equals(perpendicular.x, 0));
            assert(Helper.Math.equals(perpendicular.y, 0));
        });

        it('test 2', function () {
            let line = new Line(new Point(-5, 0), new Point(5, 0));

            let perpendicular = line.perpendicularPoint(new Point(0, 5));

            assert(perpendicular.x==0);
            assert(perpendicular.y==0);
        });
    });

    describe('getParallels', function () {
        it(' test 1', function () {
            let line = new Line(new Point(-252.15744950427205, 83.76957721668505), new Point(-252.15744950427205, 19.705132772240606));
            let paralels = line.getParallels(5);
            assert(Helper.Math.equals(paralels[0]._p1.x, -257.15744950427205));
            assert(Helper.Math.equals(paralels[0]._p1.y, 83.76957721668505));
        })
    })
});