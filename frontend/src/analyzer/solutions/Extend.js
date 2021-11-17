import Solution from './../Solution';
import ReplaceElementsCommand from '../../command/ReplaceElementsCommand'

export default class Extend extends Solution{

    /**
     * @param {Document} document
     * @param {GraphicElement} element
     */
    constructor(document, oldElements, newElements){
        super(document);
        this.name = "Extend lines";

        this.oldElements = oldElements;
        this.newElements = newElements;

        this.previewDoc = document.getSnapshot();
        oldElements.forEach(oldElement => this.previewDoc.removeElement(oldElement));

        for (let newElement of newElements) {
            let previewElement = newElement.copy();
            previewElement._renderer.error=true;
            this.previewDoc.addElement(previewElement);
        }
    }

    /**
     * @inheritDoc
     */
    execute(){
        return new Promise((resolve, reject)=>{
            app.executeCommand(new ReplaceElementsCommand(this.document, this.newElements, this.oldElements)).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /**
     * @inheritDoc
     * @return {Document}
     */
    getPreviewDocument(){
        return this.previewDoc;
    }

}