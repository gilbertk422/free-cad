/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

import AddressModel from "../../../../model/order/Address";
import StateField from "./StateField";

import Select from '@material-ui/core/Select';
import TextFieldStyled from "../TextFieldStyled";

export default class Address extends React.Component{


    changeState(address, e){
        // if(e) {
        //     this.validate(e);
        // }
        this.props.onChange(address);
    }

    handleSelectCountryChange(e){
        /**@type {AddressModel} */
        let res = this.props.address.copy();
        res.country = e.target.value;
        this.changeState(res, e);
    }

    handleStreetField(e){
        /**@type {AddressModel} */
        let res = this.props.address.copy();
        res.street = e.target.value;
        this.changeState(res, e);
    }

    handleCityField(e){
        /**@type {AddressModel} */
        let res = this.props.address.copy();
        res.city = e.target.value;
        this.changeState(res, e);
    }

    handleZIPField(e){
        /**@type {AddressModel} */
        let res = this.props.address.copy();
        res.zipCode = e.target.value;
        this.changeState(res, e);
    }

    handleStateField(state){
        /**@type {AddressModel} */
        let res = this.props.address.copy();
        res.state = state;
        this.changeState(res);
    }


    validate(e){
        if(e.target.value == ""){
            e.target.style.backgroundColor='#ffe9e9';
            e.target.style.borderColor='#e20000';
            e.target.closest('.validationField').getElementsByClassName("errorMessage")[0].style.display = "block";
        }else{
            e.target.closest('.validationField').getElementsByClassName("errorMessage")[0].style.display = "none";
            e.target.style.backgroundColor='#dff5de';
            e.target.style.borderColor='#1eb512';
        }
        return true;
    }

    render(){
        return (
            <>
                <Select
                    label="Country"
                    required
                    fullWidth
                    native
                    value={this.props.address.country}
                    onChange={this.handleSelectCountryChange.bind(this)}
                >
                    <option value="" key={-1}></option>
                    {AddressModel.countries.map((item, i) => (
                        <option value={item} key={i}>
                            {item}
                        </option>
                    ))}
                </Select>

                <StateField
                    value={this.props.address.state}
                    onChange={this.handleStateField.bind(this)}
                    country={this.props.address.country}
                />

                <TextFieldStyled
                    fullWidth
                    required
                    label="ZIP or postal code"
                    value={this.props.address.zipCode}
                    onChange={this.handleZIPField.bind(this)}
                    margin="normal"
                    variant="outlined"
                />

                <TextFieldStyled
                    fullWidth
                    required
                    label="City"
                    value={this.props.address.city}
                    onChange={this.handleCityField.bind(this)}
                    margin="normal"
                    variant="outlined"
                />

                <TextFieldStyled
                    fullWidth
                    required
                    label="Street"
                    value={this.props.address.street}
                    onChange={this.handleStreetField.bind(this)}
                    margin="normal"
                    variant="outlined"
                />

            </>
        );
    }
}