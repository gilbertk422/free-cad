import Rule from "../Rule";
import NoChangesSolution from "../solutions/NoChanges";
import ShapeBuilder from "../ShapeBuilder";


export default class MaxZValueOfBend extends Rule{

    /**
     *
     * @param {Document} document
     */
    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "Material is too thick to bend on this one picture machine. Consider limiting material thickness to 0.25''";
    }

    /**
     * @return {boolean} - true if the document has an error
     * @abstract
     */
    check(){
        let shapeBuilder = new ShapeBuilder(this.document);
        let shapes = shapeBuilder.buildShapes();

        let shapesWithBend = shapes.filter(s=>s.bends.length>0);

        for(let shape of shapesWithBend){
            if(shape.height/25.4>0.25){
                return true;
            }
        }

        return false;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        return [
            new NoChangesSolution(this.document)
        ];
    }

}