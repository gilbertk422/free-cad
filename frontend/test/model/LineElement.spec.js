/**
 * Created by dev on 07.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var assert = require('assert');

import LineElement from '../../src/model/elements/LineElement';
import Point from '../../src/model/math/Point';

describe('LineElement', function() {
    describe('angle', function(){
        it('LineElement(new Point(0,-10), new Point(0,10)) must have angle 90', function () {
            let line  = new LineElement(new Point(0,-10), new Point(0,10));

            let angle = line.angle;

            assert.equal(angle, 90);
        });
    });

    describe('isBelongsToTheElement', function(){
        it('Point(0,3) is belong LineElement(new Point(0,-10), new Point(0,10))', function () {
            let line  = new LineElement(new Point(0,-10), new Point(0,10));
            assert(line.isBelongsToTheElement(new Point(0,3)));
        });

        it('Point(0,30) isn\'t belong LineElement(new Point(0,-10), new Point(0,10))', function () {
            let line  = new LineElement(new Point(0,-10), new Point(0,10));
            assert(!line.isBelongsToTheElement(new Point(0,30)));
        });
    });

    describe('is overlapping', function () {
        it('full overlap', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(2,2), new Point(8,8));

            assert(l1.isOverlapping(l2,0));
        });

        it('full overlap with equals end', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(2,2), new Point(10,10));

            assert(l1.isOverlapping(l2,0));
        });

        it('part overlap', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(5,5), new Point(15,15));

            assert(l1.isOverlapping(l2,0));
        });

        it('end first is start second', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(10,10), new Point(15,15));

            assert(!l1.isOverlapping(l2,0));
        });

        it('not overlap but collinear', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(15,15), new Point(25,25));

            assert(!l1.isOverlapping(l2,0));
        });

        it('not overlap but parallel', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(-3,-4), new Point(5,4));

            assert(!l1.isOverlapping(l2,0));
        });

        it('two equals line', function () {
            let l1 = new LineElement(new Point(0,0), new Point(10,10));
            let l2 = new LineElement(new Point(0,0), new Point(10,10));

            assert(l1.isOverlapping(l2,0));
        });

        it('test error 1', function () {
            let l1 = new LineElement(new Point(0,10), new Point());
            let l2 = new LineElement(new Point(0,10), new Point(0,5));

            assert(l1.isOverlapping(l2,0));
        });
    });

    describe('inNear', function () {
        it('should be Near Point', function () {
            let line = new LineElement(new Point(121.539532, -70.375535), new Point(157.507794, -70.375535));
            let testPoint = new Point(151.048486, -70.375535);

            return assert(line.isNear(testPoint, 1E-4));
        });
    });
});