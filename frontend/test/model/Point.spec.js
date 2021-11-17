/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

var chai = require('chai');
var expect = chai.expect;

import Point from "../../src/model/math/Point";


describe("Point", function(){
    describe("distanceTo",function(){
        it('1', function(){
            let p1 = new Point(-6.921730337728892e-15, 4);
            let p2 = new Point(3.061616997868383e-16, 5);

            return expect(p1.distanceTo(p2)).to.equal(1);
        });

        it('2', function(){
            let p1 = new Point(-6.921730337728892e-15, 4);
            let p2 = new Point(3.061616997868383e-16, 5);
            let p3 = new Point(-7.197275867537053e-14, -5);

            expect(p3.distanceTo(p1)).to.equal(9);
            expect(p2.distanceTo(p1)).to.equal(1);

            return expect(p1.distanceTo(p2)).to.equal(1);
        });

    });

});