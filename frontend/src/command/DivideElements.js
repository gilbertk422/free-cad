import ElementModificationCommand from './ElementModificationCommand'
import DivideDataValidator from './behaviors/DivideDataValodator'
import DivideDialog from './behaviors/DivideDialog'

export default class DivideElements extends ElementModificationCommand{

    constructor(document, elements, countParts=2){
        super(document, elements);

        this.countParts = countParts;

        this.newElements = [];

        this.behaviors.push(new DivideDataValidator(this));
        this.behaviors.push(new DivideDialog(this));
    }

    /**
     * The method need for operation witch replacing or adding any elements.
     * For example command copy, the command creates new element so the method will return true.
     * @return {boolean} - return true if the command replacing or adding any elements
     */
    isReplacedElements(){
        return this.newElements.length>0;
    }

    /**
     * The realisation of the  @see {@link isReplacedElements} method.
     * @return {Array.<GraphicElement>|null} - new elements or null
     * @protected
     */
    getReplaceElements(){
        return this.newElements;
    }

    /**
     * The method should be extensions in children classes
     * @return {boolean} true if the command must be save in commandHistory
     * @protected
     */
    executeCommand(){
        let step = 1/this.countParts;
        for(let el of this.elements){
            let points = [];
            if(el.typeName == "Line") {
                for(let i=1; i<this.countParts; i++){
                    points.push(el._line.getPointOffset(step*i));
                }
            }else if(el.typeName == "Arc"){
                for(let i=1; i<this.countParts; i++){
                    points.push(el.getPointOffset(step*i));
                }
                if(el.incrementAngle==360){
                    points.push(el.getPointOffset(0));
                }
            }

            let newElements = el.intersectByPoints(points);
            for(let newEl of newElements){
                this.document.addElement(newEl);
            }
            this.document.removeElement(el);
            this.newElements.push(...newElements);
        }

        return true;
    }


}