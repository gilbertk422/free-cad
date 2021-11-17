/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import {connect} from "react-redux";
import TextFieldStyled from "../../../independentComponents/TextFieldStyled";

class PrepayByCheck extends React.Component {

    handleChecked(){
        this.props.changeCheckAvailable(!this.props.checkIsAvailable);
    }

    changeCheckNumber(e){
        this.props.changeCheckNumber(e.target.value);
    }

    render() {
        return (
            <div className="PrepayByCheck">
                <div className="Input">
                    {this.props.checkIsAvailable==true&&(
                        <label>
                            Check number:
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="check number").length>0?"error":""}
                                required
                                label=""
                                value={this.props.checkNumber}
                                onChange={this.changeCheckNumber.bind(this)}
                                margin="normal"
                                variant="outlined"
                            />
                        </label>
                    )}
                    {this.props.checkIsAvailable==false&&(
                        <label style={{color:'lightgrey'}}>Check number: <input type="text" disabled/> </label>
                    )}
                    <Checkbox
                        style={{ marginLeft:'10px' }}
                        checked={!this.props.checkIsAvailable}
                        onChange={this.handleChecked.bind(this)}
                        color="primary"
                    />
                    Paying by company check, but number not yet available.
                </div>
                <p style={{ textAlign: "left" }}>
                    So that order processing can begin please mail your check to:<br />
                    eMachineShop<br />
                    31 Industrial Ave, Unit 6<br />
                    Mahwah, NJ 07430
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        checkNumber:state.orderWindowReducer.checkNumber,
        checkIsAvailable:state.orderWindowReducer.checkIsAvailable,
        errors:state.orderWindowReducer.errors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeCheckNumber: value =>{
            dispatch({ type: "CHANGE_ORDER_CHECK_NUMBER", checkNumber: value });
        },
        changeCheckAvailable: value =>{
            dispatch({ type: "CHANGE_ORDER_CHECK_AVAILABLE", available: value });
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrepayByCheck);