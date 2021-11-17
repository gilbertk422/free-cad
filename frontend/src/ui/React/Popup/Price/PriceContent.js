/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./price-content.scss";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MachiningGrid from "./MachiningGrid";
import MaterialTable from 'material-table';
import CircularProgress from '@material-ui/core/CircularProgress';
import Shipping from "../../../../model/order/Shipping";

import IconButton from '@material-ui/core/IconButton';

class PriceContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "UPS Ground",
            isChecked:false,
            country:container.resolve('config').shippingRequisites.address.country +" ("+container.resolve('config').shippingRequisites.address.zipCode+")",
            quantity:container.resolve('config').quantity,
            rows:[],
            loaded:false,
            shipping: [],
            row:{price: 0, each: 0, est: 0, alternative: "", setUp:0, MfgPrice:0},
            currentShiping:new Shipping(),
            selectRowIndex:0,
            canOrder:false
        };

        this.loadPrices(false);

        this.timeout;
    }


    loadPrices(resetloaded=true){
        if(resetloaded) {
            this.setState({loaded: false, canOrder:false});
        }
        /** @type {FileLoader} */
        let loader = container.resolve('fileLoaderFactory', 'xml');

        /** @type {Material} */
        let material = container.resolve('config').material;

        let finishes = container.resolve('config').finishes;

        /** @type {User} */
        let shippingRequisites = container.resolve('config').shippingRequisites;

        let xml = loader.getBlobData(app.currentDocument).then((design)=>{
            let finish = "";
            if(finishes){
                finish=`{"ID":${finishes.id}, "Name":"${finishes.fullName}"}`;
            }

            return new Promise((resolve)=>{
                let fd = new FormData();
                fd.append('design', design, app.currentDocument.fileName==""?"NewDocument.emsx":app.currentDocument.fileName);
                fd.append('inputParameters',`{
                    "EmsSignature":"EMS",
                    "PartsQty":${this.state.quantity},
                    "Customer":{
                        "Country":"${shippingRequisites.address.country}",
                        "State":"${shippingRequisites.address.state}",
                        "ZIP":"${shippingRequisites.address.zipCode}"
                    },
                    "Material":{
                        "ID":${material.id},
                        "Name":"${material.name}"},
                    "Specifications":{ },
                    "Finishes":[${finish}]
                }`);
                Helper.Request.httpPost(Helper.Request.protocolName+'//'+window.location.hostname+':'+container.resolve('config').backpost+'/price', fd,resolve);
            });
        }).then((response)=>{
            if(!this.props.openPrice){
                return;
            }
            let pricesJSON = JSON.parse(response);
            let newRows = [];

            if(pricesJSON.Pricing != undefined) {

                for (let price of pricesJSON.Pricing.Combos) {
                    newRows.push({
                        price: price.MfgPrice-price.SetupCost,
                        each: ((price.MfgPrice-price.SetupCost) / pricesJSON.Pricing.PartsQty),
                        est: price.MfgDays,
                        alternative: '',
                        setUp:price.SetupCost,
                        MfgPrice:price.MfgPrice
                    });
                }

                let shippingVariants = [];

                for (let shipp of pricesJSON.Pricing.Shippings) {
                    let shipping = new Shipping();
                    shipping.id = shipp.MethodID;
                    shipping.price = shipp.Cost;
                    shipping.name = shipp.MethodName;
                    shippingVariants.push(shipping);
                }

                this.setState({rows: newRows, row:newRows[0], selectRowIndex:0, loaded: true, shipping: shippingVariants,
                    currentShiping:shippingVariants[0],canOrder:true});
            }else{
                this.props.closePriceModal(!this.props.openPrice);
                this.setState({loaded: true});
                if(pricesJSON.Error) {
                    container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature(pricesJSON.Error);
                }
                if(pricesJSON.Errors){
                    container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature(pricesJSON.Errors[0].Error);
                }
            }
        }).catch(error=>{
            if(!this.props.openPrice){
                return;
            }
            this.setState({loaded:true});
            throw new Exception(error);
        });
    }


    handleChangeInputQuantity(e){
        this.setState({ quantity: e.target.value });

        if(this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(()=>{
            this.loadPrices();
        }, 2000);
        container.resolve('config').quantity = e.target.value;
    }

    handleChangeShipMethod(e){
        for(let ship of this.state.shipping){
            if(ship.name == e.target.value){
                this.setState({ currentShiping: ship});
                return;
            }
        }
    }

    setRow(row){
        let rid=0;
        for(let i=0; i<this.state.rows.length; i++){
            if(this.state.rows[i].price==row.price && this.state.rows[i].est==row.est){
                rid=i;
                break;
            }
        }

        this.setState({row:row, selectRowIndex:rid});
    }

    order(){
        this.props.openOrderModal(!this.props.openOrder, this.state.row, this.state.quantity, this.state.currentShiping);
    }

    changeCountry(){
        let config = container.resolve('config');

        let win = container.resolve('zipCodeWindow', [
                ()=>{
                    let sr = config.shippingRequisites;
                    let data = win.data;
                    sr.address.country=data.country;
                    sr.address.zipCode=data.zipCode;
                    config.shippingRequisites=sr;
                    this.setState({country: data.country+" ("+data.zipCode+")"}, ()=>{
                        this.loadPrices();
                    });
                },
                function(){}
            ]
        );
        win.show();
    }

    render() {
        return (
            <div className="PriceContent">
                <div className="Quantity">
                    <div className="LabelQuantity">
                        <label>Quantity</label>
                    </div>
                    <div className="InputNumber">
                        <input
                            value={this.state.quantity}
                            onChange={this.handleChangeInputQuantity.bind(this)}
                            type="number"
                            min="1"
                        />
                    </div>
                </div>

                <div className="MachiningGrid">
                    <div className="LabelMachining">
                        <label>Machining</label>
                    </div>
                    <div className="Grid">
                        {!this.state.loaded && <CircularProgress style={{width: "200px", height: "200px", marginLeft:'0px'}}/>}
                        {this.state.loaded && <MachiningGrid rows={this.state.rows} onSelect={(e)=>this.setRow(e.rowData)} selectIndex={this.state.selectRowIndex}/>}
                    </div>
                </div>
                {this.state.row.setUp!=0 && (
                <div className="SetupCost">
                    <div className="LabelSetupCost">Setup cost</div>
                    <div>${this.state.row.setUp.toFixed(2)}</div>
                </div> )}
                <div className="ShipVia">
                    <div className="LabelShipVia">
                        <label>Ship Via</label>
                    </div>
                    <div className="Select">
                        <select
                            className="SelectMode"
                            value={this.state.currentShiping.name}
                            onChange={this.handleChangeShipMethod.bind(this)}
                        >
                          {this.state.shipping.map((val) => (
                            <option value={val.name} key={val.id}>
                              {val.name}
                            </option>
                          ))}
                        </select>
                        <span>to</span><a
                            href="#"
                            onClick={this.changeCountry.bind(this)}
                        >{this.state.country}</a>
                    </div>
                </div>

                <div className="Shipping">
                    <div className="LabelShipping">
                        <label>Shipping</label>
                    </div>
                    <div className="ShippingValue">
                        <span>{this.state.currentShiping.price>0?"$"+this.state.currentShiping.price:"Free"}</span>
                    </div>
                </div>

                <div className="Total">
                    <div className="LabelTotal">
                        <label>Total</label>
                    </div>
                    <div className="TotalRightPart">
                        <span className="TotalResult">${(this.state.row.MfgPrice+this.state.currentShiping.price).toFixed(2)}</span>
                        <Button
                            className="orderButton"
                            onClick={this.order.bind(this)}
                            disabled={!this.state.canOrder}
                            style={{
                              backgroundColor: "#dddada",
                              boxShadow: "2px 2px 1px #000",
                            }}
                            color="primary"
                        >
                            Order...
                        </Button>
                    </div>
                </div>

                <div className="Note">
                    <p>
                        *Times are estimates in business days and exclude delivery transit time.
                    </p>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        openOrder: state.orderWindowReducer.openOrder,
        openPrice: state.priceReducer.openPrice
    };
  };
const mapDispatchToProps = dispatch => {
    return {
        openOrderModal: (openOrder, price, quantity, ship)=> {
            dispatch({ type: "OPEN_ORDER", payload: openOrder, price, quantity, ship });
        },
        closePriceModal: openPrice => {
            dispatch({ type: "CLOSE_PRICE", payload: openPrice });
        }
    };
  };
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(PriceContent))
