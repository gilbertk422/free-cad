/**
 * Created by dev on 06.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Corner from "../../src/command/Corner";

var assert = require('assert');


import Document from '../../src/model/Document';
import LineElement from '../../src/model/elements/LineElement';
import RectElement from '../../src/model/elements/RectElement';
import Point from '../../src/model/math/Point';


describe('Corner', function() {
    describe('Line & Line', function() {
        describe('corner lines by 90 degrees', function () {
            /**
             *
             */
            it(`after corner two lines the document must contain 3 lines`, function () {
                let line1 = new LineElement(new Point(130.99955016716146, -51.408202291056114), new Point(144.20011295946424, -51.408202291056085));
                let line2 = new LineElement(new Point(130.99955016716146, -60.27173383060068), new Point(130.99955016716146, -51.408202291056114));

                let doc = new Document();
                doc.addElement(line1);
                doc.addElement(line2);

                let command = new Corner(doc, [line1, line2]);
                command.radius=2;
                command.executeCommand();

                assert.equal(doc._elements.length, 3);
            });
            it(`test1`, function () {
                let line1 = new LineElement(new Point(0,0), new Point(0,10));
                let line2 = new LineElement(new Point(0,0), new Point(10,0));

                let doc = new Document();
                doc.addElement(line1);
                doc.addElement(line2);

                let command = new Corner(doc, [line1, line2]);
                command.radius=2;
                command.executeCommand();

                assert.equal(doc._elements.length, 3);
            });
            it('should be grouped', function () {
                let line1 = new LineElement(new Point(0,0), new Point(0,10));
                let line2 = new LineElement(new Point(0,0), new Point(10,0));
                let rec = new RectElement(new Point(), new Point(10,10)).toElement();
                let doc = new Document();
                doc.addElement(rec);
                
                let command = new Corner(doc, [line1, line2]);
                command.radius=2;
                command.executeCommand();
                
                assert.equal(doc._elements.length, 1);
            });
        });
    });
});