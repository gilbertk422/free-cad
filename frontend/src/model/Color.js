

/**
 * The class implemented {@class Cloneable}
 */
export default class Color{

    constructor(name, value){
        this.value=value;
        this.name=name;
    }

    copy(){
        let res = new Color();
        res.name=this.name;
        res.value=this.value;
        return res;
    }

}