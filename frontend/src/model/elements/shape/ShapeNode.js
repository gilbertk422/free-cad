import GraphicElement from '../../GraphicElement'

export default class ShapeNode{
    constructor(shape){
        /** @type {Shape} */
        this.shape=shape;

        /** @type {Array<ShapeNode>} */
        this.children = [];

    }

    addChild(shape){
        for(let child of this.children){
            if(child.addChild(shape)){
                return true;
            }
        }
        if(this.shape.isContain(shape)){
            this.children.push(new this.constructor(shape));
            return true;
        }
        return false;
    }

    setBaseLine(value){
        let height = this.shape.height;

        if(height<0) {
            if(height==GraphicElement.AirInside){
                this.shape.baseZ=-Math.abs(GraphicElement.AirInside)/2;
            }else {
                this.shape.baseZ = value + height;
            }
        }else{
            this.shape.baseZ = value;
        }

        for(let child of this.children){
            if(height<0) {
                child.setBaseLine(this.shape.baseZ);
            }else{
                child.setBaseLine(this.shape.baseZ+height);
            }
        }
    }

}