/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./routing-part.scss";

import TextFieldStyled from "../../../independentComponents/TextFieldStyled";
import Paper from '@material-ui/core/Paper';
import Card from 'react-credit-cards';
import 'react-credit-cards/lib/styles.scss';
import {connect} from "react-redux";

class CreditCardTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused:'',
        };
    }

    handleInputFocus({ target }){
        this.setState({
            focused: target.name,
        });
    }

    render() {
        return (
            <div style={{display:"flex", marginBottom: "10px", justifyContent: "space-around"}}>
                <Paper style={{padding:'10px', marginBottom:"10px"}}>
                    <div style={{display:'flex'}}>
                        <div>
                            <TextFieldStyled
                                fullWidth
                                error={this.props.errors.filter(e=>e.fieldName=="ccnumber").length>0?"error":""}
                                label="Card Number"
                                onChange={(e)=>this.props.change('number', e.target.value)}
                                value={this.props.number}
                                margin="normal"
                                variant="outlined"
                                type="tel"
                                name="number"
                                pattern="[\d| ]{16,22}"
                                onFocus={this.handleInputFocus.bind(this)}
                            />
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="ccname").length>0?"error":""}
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Name"
                                fullWidth
                                label="Name"
                                onChange={(e)=>this.props.change('name', e.target.value)}
                                value={this.props.name}
                                margin="normal"
                                variant="outlined"
                                onFocus={this.handleInputFocus.bind(this)}
                            />

                            <div>
                                <TextFieldStyled
                                    error={this.props.errors.filter(e=>e.fieldName=="ccdate").length>0?"error":""}
                                    type="tel"
                                    name="expiry"
                                    placeholder="Valid Thru"
                                    pattern="\d\d/\d\d"
                                    label="Expiry"
                                    onChange={(e)=>this.props.change('expiry', e.target.value)}
                                    value={this.props.expiry}
                                    margin="normal"
                                    variant="outlined"
                                    onFocus={this.handleInputFocus.bind(this)}
                                />

                                <TextFieldStyled
                                    error={this.props.errors.filter(e=>e.fieldName=="cccv").length>0?"error":""}
                                    type="tel"
                                    name="cvc"
                                    className="form-control"
                                    placeholder="CVC"
                                    pattern="\d{3,4}"
                                    label="CVC"
                                    onChange={(e)=>this.props.change('cv', e.target.value)}
                                    value={this.props.cv}
                                    margin="normal"
                                    variant="outlined"
                                    onFocus={this.handleInputFocus.bind(this)}
                                />
                            </div>
                        </div>


                    </div>

                </Paper>

                <Card
                    number={this.props.number}
                    name={this.props.name}
                    expiry={this.props.expiry}
                    cvc={this.props.cv}
                    focused={this.state.focused}
                />
            </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        name:state.orderWindowReducer.creditCard.name,
        number:state.orderWindowReducer.creditCard.number,
        cv:state.orderWindowReducer.creditCard.cv,
        expiry:state.orderWindowReducer.creditCard.expiry,
        errors:state.orderWindowReducer.errors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        change: (fieldName, value) =>{
            dispatch({ type: "CHANGE_ORDER_CC", fieldName:fieldName, value:value});
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreditCardTemplate);
