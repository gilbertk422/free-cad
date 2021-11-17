import ShapeNode from './ShapeNode'

export default class ShapeTree{

    /**
     * @param {Array<Shape>} shapes
     * @param treeConstructor
     * @return {Array<ShapeTree>}
     */
    static buildTrees(shapes, treeConstructor = ShapeTree){
        let term = [];
        for(let i=0; i<shapes.length; i++){
            term.push({shape:i, insideIn:[]});
        }

        for(let i=0; i<term.length; i++){
            for(let j=0; j<term.length; j++){
                if(i==j){
                    continue;
                }
                if(shapes[j].isContain(shapes[i])){
                    term[i].insideIn.push(j);
                }
            }
        }

        for(let i=0; i<term.length-1; i++){
            let imin = i;
            for(let j=i+1; j<term.length; j++){
                if(term[imin].insideIn.length>term[j].insideIn.length){
                    imin=j;
                }
            }
            if(imin!=i){
                let temp = term[i];
                term[i]=term[imin];
                term[imin]=temp;
            }
        }

        let trees = [];

        m: for(let i=0; i<term.length; i++){
            if(term[i].insideIn.length==0){
                let tempTree = new treeConstructor();
                tempTree.addShape(shapes[term[i].shape]);
                trees.push(tempTree);
            }else{
                for(let tree of trees){
                    if(tree.addShape(shapes[term[i].shape])){
                        continue m;
                    }
                }
            }
        }
        return trees;
    }

    constructor(){
        /** @type {ShapeNode} */
        this.root = null;
    }

    /**
     * @param {Shape} shape
     */
    addShape(shape){
        if(!this.root){
            this.root=this.createNode(shape);
            return true;
        }else{
            return this.root.addChild(shape);
        }
    }

    calculate(){
        this.root.setBaseLine(0);
    }

    /**
     * @param shape
     * @return {ShapeNode}
     * @protected
     */
    createNode(shape){
        return new ShapeNode(shape);
    }
}