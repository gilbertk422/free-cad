/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * The class implemented {@class Cloneable}
 */
export default class Address{

    static getListStates(countryName){
        switch (countryName) {
            case "U.S.A.":
                return [
                    "", "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO",
                    "MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
                ];
            case 'Canada':
                return [
                    "", "AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"
                ];
            default:
                return null;
        }
    }

    static _countryNameList = null;

    static get countries() {
        if (Address._countryNameList == null) {
            let response = Helper.Request.httpGet('/resources/data/CountryList.json');
            Address._countryNameList = JSON.parse(response).map(c => c.name);
        }
        return Address._countryNameList;
    }

    static getCountryCode(countryName){
        let response = Helper.Request.httpGet('/resources/data/CountryList.json');
        return (JSON.parse(response).filter(c => c.name==countryName))[0].alpha2code;
    }

    constructor(){

        /** @type {string} */
        this.country = "U.S.A.";

        /** @type {string} */
        this.state = "";

        /** @type {string} */
        this.city = "";

        /** @type {string} */
        this.street = "";

        /** @type {string} */
        this.zipCode = "";
    }

    copy(){
        let res = new Address();
        res.country=this.country;
        res.state=this.state;
        res.city=this.city;
        res.street=this.street;
        res.zipCode=this.zipCode;
        return res;
    }

}