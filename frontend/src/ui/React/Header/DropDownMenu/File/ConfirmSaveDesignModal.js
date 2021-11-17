/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { connect } from "react-redux";

class ConfirmSaveDesignModal extends React.Component {
  constructor(props) {
    super(props);
  }

        saveDesignYes=()=>{
            app.saveAs('xml');
            this.props.updateConfirmSaveDesign(
                !this.props.openConfirmSaveDesign
            );
        }
        saveDesignNo = () =>{
            app.selectAll();
            app.deleteSelected();
            this.props.updateConfirmSaveDesign(
                !this.props.openConfirmSaveDesign
            );
            this.props.closeNewModalOfConfirm(false);
        }
        render() {
            // console.log(this.props, "props-ConfirmRemove");
            return (
                <Dialog
                    maxWidth={false}
                    open={this.props.openConfirmSaveDesign}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div
                        style={{
                            paddingBottom: "0px",
                            textAlign: "left",
                            maxWidth: "350px",
                            // height: "180px",
                            backgroundColor: "#f0ecec"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "5px",
                                paddingLeft: "15px"
                            }}
                        >
                            <span>Confirm</span>

                            <Button
                                onClick={() => {
                                    this.props.updateConfirmSaveDesign(!this.props.openConfirmSaveDesign)
                                }}
                                style={{
                                    backgroundColor: "#f0ecec",
                                    padding: "0px"
                                }}
                                color="primary"
                            >
                                <i className="material-icons">cancel_presentation</i>
                            </Button>
                        </div>
                        <div
                            className="Text"
                            style={{ margin: "15px 15px", textAlign: "left" }}
                        >
                            <img width="30px" src="resources/images/Quest1.png" />
                            <p
                                style={{
                                    position: "relative",
                                    bottom: "25px",
                                    marginLeft: "40px",
                                    textAlign: "left"
                                }}
                            >
                                The design has been modified. Save it?
                </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px"
                            }}
                        >
                            <Button
                                onClick={this.saveDesignYes}
                                style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000",
                                    marginRight: "5px",
                                    padding: "2px 2px"
                                }}
                                color="primary"
                            >
                                Yes
                </Button>
                            <Button
                                onClick={
                                    this.saveDesignNo
                                }
                                style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000",
                                    marginRight: "5px",
                                    padding: "2px 2px"
                                }}
                                color="primary"
                            >
                                No
                </Button>
                            <Button
                                onClick={() => {
                                    this.props.updateConfirmSaveDesign(
                                        !this.props.openConfirmSaveDesign
                                    );
                                }}
                                style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000",
                                    marginLeft: "5px",
                                    marginRight: "5px",

                                    padding: "2px 2px"
                                }}
                                color="primary"
                            >
                                Cancel
                </Button>
                        </div>
                    </div>
                </Dialog>
            );
        }
}

const mapStateToProps = state => {
  return {
    openConfirmSaveDesign: state.confirmSaveDesignReducer.openConfirmSaveDesign
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateConfirmSaveDesign: openConfirmSaveDesign => {
      dispatch({
        type: "OPEN_CONFIRM_SAVE_DESIGN",
        payload: openConfirmSaveDesign
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSaveDesignModal);
