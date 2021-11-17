/**
 * Created by dev on 19.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Matrix from '../../src/model/math/Matrix';
var assert = require('assert');


describe('Matrix', function() {
    describe('add', function() {
        it('matrix add [[2,4,5]] add [[5,3,1]] must be [[7,7,6]]', function() {
            let m1 = new Matrix([[2,4,5]]);
            let m2 = new Matrix([[5,3,1]]);

            let expected = new Matrix([[7,7,6]]);
            let res = m1.add(m2);
            assert(res.compare(expected));
        });

        it('matrix add [[2,4,5]] add 5 must be [[7,9,10]]', function() {
            let m1 = new Matrix([[2,4,5]]);

            let expected = new Matrix([[7,9,10]]);
            let res = m1.add(5);
            assert(res.compare(expected));
        });
    });


    describe('equals', function() {
        it('matrix equals [[2,4,5]] and [[2,4,5]] must be equals', function() {
            let m1 = new Matrix([[2,4,5]]);
            let m2 = new Matrix([[2,4,5]]);
            assert(m1.compare(m2));
        });

        it('matrix equals [[2,4,5]] and [[2,6,5]] mustn\'t be equals', function() {
            let m1 = new Matrix([[2,4,5]]);
            let m2 = new Matrix([[2,6,5]]);
            assert(!m1.compare(m2));
        });
    });
});
