import Font from "./Font";

import f from './specialFont.json';

let characters = [];

for(let symbol of f.characters){
    characters[symbol.char.code]=symbol;
}

export default class FontManager{

    /**
     * @param code
     * @return {{char:{code:number, symbol:string, stroke:Array<{x:number, y:number}>}, right:number, center:number}}
     */
    static getCharacter(code){
        return characters[code];
    }

    /**
     *
     * @param {string} text
     * @param {number} fontSize
     * @return {number}
     */
    static defaltFontTextWidth(text, fontSize){
        let right = 0;
        for(let s=0; s<text.length; s++) {
            let symbol = FontManager.getCharacter(text.charCodeAt(s));
            right+=symbol.right*fontSize*0.01;
        }
        return right;
    }

    constructor(){
        this.fonts = [
            new Font("eMachineShop Laser 1", "resources/fonts/eMachineShop/eMachineShop Laser 1.ttf"),
            new Font("Ani", "resources/fonts/Ani.ttf"),
            new Font("Open-sans regular", "resources/fonts/open-sans/OpenSans-Regular.ttf"),
            new Font("Open-sans italic", "resources/fonts/open-sans/OpenSans-Italic.ttf")
        ];
    }

    /**
     * @param {string|null} name - (if null will return default font)
     * @return {Font|Promise|null} - null if font not found, Promise if font is not loaded yet
     */
    getFont(name=null){
        let res= null;
        if(!name){
            res = this.fonts[0];
        }else{
            for(let font of this.fonts){
                if(font.name==name){
                    res = font;
                    break;
                }
            }
        }

        if(res && !res.isLoad && !res.isLoading){
            return res.load();
        }
        return res;
    }


}