import Rule from "../Rule";
import ConvertText from "../solutions/ConvertText";


export default class NotConvertedText extends Rule{
    constructor(document){
        super(document);
        this.errorMessage = `Error: To processed, text must be converted into simple primitives.`;
    }

    /**
     * @return {boolean} - true if the document has an error
     * @abstract
     */
    check(){
        return this.getUngroupedTextByDocument(this.document)!=null;
    }


    /**
     * @return {Array.<Solution>}
     */
    createSolutions(){
        let res = super.createSolutions();

        res[0].previewDocument = this.document.getSnapshot();
        let redElements = this.getUngroupedTextByDocument(res[0].previewDocument);
        for(let redElement of redElements) {
            redElement._renderer.error = true;
        }
        res.push(this.createConvertTextSolution());
        return res;
    }


    createConvertTextSolution(){
        let texts = this.getUngroupedTextByDocument(this.document);
        return new ConvertText(this.document, texts, this.document);
    }

    /**
     * @param {Document}doc
     * @returns {null|Array.<Text>}
     */
    getUngroupedTextByDocument(doc){
        let res = [];
        let elements = doc.getListSimpleElements();
        for(let el of elements){
            if(el.typeName=="Text" && el.lineType.name=="Auto"){
                res.push(el);
            }
        }

        if(res.length==0){
            return null;
        }
        return res;
    }
}