/**
 * Created by dev on 26.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Document from "../../../src/model/Document";

var chai = require('chai');
var expect = chai.expect;

import LineElement from "../../../src/model/elements/LineElement";
import Group from "../../../src/model/elements/Group";
import Point from "../../../src/model/math/Point";
import ShapeCrossing from "../../../src/analyzer/rules/ShapeCrossing";
import Arc from "../../../src/model/elements/Arc";


describe("ShapeCrossing", function(){
    it("two triangle", function () {
        let doc = new Document();

        let group = new Group();

        group.addElement(new LineElement(new Point(-5,-5), new Point()));
        group.addElement(new LineElement(new Point(5,-5), new Point()));
        group.addElement(new LineElement(new Point(-5,-5), new Point(5,-5)));

        doc.addElement(group);

        let group2 = group.copy();
        group2.move(3,2);
        doc.addElement(group2);

        let rule = new ShapeCrossing(doc);

        let res = rule.check();

        return expect(res).to.be.true;
    });

    it('circle inside shape', function(){
        let doc = new Document();

        doc.addElement(new LineElement(new Point(0,-5), new Point(12,-5)));
        doc.addElement(new LineElement(new Point(0,5), new Point(12,5)));
        let arc= new Arc(new Point(), 5);
        arc.startAngle=90;
        arc.incrementAngle=180;
        doc.addElement(arc);


        arc= new Arc(new Point(12), 5);
        arc.startAngle=270;
        arc.incrementAngle=180;
        doc.addElement(arc);

        arc= new Arc(new Point(), 4);
        doc.addElement(arc);

        let rule = new ShapeCrossing(doc);

        let res = rule.check();

        return expect(res).to.be.false;
    });

});