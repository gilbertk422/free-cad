

export default class Material{

    /**
     * @return {Material[]}
     */
    static listOfMaterials(){
        let response = Helper.Request.httpGet('/resources/data/Data4iRFQ.json');

        let materials = [5,241,95,96,347,20,221,298,464, 50, 40, 96, 46, 43, 463, 21, 140];
        return JSON.parse(response).Materials.map(m=>Object.assign(new Material, m)).filter(m=>materials.includes(m.id));
    }

    constructor(){
        this.id = -1;
        this.name = "Select Material";
        this.type = "";
        this.designation = "";
        this.condition = "";
        this.color = "";
        this.group = "";
        this.class = "";
        this.Recommended = false;
    }

    isCompatible(finish){
        console.log("dfgdf");
        let response = Helper.Request.httpGet('/resources/data/Data4iRFQ.json');

        let mat = (JSON.parse(response).Compatible.filter(c=>c.MaterialId==this.id))[0];
        if(!mat){
            return false;
        }

        let finishes = mat.FinishesIds;


        for(let f of finishes){
            if(f==finish.id){
                return true;
            }
        }
        return false;
    }

}