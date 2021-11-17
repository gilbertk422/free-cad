/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

export default class Order{

    static PAYMENT_TYPE_CREDIT_CARD = 0;
    static PAYMENT_TYPE_PURCHASE = 1;
    static PAYMENT_TYPE_CHECK = 2;


    constructor(){

        /** @type {User} */
        this.billingRequisites = null;

        /** @type {User} */
        this.shippingRequisites = null;

        /** @type {number} */
        this.quantity=0;

        /** @type {Material} */
        this.material = null;

        /** @type {Finish} */
        this.finish = null;

        this.pymentType = Order.PAYMENT_TYPE_CREDIT_CARD;

        this.checkOrPONo="";

        /** @type {CreditCard} */
        this.creditCard = null;

        /** @type {string} */
        this.additionalInstructions = "TEST";

        /** @type {Shipping} */
        this.shipping=null;

        this.totalCost = "$310.92";

        this.businessDays = 15;

        /** @type {Document} */
        this.document = null;

        /** @type {string} */
        this.functionOfPart = "";

        this.checkAvailable=true;

        this.agreePrivate = false;

        this.isSend=false;

        /** @type {string} */
        this.dimension = "";
    }

    /**
     * @returns {string}
     * @private
     */
    _getDimension(){
        let extremun = this.document.getExtrenum();
        let x = extremun.max.x-extremun.min.x;
        let y = extremun.max.y-extremun.min.y;

        let z = 0;
        for(let element of this.document._elements){
            if(z<element.height){
                z=element.height
            }
        }
        let res = (x/25.4).toFixed(2)+'" x '+(y/25.4).toFixed(2)+'" x '+(z/25.4).toFixed(2)+'"';
        return res;
    }


    requiredField(errors, value, fieldName){
        if(typeof value == 'number'){

        }else{
            if(!value || value.length==0){
                errors.push({fieldName:fieldName, massage:"This is required field"});
                return false;
            }
        }
        return true;
    }

    validate(){
        let errors = [];

        if(!this.shippingRequisites){
            //todo: error empty shipping
        }else{
            this.requiredField(errors, this.shippingRequisites.firstName, "shipping first name");
            this.requiredField(errors, this.shippingRequisites.lastName, "shipping last name");
            this.requiredField(errors, this.shippingRequisites.email, "shipping email");
            Helper.Validator.validateEmail(errors, this.shippingRequisites.email, "shipping email");
            this.requiredField(errors, this.shippingRequisites.phone, "shipping phone");
            // this.requiredField(errors, this.shippingRequisites.businessName, "shipping company");

            if(!this.shippingRequisites.address){
                //todo: error empty address
            }else{
                this.requiredField(errors, this.shippingRequisites.address.country, "shipping address.country");
                this.requiredField(errors, this.shippingRequisites.address.city, "shipping address.city");
                this.requiredField(errors, this.shippingRequisites.address.state, "shipping address.state");
                if(this.requiredField(errors, this.shippingRequisites.address.zipCode, "shipping address.zipCode")){
                    if(!Helper.Validator.validatePostIndex(this.shippingRequisites.address.country, this.shippingRequisites.address.zipCode)) {
                        errors.push({fieldName:"shipping address.zipCode", massage:"Incorrect zipCode for this country"});
                    }
                }


                if(this.requiredField(errors, this.shippingRequisites.address.street, "shipping address.street")){
                    if(Helper.Validator.validateStreet(this.shippingRequisites.address.street)){
                        errors.push({fieldName:"shipping address.street", massage:"Cannot ship to post office box - please provide street address."});
                    }
                }
            }
        }

        if(this.pymentType==Order.PAYMENT_TYPE_CREDIT_CARD){
            if(this.requiredField(errors, this.creditCard.number, "ccnumber")){
                if(!Helper.Validator.validateCreditCard(this.creditCard.number)){
                    errors.push({fieldName:"ccnumber", massage:"Incorrect has sum by Lun's algorithm"});
                }
            }
            this.requiredField(errors, this.creditCard.ownername, "ccname");
            this.requiredField(errors, this.creditCard.year, "ccdate");
            this.requiredField(errors, this.creditCard.month, "ccdate");
            this.requiredField(errors, this.creditCard.CCV, "cccv");
        }

        if(this.pymentType==Order.PAYMENT_TYPE_CHECK && this.checkAvailable){
            this.requiredField(errors, this.checkOrPONo, "check number");
        }
        this.requiredField(errors, this.agreePrivate, "agreePrivate");

        return errors.length==0?false:errors;
    }


    send(){
        return new Promise((resolve)=>{
            let errors = this.validate();
            if(errors){
                resolve(errors);
                return;
            }

            container.resolve('config').shippingRequisites = this.shippingRequisites;
            if(this.billingRequisites){
                container.resolve('config').billingRequisites = this.billingRequisites;
            }


            /** @type {FileLoader} */
            let loader = container.resolve('fileLoaderFactory', 'xml');

            loader.getBlobData(app.currentDocument).then((design)=>{
                let fd = new FormData();
                fd.append('design', design, app.currentDocument.fileName==""?"NewDocument.emsx":app.currentDocument.fileName);
                fd.append('order', JSON.stringify(this,(key,value)=>{
                    if (key=="send" || key=="isSend") {
                        return undefined;
                    } else if(key =='document'){
                        return undefined;
                    } else if(key=='dimension'){
                        return this._getDimension();
                    } else {
                        return value;
                    }
                }));
                Helper.Request.httpPost(Helper.Request.protocolName+'//'+window.location.hostname+':'+container.resolve('config').backpost+'/order', fd,res=>{
                    console.log(res, "some response", gtag);
                    gtag('event', 'Order', {
                        'event_category': 'Web CAD'
                    });
                    resolve(res);
                });
            });
        });
    }
}