/**
 * Created by dev on 19.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var assert = require('assert');

import TangentsArcsCommand from '../../src/command/TangentsArcsCommand';

import Arc from '../../src/model/elements/Arc';
import Point from '../../src/model/math/Point';

describe('Tangents', function() {
    describe('equals arcs', function() {
        it('Arc(Point(-5),3) & Arc(Point(5),4) must have 4 tangent lines', function(){
            let arc1 = new Arc(new Point(-5),3);
            let arc2 = new Arc(new Point(5),4);

            let lines = TangentsArcsCommand.tangentsArcs(arc1, arc2);
            assert.equal(lines.length,4);
        });
    });

    describe('tangent by Point', function(){
        it('tangent Arc(Point(0,0), 5) and Point(10,5) must return two points', function(){
            let arc = new Arc(new Point(), 5);
            let point = new Point(10,5);

            let lines = TangentsArcsCommand.getTangentByPoint(arc, point);

            assert.equal(lines.length, 2);
        });
    });

});