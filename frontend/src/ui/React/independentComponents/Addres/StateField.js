/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

import PropTypes from 'prop-types';
import Address from "../../../../model/order/Address";
import TextFieldStyled from "../TextFieldStyled";
import Select from '@material-ui/core/Select';

export default class StateField extends React.Component{

    static propTypes = {
        country:PropTypes.string,
        onChange:PropTypes.func,
        value:PropTypes.string
    }


    constructor(props){
        super(props);

        this.state={
            province:props.value,

        }
    }

    changeState(e){
        this.setState({province:e.target.value});
        this.props.onChange(e.target.value, e);
    }

    render(){
        return (
            <>
                {Address.getListStates(this.props.country)==null && (
                    <TextFieldStyled
                        error={this.props.error}
                        fullWidth
                        required
                        label="State or province"
                        value={this.state.province}
                        onChange={this.changeState.bind(this)}
                        margin="normal"
                        variant="outlined"
                    />
                )}
                {Address.getListStates(this.props.country)!=null && (
                    <Select
                        error={this.props.error}
                        label="State or province"
                        required
                        fullWidth
                        native
                        value={this.state.province}
                        onChange={this.changeState.bind(this)}
                        style={{marginBottom:"0px", marginTop:"5px"}}
                    >
                        {Address.getListStates(this.props.country).map((item, i) => (
                            <option value={item} key={i}>
                                {item}
                            </option>
                        ))}
                    </Select>
                )}
            </>
        );
    }
}