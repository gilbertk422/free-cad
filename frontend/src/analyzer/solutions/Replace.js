import RemoveElement from './RemoveElement'
import ReplaceElementsCommand from '../../command/ReplaceElementsCommand'

export default class Replace extends RemoveElement{

    /**
     * @param {Document} document
     * @param {Array.<GraphicElement>} elements
     * @param {Document} previewDoc
     * @param {Array.<GraphicElement>} addElements
     */
    constructor(document, elements, previewDoc, addElements){
        super(document, elements, previewDoc);
        this.addElements = addElements;
    }

    /**
     * @inheritDoc
     */
    execute(){
        return app.executeCommand(new ReplaceElementsCommand(this.document, this.addElements, this.elements));
    }

}