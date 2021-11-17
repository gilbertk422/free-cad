/**
 * Created by dev on 12.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var assert = require('assert');

import Vector from '../../src/model/math/Vector';

describe('Vector', function() {
    describe('getAngle', function() {
        it('Vector(1) & Vector(0,1) is 90', function () {
            let v1  = new Vector(1);
            let v2  = new Vector(0,1);
            assert.equal(v1.getAngle(v2),90);
        });

        it('Vector(1) & Vector(1,1) is 45', function () {
            let v1  = new Vector(1);
            let v2  = new Vector(1,1);
            assert.equal(v1.getAngle(v2),45);
        });

        it('Vector(1) & Vector(-1,1) is 135', function () {
            let v1  = new Vector(1);
            let v2  = new Vector(-1,1);
            assert.equal(v1.getAngle(v2),135);
        });

        it('Vector(1) & Vector(-1,-1) is 225', function () {
            let v1  = new Vector(1);
            let v2  = new Vector(-1,-1);
            assert.equal(v1.getAngle(v2),225);
        });

        it('Vector(1, 5) & Vector(-1,-5) is 180', function () {
            let v1  = new Vector(1, 5);
            let v2  = new Vector(-1,-5);
            assert.equal(v1.getAngle(v2),180);
        });
    });

});