/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
// import "./price.scss";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import RoutingPart from "./RoutingPart/RoutingPart";
import StandingPart from "./StandingPart";
import "./order.scss";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Order from "../../../../model/order/Order";

class OrderTemplate extends React.Component {

    render() {
        // console.log(this.props, "props-Order");
        return (
            <Dialog
                onBackdropClick={() => {
                    this.props.closeOrderModal(!this.props.openOrder);
                }}
                maxWidth="lg"
                fullWidth={true}
                open={this.props.openOrder}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    style={{ color: "black", textAlign: "left" }}
                    id="alert-dialog-title"
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ marginLeft: "5px" }}>Order</span>
                        <Button
                            onClick={() => {
                                this.props.closeOrderModal(!this.props.openOrder);
                            }}
                            style={{
                                backgroundColor: "#fff",
                                padding: "0px"
                            }}
                            color="primary"
                        >
                            <i className="material-icons">cancel_presentation</i>
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent
                    style={{paddingBottom: "0px", paddingTop: "0px", textAlign: "left", backgroundColor: "#f0ecec"}}
                >
                    <RoutingPart history={this.props.history}/>
                    <StandingPart/>

                    <div className="Right">
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <label style={{flexGrow:2}}>
                                <Checkbox
                                    checked={this.props.allowPublicationOfPartImages}
                                    onChange={(e)=>this.props.changeAllowPublish(!this.props.allowPublicationOfPartImages)}
                                    style={{ padding: '0', margin: '0' }}
                                    color="primary"
                                />
                                Allow publication of part images. (Not Required)
                            </label>


                            {this.props.allowPublicationOfPartImages &&
                            <div className="FunctionOfPart" style={{flexGrow:3}}>
                                <div className="LabelOfPart">
                                    <label>Function of Part:</label>
                                </div>
                                <div className="InputOfPart">
                                    <input className="InputFieldOfPart" type="text"
                                           value={this.props.functionOfPart}
                                           onChange={(e)=>this.props.changeFunctionOfPart(e.target.value)}
                                    />
                                </div>
                            </div>}

                        </div>

                        <div>
                            <label>
                                <Checkbox
                                    iconStyle={{fill: 'red'}}
                                    checked={this.props.agree || this.props.errors.filter(e=>e.fieldName=="agreePrivate").length>0}
                                    onChange={()=>this.props.changeAgree(!this.props.agree)}
                                    style={{ padding: '0', margin: '0' }}
                                    color={this.props.errors.filter(e=>e.fieldName=="agreePrivate").length>0?"secondary":"primary"}
                                />
                                I agree to the <a href="https://www.emachineshop.com/terms-and-order-policies/" target="_blank"
                                                  rel="noreferrer noopener">Terms of Use and Order Policies</a> and have reviewed the
                                <a href="https://www.emachineshop.com/help-ordering/#pre-order-checklist" target="_blank"
                                   rel="noreferrer noopener"> Pre-Order Checklist</a>
                            </label>
                        </div>

                    </div>

                    <div className="OptionalPurchase">
                        <div className="LabelOptional">
                            <label>Optional Purchase Order number for your reference only:</label>
                        </div>
                        <div className="InputAndButton">
                            <div className="InputFieldOptional" >
                                <input type="text" />
                            </div>
                        </div>
                    </div>

                    <div className="BottomContent">
                        <div className="HaveTrouble">
                             <p>Having trouble?</p>
                             <p><a href="https://www.emachineshop.com/contact/" target="_blank"
                                   rel="noreferrer noopener">Contact us for help</a></p>
                        </div>

                        <div>
                            <a target="_blank" href="#"
                                onClick={(e) => {e.preventDefault(); this.props.updateSummaryWindow(!this.props.openSummary)}}
                            >
                                Show Summary
                            </a>
                            <Button
                                className="ButtonSubmit"
                                onClick={this.props.submit}
                                color="primary"
                                //   autoFocus
                                disabled={this.props.blockSendButton}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}
const mapStateToProps = state => {
    return {
        openOrder: state.orderWindowReducer.openOrder,
        price: state.orderWindowReducer.price,
        quantity: state.orderWindowReducer.quantity,
        ship: state.orderWindowReducer.ship,
        checkNumber:state.orderWindowReducer.checkNumber,
        creditCard:state.orderWindowReducer.creditCard,
        agree:state.orderWindowReducer.agree,
        allowPublicationOfPartImages:state.orderWindowReducer.allowPublicationOfPartImages,
        functionOfPart:state.orderWindowReducer.functionOfPart,

        errors:state.orderWindowReducer.errors,

        blockSendButton:state.orderWindowReducer.blockSendButton
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeOrderModal: openOrder => {
            dispatch({ type: "CLOSE_ORDER", payload: openOrder });
        },
        updateSummaryWindow: openSummary => {
            dispatch({ type: "OPEN_SUMMARY_WINDOW", payload: openSummary });
        },
        changeAgree:value=>{
            dispatch({ type: "CHANGE_ORDER_AGREE", agree: value });
        },
        changeFunctionOfPart: value=>{
            dispatch({type:"CHANGE_ORDER_FUNCTION_OF_PART", functionOfPart:value});
        },
        changeAllowPublish: value=>{
            dispatch({type:"CHANGE_ORDER_ALLOW_PUBLISH", allow:value});
        },
        submit:()=>{
            dispatch({ type: "ORDER_SUBMIT"});
        }
    };
};
export default withRouter(
  connect(
      mapStateToProps,
      mapDispatchToProps
  )(OrderTemplate)
);
