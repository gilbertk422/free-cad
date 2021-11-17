/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../Simplify/simlify.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";

class Divide extends React.Component {

    changeCount(e){
        let value = e.target.value;
        this.props.changeCount(value);
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
                id='file-name-modal'
            >
                <DialogTitle id="alert-dialog-title">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Divide</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="Content">
                        <div className="Text">
                            <input type="text"
                                   value={this.props.count}
                                onChange={this.changeCount.bind(this)}
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
        open: state.divideWindowReducer.openModal,
        okCallback: state.divideWindowReducer.okCallback,
        cancelCallback: state.divideWindowReducer.cancelCallback,
        count: state.divideWindowReducer.countParts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openModal: open => {
            dispatch({ type: "OPEN_DIVIDE_MODAL", payload: open });
        },
        changeCount: count =>{
            dispatch({ type: "CHANGE_DIVIDE_PARTS", parts: count });
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Divide);
