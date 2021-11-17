/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import DataHandler from './../DataHandler';
import ShapeBuilder from "../../analyzer/ShapeBuilder";
import Group from "../elements/Group";


/**
 * The class grouping all shapes to group
 */
export default class GroupShapes extends DataHandler{

    /**
     * @inheritDoc
     * @param {Document} document
     * @return {boolean} - true if the document was change
     */
    handle(document){
        let vasGroup = false;

        let shapeBuilder = new ShapeBuilder(document);
        let shapes = shapeBuilder.buildShapes();

        for(let shape of shapes){
            let elements = shape.elements;
            if(elements.length<2){
                continue;
            }
            let group = new Group();
            for(let el of elements){
                document.removeElement(el);
                group.addElement(el);
            }
            vasGroup=true;
            document.addElement(group);
        }
        return vasGroup;
    }

}