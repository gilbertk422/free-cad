import Color from "./Color";

/**
 * The class implemented {@class Cloneable}
 */
export default class Finish{

    /**
     * @return {Material[]}
     */
    static listOfFinishes(){
        let response = Helper.Request.httpGet('/resources/data/Data4iRFQ.json');

        let finisheIds = [118, 65, 151, 1];
        var finishes = JSON.parse(response).Finishes.map(f=>Object.assign(new Finish, f)).filter(f=>finisheIds.includes(f.id));

        /** @type {Array<{Finis}>} */
        let powder = finishes.filter(f=>f.id==118);

        let black = powder[0].copy();
        black.specialColor = new Color("Black", 'RAL 9005 Jet Black');
        black.showName = "Powder Coat - Black";

        let white = powder[0].copy();
        white.specialColor = new Color('White', 'RAL 9010 Pure White');
        white.showName = "Powder Coat - White";

        let blue = powder[0].copy();
        blue.specialColor = new Color('Metallic blue', 'RAL 5015 Sky Blue');
        blue.showName = "Powder Coat - Metallic Blue";

        let res = finishes.filter(f=>f.id!=118);
        return [...res ,black, white, blue];
    }


    static STANDARD_COLOR_RAL = 'RAL Color';

    constructor(){
        this.id= -1;
        this.name = "Select a Finish";
        this.fullName = "Select a Finish";
        this.type = "";

        this.standardColor = Finish.STANDARD_COLOR_RAL;

        /** @type {Color} */
        this.specialColor = null;

        this.showName = null;
    }


    isCompatible(material){
        let materialId = material.id;
        if(materialId==-1){
            return true;
        }

        let response = Helper.Request.httpGet('/resources/data/Data4iRFQ.json');

        let fin = (JSON.parse(response).Compatible.filter(c=>c.MaterialId==materialId))[0];
        if(!fin){
            return false;
        }

        let finishes = fin.FinishesIds;

        for(let f of finishes){
            if(f==this.id){
                return true;
            }
        }
        return false;
    }

    generateViewName(){
        switch (this.id) {
            case 118:
                if(this.specialColor) {
                    switch (this.specialColor.value) {
                        case 'RAL 9005 Jet Black':
                            this.showName = "Powder Coat - Black"
                            break;
                        case 'RAL 9010 Pure White':
                            this.showName = "Powder Coat - White"
                            break;
                        case 'RAL 5015 Sky Blue':
                            this.showName = "Powder Coat - Metallic Blue"
                            break;
                    }
                    break;
                }
            default:
                this.showName = Finish.listOfFinishes().filter(f=>f.id==this.id)[0].showName;
        }
    }

    /**
     * @returns {Finish}
     */
    copy(){
        let res = new Finish();
        res.id=this.id;
        res.name=this.name;
        res.fullName=this.fullName;
        res.type=this.type;
        res.showName=this.showName;
        if(this.specialColor) {
            res.specialColor = this.specialColor.copy();
        }
        res.standardColor=this.standardColor;
        return res;
    }
}