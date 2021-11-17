/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Address from "./../../../../independentComponents/Addres/Address";
import TextFieldStyled from "../../../../independentComponents/TextFieldStyled";
import Separator from "../../../../independentComponents/Separator";
import Paper from '@material-ui/core/Paper';

export default class Adress extends React.Component {

    constructor(props) {
        super(props);

        /** @type {Config} */
        let config = container.resolve('config');

        this.state = {
            shippingRequisites:config.shippingRequisites,
            billingRequisites:config.billingRequisites,
            isChecked: config.billingDifferentWithShipping,
            provinceOther: false,
            provinceOther2: false,
        };

    }

    changeShippingRequisitesProps(propName, value){
        let ui = container.resolve('config').shippingRequisites;
        ui[propName]=value;
        container.resolve('config').shippingRequisites=ui;
        this.setState({shippingRequisites:ui});
        if(propName=="address"){
            store.dispatch({type:"ZIP_CHANGE_COUNTRY", payload:value.country});
            store.dispatch({type:"ZIP_CHANGE_CODE", payload:value.zipCode});
        }
    }

    changeBillingRequisitesProps(propName, value){
        let ui = container.resolve('config').billingRequisites;
        ui[propName]=value;
        container.resolve('config').billingRequisites=ui;
        this.setState({billingRequisites:ui});
    }

    handleChecked(event){
        container.resolve('config').billingDifferentWithShipping=!container.resolve('config').billingDifferentWithShipping;
        this.setState({isChecked: !this.state.isChecked});
    }

    openLinkPryvacy(){
        window.open("https://www.emachineshop.com/privacy/");
    }


    copyShippingToBilling(){
        let ui = container.resolve('config').shippingRequisites;
        container.resolve('config').billingRequisites=ui;
        this.setState({billingRequisites:ui});
    }

    render() {
        return (
            <div className="Address">
                <form>
                    <Paper style={{marginBottom:"10px", padding:"5px"}}>
                        <Separator text="Name" />
                        <TextFieldStyled
                            fullWidth
                            required
                            label="First Name"
                            value={this.state.shippingRequisites.firstName}
                            onChange={(e)=>{this.changeShippingRequisitesProps('firstName',e.target.value)}}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextFieldStyled
                            fullWidth
                            required
                            label="Last Name"
                            value={this.state.shippingRequisites.lastName}
                            onChange={(e)=>{this.changeShippingRequisitesProps('lastName',e.target.value)}}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextFieldStyled
                            fullWidth
                            required
                            label="Business Name"
                            value={this.state.shippingRequisites.businessName}
                            onChange={(e)=>{this.changeShippingRequisitesProps('businessName',e.target.value)}}
                            margin="normal"
                            variant="outlined"
                        />
                        <Separator text="E-mail & Phone:" />
                        <TextFieldStyled
                            fullWidth
                            required
                            label="Email address"
                            value={this.state.shippingRequisites.email}
                            onChange={(e)=>{this.changeShippingRequisitesProps('email',e.target.value)}}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextFieldStyled
                            fullWidth
                            required
                            label="Phone number"
                            value={this.state.shippingRequisites.phone}
                            onChange={(e)=>{this.changeShippingRequisitesProps('phone',e.target.value)}}
                            margin="normal"
                            variant="outlined"
                        />
                        <Separator text="Shipping address:" />
                        <Address
                            address={this.state.shippingRequisites.address}
                            onChange={(address)=>{this.changeShippingRequisitesProps('address',address)}}
                        />
                    </Paper>

                    <Paper style={{marginBottom:"10px", padding:"5px"}}>
                        <label>
                            <Checkbox
                                checked={this.state.isChecked}
                                onChange={this.handleChecked.bind(this)}
                                color="primary"
                            />
                            Billing address (enter only if different from shipping address)
                        </label>
                        {this.state.isChecked && ( <>
                            <TextFieldStyled
                                fullWidth
                                required
                                label="First Name"
                                value={this.state.billingRequisites.firstName}
                                onChange={(e)=>{this.changeBillingRequisitesProps('firstName',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextFieldStyled
                                fullWidth
                                required
                                label="Last Name"
                                value={this.state.billingRequisites.lastName}
                                onChange={(e)=>{this.changeBillingRequisitesProps('lastName',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextFieldStyled
                                fullWidth
                                required
                                label="Email address"
                                value={this.state.billingRequisites.email}
                                onChange={(e)=>{this.changeBillingRequisitesProps('email',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextFieldStyled
                                fullWidth
                                required
                                label="Phone number"
                                value={this.state.billingRequisites.phone}
                                onChange={(e)=>{this.changeBillingRequisitesProps('phone',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                            <Address
                                address={this.state.billingRequisites.address}
                                onChange={(address)=>{this.changeBillingRequisitesProps('address',address)}}
                            />
                            <div className="CopyBlock">
                                <div>
                                    Must match the billing address on file for credit card
                                </div>
                                <Button
                                    onClick={this.copyShippingToBilling.bind(this)}
                                    size="small"
                                    style={{ backgroundColor: "#c7c7c7", color: "orangered" }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </>)}
                    </Paper>
                    <div>
                        <span style={{ color: "red" }}>*</span> - required to place an order
                    </div>
                    <div>
                        For our privacy policy please visit{" "}
                        <a onClick={this.openLinkPryvacy}
                            href="https://www.emachineshop.com/privacy/"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            emachineshop.com
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}
