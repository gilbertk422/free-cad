var opentype = require('opentype.js');

export default class Font{

    /**
     * @param {string} name
     * @param {string} path
     */
    constructor(name="", path=""){

        this.name = name;

        this.path=path;

        this.font=null;

        this.isLoad = false;

        this.isLoading=false;
    }

    /**
     * @return {Promise<any>}
     */
    load(){
        this.isLoading=true;
        return new Promise((resolve,reject)=>{
            opentype.load(this.path, (err, font) => {
                if(!err && font) {
                    this.font = font;
                    this.isLoad=true;
                    resolve(this);
                }else{
                    reject(err);
                }
            });
        })
    }

}