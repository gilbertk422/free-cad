import Rule from "../Rule";
import NoChangesSolution from "../solutions/NoChanges";


export default class DrawingHasMachine extends Rule{


    constructor(document){
        super(document);

        /** @type {string} */
        this.errorMessage = "ERROR: Please create lines of type Auto.";
    }

    /**
     * @return {boolean} - true if the document has an error
     * @abstract
     */
    check(){
        let elements = this.document.getListSimpleElements();
        for(let el of elements){
            if(el.lineType.name == "Auto"){
                return false;
            }
        }
        return true;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        return [];
    }
}