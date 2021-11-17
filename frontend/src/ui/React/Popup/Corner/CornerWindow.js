/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import Corner from "./Corner";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#corner-dialog-title"
        >
            <Paper {...props} />
        </Draggable>
    );
}

class CornerWidow extends React.Component {
    constructor(props) {
        super(props);
    }


    handleOkCornerModal(){
        this.props.updateCornerModal(!this.props.openCornerModal);
        this.props.okCallback();
    }

    handleCloseCornerModal(){
        this.props.updateCornerModal(!this.props.openCornerModal);
        this.props.cancelCallback();
    }

    openHelp(){
        window.open("https://www.emachineshop.com/help-2d-drawing/#rounding-corners");
    }

    render() {
        return (
            <Dialog
                onBackdropClick={this.handleCloseCornerModal.bind(this)}
                maxWidth={false}
                open={this.props.openCornerModal}
                PaperComponent={PaperComponent}
                aria-labelledby="corner-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    style={{ color: "black", textAlign: "left" }}
                    id="corner-dialog-title"
                >
                    <div style={{display:'flex',justifyContent:"space-between"}}>
                        <span>Corner</span>
                        <Button
                            onClick={this.handleCloseCornerModal.bind(this)}
                            style={{
                                backgroundColor: "#fff",
                                padding:'0px',

                            }}
                            color="primary"
                        >
                            <i className="material-icons">
                                cancel_presentation
                            </i>
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent
                    style={{
                        textAlign: "left",
                        maxWidth: "550px",
                        minHeight: "375px",
                        backgroundColor: "#f0ecec"
                    }}
                >
                    <Corner />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={this.handleOkCornerModal.bind(this)}
                        style={{
                            backgroundColor: "#dddada",
                            boxShadow: "2px 2px 1px #000"
                        }}
                        color="primary"
                    >
                        OK
                    </Button>
                    <Button
                        onClick={this.handleCloseCornerModal.bind(this)}
                        style={{
                            backgroundColor: "#dddada",
                            boxShadow: "2px 2px 1px #000"
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.openHelp.bind(this)}
                        style={{
                            backgroundColor: "#dddada",
                            boxShadow: "2px 2px 1px #000"
                        }}
                        color="primary"
                    >
                        Help
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        openCornerModal: state.cornerWindowReducer.openCornerModal,
        okCallback:state.cornerWindowReducer.okCallback,
        cancelCallback:state.cornerWindowReducer.cancelCallback
    };
};
  
const mapDispatchToProps = dispatch => {
    return {
        updateCornerModal: openCornerModal => {
            dispatch({
                type: "OPEN_CORNER_MODAL",
                payload: openCornerModal,
            });
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CornerWidow);