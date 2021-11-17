/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./confirmation.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";

class Confirmation extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      // console.log(this.props, "props-Confirm");
      return (
        <Dialog
            onBackdropClick={() => {
              this.props.openConfirmModal(!this.props.openConfirm);
            }}
          maxWidth={false}
          open={this.props.openConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Confirmation</span>

              <Button
                onClick={() => {
                  this.props.openConfirmModal(!this.props.openConfirm);
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
            style={{
              padding: "10px",
              textAlign: "left",
              maxWidth: "600px",
              backgroundColor: "#f0ecec"
            }}
          >
            <div className="ConfirmContent">
              <div className="Info-Icon">
                <img width="40px" src="resources/images/InfoIcon.png" />
              </div>
              <div className="Text" dangerouslySetInnerHTML={{__html: this.props.message}}>
                {/*  Not for version 1.0
                  <p>
                      Tip: If you want to mirror the selection hold the CTRL key down and drag the appropriate selection handle to the
                      opposite side of the line.
                  </p>*/}
              </div>
            </div>

            <div className="Yes-No-buttons">
              <Button
                onClick={() => {
                  this.props.openConfirmModal(!this.props.openConfirm);
                  container
                    .resolve("confirmChangeArcToSplinesDialog")
                    .handleButton1();
                }}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  margin: "0 auto",
                  marginRight: "5px"
                }}
                color="primary"
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  this.props.openConfirmModal(!this.props.openConfirm);
                  container
                    .resolve("confirmChangeArcToSplinesDialog")
                    .handleButton2();
                }}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  margin: "0 auto"
                }}
                color="primary"
                //   autoFocus
              >
                No
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      openConfirm: state.confirmationReducer.openConfirm,
      message: state.confirmationReducer.message,
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      openConfirmModal: openConfirm => {
        dispatch({ type: "OPEN_CONFIRM", payload: openConfirm });
      }
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(Confirmation);
