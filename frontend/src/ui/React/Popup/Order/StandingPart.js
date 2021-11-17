/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React, {Fragment} from "react";
import "./standing-part.scss";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextFieldStyled from "../../independentComponents/TextFieldStyled";
import Paper from '@material-ui/core/Paper';
import StateField from "../../independentComponents/Addres/StateField";
import {Select} from "@material-ui/core";
import Address from "../../../../model/order/Address";

class StandingPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }

    renderAddress(type, address, changeHandler){
        return (
            <Fragment>
                <TextFieldStyled
                    error={this.props.errors.filter(e=>e.fieldName==type+" address.street").length>0?"error":""}
                    fullWidth
                    required
                    label={"Street"}
                    value={address.street}
                    onChange={(e)=>changeHandler('street', e.target.value)}
                    margin="normal"
                    variant="outlined"
                    helperText={this.props.errors.filter(e=>e.fieldName==type+" address.street").length>0?this.props.errors.filter(e=>e.fieldName==type+" address.street")[0].massage:""}
                />

                <div className="FirstLastName">
                    <div className="First">
                        <TextFieldStyled
                            error={this.props.errors.filter(e=>e.fieldName==type+" address.city").length>0?"error":""}
                            fullWidth
                            required
                            label="City"
                            value={address.city}
                            onChange={(e)=>changeHandler('city', e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                    <div className="Last">
                        <StateField value={address.region}
                                    onChange={(e)=>changeHandler('region', e)}
                                    country={address.country}
                                    error={this.props.errors.filter(e=>e.fieldName==type+" address.state").length>0?"error":""}
                        />
                    </div>
                </div>

                <div className="FirstLastName">
                    <div className="First">
                        <TextFieldStyled
                            error={this.props.errors.filter(e=>e.fieldName==type+" address.zipCode").length>0?"error":""}
                            fullWidth
                            required
                            label="ZIP"
                            value={address.zip}
                            onChange={(e)=>changeHandler('zip', e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                    </div>
                    <div className="Last validationField">
                        <Select
                            error={this.props.errors.filter(e=>e.fieldName==type+" address.country").length>0?"error":""}
                            label="Country"
                            required
                            fullWidth
                            native
                            value={address.country}
                            onChange={(e)=>changeHandler('country', e.target.value)}
                            style={{marginBottom:"0px", marginTop:"5px"}}
                        >
                            {Address.countries.map((item, i) => (
                                <option value={item} key={i}>
                                    {item}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Fragment>
        );
    }

    render() {
        return (
            <div className="StandingPart">
                <Paper style={{marginBottom:"10px", padding:"5px"}}>
                    <h3 className="Title">Shipping Address</h3>
                    <div className="FirstLastName">
                        <div className="First">
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="shipping first name").length>0?"error":""}
                                fullWidth
                                required
                                label="First name"
                                value={this.props.shippingAddress.firstName}
                                onChange={(e)=>{this.props.changeShippingProps('firstName',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="Last">
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="shipping last name").length>0?"error":""}
                                fullWidth
                                required
                                label="Last name"
                                value={this.props.shippingAddress.lastName}
                                onChange={(e)=>{this.props.changeShippingProps('lastName',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                    </div>

                    {this.renderAddress('shipping', this.props.shippingAddress, this.props.changeShippingProps)}

                    <div className="FirstLastName">
                        <div className="First">
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="shipping company").length>0?"error":""}
                                fullWidth
                                label="Company"
                                value={this.props.shippingAddress.businessName}
                                onChange={(e)=>{this.props.changeShippingProps('businessName',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="Last">
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="shipping phone").length>0?"error":""}
                                fullWidth
                                required
                                label="Phone"
                                value={this.props.shippingAddress.phone}
                                onChange={(e)=>{this.props.changeShippingProps('phone',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                    </div>

                    <div className="FirstLastName Email">
                        <div className="First">
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="shipping email").length>0?"error":""}
                                fullWidth
                                required
                                label="Email"
                                value={this.props.shippingAddress.email}
                                onChange={(e)=>{this.props.changeShippingProps('email',e.target.value)}}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="Last">
                            <img width="260px" style={{marginLeft:'160px'}} src="resources/images/ShippingLogos2.png" />
                        </div>
                    </div>

                    <label>
                        <Checkbox
                            checked={this.props.hasBillingAddress}
                            onChange={()=>this.props.changeHasBillingAddress(!this.props.hasBillingAddress)}
                            color="primary"
                        />
                        Billing address (enter only if different from shipping address)
                    </label>

                </Paper>

                {this.props.hasBillingAddress && (
                    <Paper style={{marginBottom:"10px", padding:"5px"}}>
                        <h3 className="Title">Billing Address</h3>
                        <div className="FirstLastName">
                            <div className="First">
                                <TextFieldStyled
                                    fullWidth
                                    required
                                    label="First Name"
                                    value={this.props.billingAddress.firstName}
                                    onChange={(e)=>{this.props.changeBillingProps('firstName',e.target.value)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="Last">
                                <TextFieldStyled
                                    fullWidth
                                    required
                                    label="Last Name"
                                    value={this.props.billingAddress.lastName}
                                    onChange={(e)=>{this.props.changeBillingProps('lastName',e.target.value)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                        </div>
                        {this.renderAddress('billing', this.props.billingAddress, this.props.changeBillingProps)}
                    </Paper>
                )}
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        shippingAddress:state.orderWindowReducer.shippingAddress,
        billingAddress:state.orderWindowReducer.billingAddress,
        errors:state.orderWindowReducer.errors,
        hasBillingAddress:state.orderWindowReducer.hasBillingAddress
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeBillingProps: (fieldName, value)=>{
            dispatch({type:"CHANGE_ORDER_BILLING_ADDRESS", fieldName:fieldName, value:value});
        },
        changeShippingProps: (fieldName, value)=>{
            dispatch({type:"CHANGE_ORDER_SHIPPING_ADDRESS", fieldName:fieldName, value:value});
        },
        changeHasBillingAddress: (value)=>{
            dispatch({type:"CHANGE_ORDER_HAS_BILLING_ADDRESS", value:value});
        }
    };
};
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StandingPart)
);