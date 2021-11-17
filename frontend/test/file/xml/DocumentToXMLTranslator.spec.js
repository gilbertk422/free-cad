/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Document from "../../../src/model/Document";
import RectElement from "../../../src/model/elements/RectElement";
import Point from "../../../src/model/math/Point";
import LineElement from "../../../src/model/elements/LineElement";
import BendLineType from "../../../src/model/line_types/Bend";
import DocumentToXMLTranslator from "../../../src/file/xml/DocumentToXMLTranslator";

var chai = require('chai');
var expect = chai.expect;
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var file = chaiFiles.file;


describe('DocumentToXMLTranslator', function() {
    describe("convert rect with bend", function(){
        it('test file 1', function(){
            let doc = new Document();
            doc.addElement(new RectElement(new Point(-5, 5), new Point(5, -5)).toElement());
            let bend = new LineElement(new Point(0, 5), new Point(0, -5));
            bend.lineType=new BendLineType();
            doc.addElement(bend);

            let translator = new DocumentToXMLTranslator(doc);

            let xml = translator.getXml();

            return expect(xml).to.equal(file('./test_data/testFile_1.emsx'));
        })
    })
});