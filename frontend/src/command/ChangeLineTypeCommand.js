/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ElementModificationCommand from './ElementModificationCommand';
import ChangeLineTypeDataValidator from "./behaviors/ChangeLineTypeDataValidator";
import ChangeFontCommand from "./ChangeFontCommand";


export default class ChangeLineTypeCommand extends ElementModificationCommand{
    /**
     * @param {Document} document
     * @param {Array.<Element>} elements
     * @param {LineType} lineType
     */
    constructor(document, elements, lineType){
        super(document, elements);

        this.lineType=lineType;

        this.name= 'ChangeLineTypeCommand';

        this.behaviors.push(new ChangeLineTypeDataValidator(this));
    }


    execute() {
        let text = this.elements.filter(e=>e.typeName=="Text");
        if(text.length>0 && this.lineType.name=="Auto") {
            return new Promise((resolve, reject) => {

                new ChangeFontCommand(this.document, text, null).execute().then((res) => {
                    if (res) {
                        super.execute().then(resolve);
                    } else {
                        resolve(false);
                    }
                });
            });
        }else{
            return super.execute();
        }
    }

    /**
     * @inheritDoc
     */
    executeCommand(){
        for(let el of this.elements) {
            el.lineType=this.lineType.copy();
        }
        return true;
    }
}