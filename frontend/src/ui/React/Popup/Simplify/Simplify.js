/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../Divide/filename.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";
import {Slider} from "@material-ui/core";

class Simplify extends React.Component {

    changeErrorValue(e, value){
        this.props.changeErrorValue(value/100);
    }

    getValue(){
        return this.props.errorThreshold*100;
    }

    render() {
        return (
            <Dialog
                onBackdropClick={() => {
                    this.props.openModal(!this.props.open);
                    this.props.cancelCallback();
                }}
                maxWidth={false}
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                id='simplify-modal'
            >
                <DialogTitle>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Simplify</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="Content">
                        Tolerance {this.getValue().toFixed(0)+" %"}
                        <div className="slider">
                            <Slider
                                defaultValue={this.getValue()}
                                getAriaValueText={(val)=>`${val} %`}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={20}
                                onChange={this.changeErrorValue.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="Yes-No-buttons">
                        <Button
                            onClick={() => {
                                this.props.openModal(!this.props.open);
                                this.props.okCallback(this.props.count);
                            }}
                            style={{
                                backgroundColor: "#dddada",
                                boxShadow: "2px 2px 1px #000",
                                margin: "0 auto",
                                marginRight: "5px"
                            }}
                            color="primary"
                        >
                            Ок
                        </Button>
                        <Button
                            onClick={() => {
                                this.props.openModal(!this.props.open);
                                this.props.cancelCallback();
                            }}
                            style={{
                                backgroundColor: "#dddada",
                                boxShadow: "2px 2px 1px #000",
                                margin: "0 auto"
                            }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        open: state.simplifyWindowReducer.open,
        okCallback: state.simplifyWindowReducer.okCallback,
        cancelCallback: state.simplifyWindowReducer.cancelCallback,
        errorThreshold: state.simplifyWindowReducer.errorThreshold,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openModal: open => {
            dispatch({ type: "OPEN_SIMPLIFY_MODAL", payload: open });
        },
        changeErrorValue: errorValue =>{
            dispatch({ type: "CHANGE_SIMPLIFY_ERROR", errorThreshold: errorValue });
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Simplify);
