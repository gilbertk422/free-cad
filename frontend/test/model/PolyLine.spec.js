/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
var chai = require('chai');
var expect = chai.expect;

import PolyLine from "../../src/model/math/PolyLine";
import Point from "../../src/model/math/Point";


describe("PolyLine", function(){
    describe('getCrossPoints', function () {
        it("test 1", function () {
            let p1 = new PolyLine([
                new Point(5,-5),
                new Point(-5,-5),
                new Point(),
                new Point(5,-5),
            ]);

            let p2 = new PolyLine([
                new Point(8,-3),
                new Point(-2,-3),
                new Point(3,2),
                new Point(8,-3),
            ]);

            let points = p1.getCrossPoints(p2);

            expect(points).to.has.lengthOf(2);
        });

    });
});