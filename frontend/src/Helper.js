/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Observable from './Observable';
import Address from "./model/order/Address";

class WindowHelper extends Observable {

    addHandler(eventName, handler) {
        if (!this.handlers[eventName]) {
            window.addEventListener(eventName, (e) => {
                this._notifyHandlers(eventName, e);
            });
        }
        super.addHandler(eventName, handler);
    }
}

/**
 * @param accept
 * @return {Promise<File>}
 */
function openFile(accept = ".emsx") {
    return new Promise(resolve => {
        let newInput = document.createElement('input');
        newInput.setAttribute('type', 'file');
        newInput.style.display = "none";
        newInput.setAttribute('accept', accept);
        newInput.onchange = function (e) {
            console.log("change file input");
            newInput.remove();
            //todo: check count files
            resolve(this.files[0]);
        };
        newInput.click();
    });
}

class KeyHelper {
    constructor() {
        this.ctrlKey = false;
        this.shiftKey = false;
        this.meta=false;

        window.addEventListener('keydown', (e) => {
            // console.log(e.keyCode, e.key, e);
            switch (e.keyCode) {
                case 27://Escape
                    app.setTool('Pointer');
                    break;
                case 120://F9
                    app.priceAnalyze();
                    break;
                case 49://1
                    if (e.target == document.body) {
                        app.appZoomToActualSize();
                    }
                    break;
                case 8: //backspace
                case 46: //delete
                    if (e.target == document.body) {
                        app.deleteSelected();
                        e.preventDefault();
                    }
                    break;
                case 65: //Aa
                    if (e.ctrlKey && e.target == document.body) {
                        app.selectAll();
                        e.preventDefault();
                    }
                    break;
                case 73: //Ii
                    if (e.ctrlKey && e.target == document.body) {
                        app.intersectSelectedElements();
                        e.preventDefault();
                    }
                    break;
                case 83: //Ss
                    if (e.ctrlKey) {
                        if (e.shiftKey) {
                            app.saveAs('xml');
                        }
                        e.preventDefault();
                    }
                    break;
                case 79: //Oo
                    if (e.ctrlKey) {
                        openFile().then((file) => {
                            app.open(file);
                        });
                        e.preventDefault();
                    }
                    break;
                case 90: //Zz
                    if (e.ctrlKey) {
                        if (e.shiftKey) {
                            app.redo();
                        } else {
                            app.undo();
                        }
                    }
                    break;
                case 37: //left
                    if (e.target == document.body) {
                        app.moveSelected(-container.resolve('config').moveStep, 0);
                    }
                    break;
                case 38: //up
                    if (e.target == document.body) {
                        app.moveSelected(0, container.resolve('config').moveStep);
                    }
                    break;
                case 39: //right
                    if (e.target == document.body) {
                        app.moveSelected(container.resolve('config').moveStep, 0);
                    }
                    break;
                case 40: //down
                    if (e.target == document.body) {
                        app.moveSelected(0, -container.resolve('config').moveStep);
                    }
                    break;
                case 32: //Space
                    if (e.target == document.body) {
                        app.useLastTool();
                    }
                    break;
                case 82: //Rr
                    if (this.ctrlKey) {
                        container.resolve('3dView').show3D();
                        e.preventDefault();
                    } else if (e.target == document.body) {
                        app.rotateSelected(container.resolve('config').rotateStep);
                    }
                    break;
                case 76:
                    if (e.target == document.body) {
                        app.rotateSelected(-container.resolve('config').rotateStep);
                    }
                    break;
                case 17: //Ctrl
                    this.ctrlKey = true;
                    break;
                case 16: //Shift
                    this.shiftKey = true;
                    break;
                case 71: //Gg
                    if (this.ctrlKey) {
                        app.group();
                        e.preventDefault();
                    }
                    break;
                case 85: //Uu
                    if (this.ctrlKey) {
                        app.ungroup();
                        e.preventDefault();
                    }
                    break;
                case 86: //Vv
                    if ((e.ctrlKey || this.meta) && e.target == document.body) {
                        container.resolve('buffer').paste();
                    }
                    break;
                case 67: //Cc
                    if ((e.ctrlKey || this.meta) && e.target == document.body) {
                        container.resolve('buffer').copy();
                    }
                    break;
                case 88: //Xx
                    if ((e.ctrlKey || this.meta) && e.target == document.body) {
                        container.resolve('buffer').cut();
                    }
                    break;
            }
            switch (e.key) {
                case "+":
                    if (e.target == document.body) {
                        app.board.zoomAroundPoint(1.1, app.board.getCenter());
                    }
                    break;
                case "-":
                    if (e.target == document.body) {
                        app.board.zoomAroundPoint(0.9, app.board.getCenter());
                    }
                    break;
                case "=":
                    if (e.target == document.body) {
                        app.board.zoomToFitScreen();
                    }
                    break;
            }

            if(e.code=="MetaLeft" || e.code=="MetaRight"){
                this.meta=true;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 17: //Ctrl
                    this.ctrlKey = false;
                    break;
                case 16: //Shift
                    this.shiftKey = false;
                    break;
            }

            if(e.code=="MetaLeft" || e.code=="MetaRight"){
                this.meta=false;
            }

        });

    }
}

class Request {

    constructor() {
        this.cache = [];
    }


    httpGet(theUrl) {
        if (this.cache[theUrl]) {
            return this.cache[theUrl];
        } else {
            try {
                let requestURL = theUrl;
                if (theUrl.endsWith(".json") || theUrl.endsWith(".emsx")) {
                    requestURL=theUrl+"?"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
                }

                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", requestURL, false); // false for synchronous request
                xmlHttp.send(null);

                if (theUrl.endsWith(".json") || theUrl.endsWith(".emsx")) {
                    this.cache[theUrl] = xmlHttp.responseText;
                }

                return xmlHttp.responseText;
            } catch (e) {
                return "none";
            }
        }
    }

    httpPost(URL, data, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", URL, true);

        xhr.onload = (res) => {
            callback(res.srcElement.response);
        };
        xhr.send(data);

    }

    get protocolName() {
        return location.protocol;
    }
}


class MathHelper {
    /**
     * @param {number} n1
     * @param {number} n2
     * @param {float} accuracy
     * @return {boolean}
     */
    static equals(n1, n2, accuracy = 1E-5) {
        return n1 + accuracy >= n2 && n1 - accuracy <= n2;
    }

    /**
     *
     * @param {number} value
     * @param {number} a
     * @param {number} b
     * @param {float} [Eps=1E-3]
     * @return {boolean}
     */
    static between(value, a, b, Eps = 1E-3) {
        var min = Math.min.apply(Math, [a, b]),
            max = Math.max.apply(Math, [a, b]);
        return value + Eps > min && value < max + Eps;
    };

}

class Validator {

    static validateCreditCard(value) {
        if (/[^0-9-\s]+/.test(value)) return false;

        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    static validateEmail(errors, email, fieldName) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
            errors.push({fieldName:fieldName, massage:"Incorrect email!"});
            return false;
        }
        return true;
    }

    static validatePostIndex(countryName, index) {
        let country = null;
        try {
            country = Address.getCountryCode(countryName);
        } catch (e) {
            console.log("Exception Incorrect country name", e);
            return false;
        }
        let regexes = {
            "UK": /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i,
            "JE": /^JE\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
            "GG": /^GY\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
            "IM": /^IM\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
            "US": /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/,
            "CA": /^([ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ])\s*([0-9][ABCEGHJKLMNPRSTVWXYZ][0-9])$/i,
            "DE": /^\d{5}$/,
            "JP": /^\d{3}-\d{4}$/,
            "FR": /^\d{2}[ ]?\d{3}$/,
            "AU": /^\d{4}$/,
            "IT": /^\d{5}$/,
            "CH": /^\d{4}$/,
            "AT": /^\d{4}$/,
            "ES": /^\d{5}$/,
            "NL": /^\d{4}[ ]?[A-Z]{2}$/,
            "BE": /^\d{4}$/,
            "DK": /^\d{4}$/,
            "SE": /^\d{3}[ ]?\d{2}$/,
            "NO": /^\d{4}$/,
            "BR": /^\d{5}[\-]?\d{3}$/,
            "PT": /^\d{4}([\-]\d{3})?$/,
            "FI": /^\d{5}$/,
            "AX": /^22\d{3}$/,
            "KR": /^\d{3}[\-]\d{3}$/,
            "CN": /^\d{6}$/,
            "TW": /^\d{3}(\d{2})?$/,
            "SG": /^\d{6}$/,
            "DZ": /^\d{5}$/,
            "AD": /^AD\d{3}$/,
            "AR": /^([A-HJ-NP-Z])?\d{4}([A-Z]{3})?$/,
            "AM": /^(37)?\d{4}$/,
            "AZ": /^\d{4}$/,
            "BH": /^((1[0-2]|[2-9])\d{2})?$/,
            "BD": /^\d{4}$/,
            "BB": /^(BB\d{5})?$/,
            "BY": /^\d{6}$/,
            "BM": /^[A-Z]{2}[ ]?[A-Z0-9]{2}$/,
            "BA": /^\d{5}$/,
            "IO": /^BBND 1ZZ$/,
            "BN": /^[A-Z]{2}[ ]?\d{4}$/,
            "BG": /^\d{4}$/,
            "KH": /^\d{5}$/,
            "CV": /^\d{4}$/,
            "CL": /^\d{7}$/,
            "CR": /^\d{4,5}|\d{3}-\d{4}$/,
            "HR": /^\d{5}$/,
            "CY": /^\d{4}$/,
            "CZ": /^\d{3}[ ]?\d{2}$/,
            "DO": /^\d{5}$/,
            "EC": /^([A-Z]\d{4}[A-Z]|(?:[A-Z]{2})?\d{6})?$/,
            "EG": /^\d{5}$/,
            "EE": /^\d{5}$/,
            "FO": /^\d{3}$/,
            "GE": /^\d{4}$/,
            "GR": /^\d{3}[ ]?\d{2}$/,
            "GL": /^39\d{2}$/,
            "GT": /^\d{5}$/,
            "HT": /^\d{4}$/,
            "HN": /^(?:\d{5})?$/,
            "HU": /^\d{4}$/,
            "IS": /^\d{3}$/,
            "IN": /^\d{6}$/,
            "ID": /^\d{5}$/,
            "IL": /^\d{5}$/,
            "JO": /^\d{5}$/,
            "KZ": /^\d{6}$/,
            "KE": /^\d{5}$/,
            "KW": /^\d{5}$/,
            "LA": /^\d{5}$/,
            "LV": /^\d{4}$/,
            "LB": /^(\d{4}([ ]?\d{4})?)?$/,
            "LI": /^(948[5-9])|(949[0-7])$/,
            "LT": /^\d{5}$/,
            "LU": /^\d{4}$/,
            "MK": /^\d{4}$/,
            "MY": /^\d{5}$/,
            "MV": /^\d{5}$/,
            "MT": /^[A-Z]{3}[ ]?\d{2,4}$/,
            "MU": /^(\d{3}[A-Z]{2}\d{3})?$/,
            "MX": /^\d{5}$/,
            "MD": /^\d{4}$/,
            "MC": /^980\d{2}$/,
            "MA": /^\d{5}$/,
            "NP": /^\d{5}$/,
            "NZ": /^\d{4}$/,
            "NI": /^((\d{4}-)?\d{3}-\d{3}(-\d{1})?)?$/,
            "NG": /^(\d{6})?$/,
            "OM": /^(PC )?\d{3}$/,
            "PK": /^\d{5}$/,
            "PY": /^\d{4}$/,
            "PH": /^\d{4}$/,
            "PL": /^\d{2}-\d{3}$/,
            "PR": /^00[679]\d{2}([ \-]\d{4})?$/,
            "RO": /^\d{6}$/,
            "RU": /^\d{6}$/,
            "SM": /^4789\d$/,
            "SA": /^\d{5}$/,
            "SN": /^\d{5}$/,
            "SK": /^\d{3}[ ]?\d{2}$/,
            "SI": /^\d{4}$/,
            "ZA": /^\d{4}$/,
            "LK": /^\d{5}$/,
            "TJ": /^\d{6}$/,
            "TH": /^\d{5}$/,
            "TN": /^\d{4}$/,
            "TR": /^\d{5}$/,
            "TM": /^\d{6}$/,
            "UA": /^\d{5}$/,
            "UY": /^\d{5}$/,
            "UZ": /^\d{6}$/,
            "VA": /^00120$/,
            "VE": /^\d{4}$/,
            "ZM": /^\d{5}$/,
            "AS": /^96799$/,
            "CC": /^6799$/,
            "CK": /^\d{4}$/,
            "RS": /^\d{6}$/,
            "ME": /^8\d{4}$/,
            "CS": /^\d{5}$/,
            "YU": /^\d{5}$/,
            "CX": /^6798$/,
            "ET": /^\d{4}$/,
            "FK": /^FIQQ 1ZZ$/,
            "NF": /^2899$/,
            "FM": /^(9694[1-4])([ \-]\d{4})?$/,
            "GF": /^9[78]3\d{2}$/,
            "GN": /^\d{3}$/,
            "GP": /^9[78][01]\d{2}$/,
            "GS": /^SIQQ 1ZZ$/,
            "GU": /^969[123]\d([ \-]\d{4})?$/,
            "GW": /^\d{4}$/,
            "HM": /^\d{4}$/,
            "IQ": /^\d{5}$/,
            "KG": /^\d{6}$/,
            "LR": /^\d{4}$/,
            "LS": /^\d{3}$/,
            "MG": /^\d{3}$/,
            "MH": /^969[67]\d([ \-]\d{4})?$/,
            "MN": /^\d{6}$/,
            "MP": /^9695[012]([ \-]\d{4})?$/,
            "MQ": /^9[78]2\d{2}$/,
            "NC": /^988\d{2}$/,
            "NE": /^\d{4}$/,
            "VI": /^008(([0-4]\d)|(5[01]))([ \-]\d{4})?$/,
            "PF": /^987\d{2}$/,
            "PG": /^\d{3}$/,
            "PM": /^9[78]5\d{2}$/,
            "PN": /^PCRN 1ZZ$/,
            "PW": /^96940$/,
            "RE": /^9[78]4\d{2}$/,
            "SH": /^(ASCN|STHL) 1ZZ$/,
            "SJ": /^\d{4}$/,
            "SO": /^\d{5}$/,
            "SZ": /^[HLMS]\d{3}$/,
            "TC": /^TKCA 1ZZ$/,
            "WF": /^986\d{2}$/,
            "XK": /^\d{5}$/,
            "YT": /^976\d{2}$/,
            "INTL": /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/i
        };

        const countryUpperCase = country.toUpperCase();

        if (regexes.hasOwnProperty(countryUpperCase)) {
            return regexes[countryUpperCase].test(index);
        } else {
            return false;
        }
    }

    static validateStreet(street){
        return /\b((box)|(pob))\b/g.test(street.toLowerCase());
    }

    static validateRequiredField(errors, value, fieldName){
        if(typeof value == 'number'){

        }else{
            if(!value || value.length==0){
                errors.push({fieldName:fieldName, massage:"This is required field"});
                return false;
            }
        }
        return true;
    }
}

const Helper = {
    Window: new WindowHelper(),
    Key: new KeyHelper(),
    Request: new Request(),
    Math: MathHelper,
    openFile: openFile,
    Validator: Validator
};

export default Helper;





