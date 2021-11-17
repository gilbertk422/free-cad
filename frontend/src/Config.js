/**
 * Created by dev on 30.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import AutoLineType from './model/line_types/Auto';
import CommentToSelfLineType from './model/line_types/CommentToSelf';
import BendLineType from './model/line_types/Bend';
import CommentToMachineLineType from './model/line_types/CommentToMachine';

import Observable from './Observable';
import User from "./model/order/User";
import Material from "./model/Material";
import Finish from "./model/Finish";
import Address from "./model/order/Address";
import ThreadLineType from "./model/line_types/Thread";
import GraphicElement from "./model/GraphicElement";

/**
 * You should not use this class for data exchange between modules.
 * The class need only for saving the global config.
 *
 * The config will be used for saving and reproducing user context.
 *
 * Maybe in perspective it will be Redux storage
 *
 * Provides events:
 * 1. change - when change some property, data is propertyName
 */
export default class Config extends Observable{
    constructor(){
        super();

        /** @type {string} [Millimeters|Inches]*/
        this._dimension= localStorage.getItem('dimension');
        if(!this._dimension){
            this._dimension='Inches';
        }
   
        // for transfer state between lifecycles in React - CircleType.js  //todo: must be remove
        this.diameter = '';

        /** @type {LineType} - the default line type*/
        this._lineType = new AutoLineType();

        /** @type {LineType} - the default font size
         * @deprecated - font size depends on board scale
         * */
        this._fontSize = 30;

        /**
         * @type {number}
         */
        this.defaultZValue = 1.59;
    }

    get backpost(){
        if(ENV=="production"){
            return 8080;
        }else{
            return 8081;
        }
    }

    get discretizationQuality(){
        let res = localStorage.getItem('discretizationQuality');
        if(!res){
            this.discretizationQuality=0.2;
            return this.discretizationQuality;
        }
        return res;
    }

    set discretizationQuality(quality){
        localStorage.setItem('discretizationQuality', quality);
    }

    get quantity(){
        let res = localStorage.getItem('quantity');
        if(!res){
            return 100;
        }
        return res;
    }

    set quantity(quantity){
        localStorage.setItem('quantity', quantity);
    }


    set showRuler(value){
        localStorage.setItem('showRuler', value);
        this._notifyHandlers('change','showRuler');
    }

    get showRuler(){
        return localStorage.getItem('showRuler')=='true';
    }


    /**
     * @return {Material}
     */
    get material(){
        let material = localStorage.getItem("defaultMaterial");
        if (material == null) {
            return Material.listOfMaterials().find(m=>m.id==5);
        } else {
            return Object.assign(new Material, JSON.parse(material));

        }
    }
    /**
     * @param {Material} material
     */
    set material(material){
        localStorage.setItem('defaultMaterial', JSON.stringify(material));
    }



    /**
     * @return {Finish}
     */
    get finishes(){
        let finishes = localStorage.getItem("defaultFinishes");
        if (finishes == null) {
            return null;
        } else {
            return Object.assign(new Finish, JSON.parse(finishes));
        }
    }
    /**
     * @param {Finish} finishes
     */
    set finishes(finishes){
        if(!finishes) {
            localStorage.removeItem('defaultFinishes');
        }else{
            localStorage.setItem('defaultFinishes', JSON.stringify(finishes));
        }
        this._notifyHandlers('change', 'finishes');
    }

    get copymode(){
        let cp = localStorage.getItem('copymode');
        if(cp && cp!='false'){
            return true;
        }else {
            return false;
        }
    }
    set copymode(value){
        localStorage.setItem('copymode', value);
    }

    get PPI(){
        return localStorage.getItem('PPI');
    }
    set PPI(ppi){
        localStorage.setItem('PPI', ppi);
    }

    get moveStep(){
        let res = localStorage.getItem('moveStep');
        if(!res){
            return 1;
        }
        return res;
    }
    set moveStep(value){
        localStorage.setItem('moveStep', value);
        this._notifyHandlers('change', 'moveStep');
    }

    get rotateStep(){
        let res = localStorage.getItem('rotateStep');
        if(!res){
            return 15;
        }
        return res;
    }
    set rotateStep(value){
        localStorage.setItem('rotateStep', value);
        this._notifyHandlers('change', 'rotateStep');
    };

    get dimension(){return this._dimension};
    get demension(){return this._dimension};
    set dimension(value){
        this.demensions=value;
    }
    set demensions(value){
        this._dimension=value;
        localStorage.setItem('dimension', this._dimension);
        this._notifyHandlers('change', 'dimension');
    };


    get lineType(){return this._lineType};
    set lineType(value){
        this._lineType=value;
        this._notifyHandlers('change', 'lineType');
    };

    /**
     * @return {Array.<LineType>} -  default line types (used for the line type dropdown)
     */
    get defaultLineTypes(){
        return [
            new AutoLineType(),
            new ThreadLineType(),
            new CommentToSelfLineType(),
            new BendLineType(),
            new CommentToMachineLineType()
        ];
    }

    /**
     * @return {number[]}
     */
    get defaultZValues(){
        return [
            GraphicElement.AirInside,
            0.050, 0.080, 0.130, 0.250, 0.510, 0.790, 1.140, 1.590, 2.360, 3.170, 4.750, 6.350, 9.520, 10.000,
            12.700, 19.050, 25.400, 31.750, 38.100, 50.800, 63.500, 76.200
        ];
    }

    get fontSize(){return this._fontSize}; //todo: depends on scale

    get magnificationMode(){
        return localStorage.getItem("magnificationMode")=="true";
    }

    set magnificationMode(value){
        localStorage.setItem('magnificationMode', value); //todo: save as boolean
    }

    /**
     * @return {User}
     */
    get billingRequisites(){
        let userJson = JSON.parse(localStorage.getItem('billingRequisites'));
        return this._convertJsonToRequisites(userJson);
    }

    /**
     * @param {User} user
     */
    set billingRequisites(user){
        localStorage.setItem('billingRequisites', JSON.stringify(user));
    }

    /**
     * @return {User}
     */
    get shippingRequisites(){
        let userJson = JSON.parse(localStorage.getItem('shippingRequisites'));
        return this._convertJsonToRequisites(userJson);
    }
    /**
     * @param {User} user
     */
    set shippingRequisites(user){
        localStorage.setItem('shippingRequisites', JSON.stringify(user));
        this._notifyHandlers('change', 'shippingRequisites');
    }

    _convertJsonToRequisites(json){
        let res = new User();
        if(json) {
            res.firstName = json.firstName;
            res.lastName = json.lastName;
            res.businessName = json.businessName;
            res.phone = json.phone;
            res.email = json.email;
            res.address = Object.assign(new Address(), json.address);
        }
        return res;
    }

    get billingDifferentWithShipping(){
        let bdws = localStorage.getItem('billingDifferentWithShipping');
        return bdws && bdws!='false'
    }

    set billingDifferentWithShipping(value){
        localStorage.setItem('billingDifferentWithShipping', value);
    }
}