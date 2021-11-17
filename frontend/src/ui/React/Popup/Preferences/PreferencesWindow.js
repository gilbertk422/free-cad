/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Preferences from "./Preferences";
import {connect} from "react-redux";

class PreferencesWidow extends React.Component {
    openHelpPreferences = () => {
        window.open("https://www.emachineshop.com/help-preferences/#measurements");
    };

    render() {
        return (
            <Dialog
                onBackdropClick={this.props.closeModal}
                maxWidth={false}
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    style={{color: "black", textAlign: "left"}}
                    id="alert-dialog-title"
                >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <span>Preferences</span>
                        </div>
                        <Button
                            onClick={this.props.closeModal}
                            style={{backgroundColor: '#fff', padding: '0px'}}
                            color="primary"
                        >
                            <i className="material-icons">cancel_presentation</i>
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent
                    style={{
                        textAlign: "left",
                        maxWidth: "550px",
                        minHeight: "400px",
                        backgroundColor: "#f0ecec"
                    }}
                >
                    <Preferences/>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={this.props.applyPreferences}
                        style={{
                            backgroundColor: "#dddada",
                            boxShadow: "2px 2px 1px #000"
                        }}
                        color="primary"
                    >
                        OK
                    </Button>
                    <Button
                        onClick={this.props.closeModal}
                        style={{
                            backgroundColor: "#dddada",
                            boxShadow: "2px 2px 1px #000"
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.openHelpPreferences}
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
        open: state.preferencesReducer.popup.open
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeModal: () => {
            dispatch({type: "CLOSE_PREFERENCE_POPUP"});
        },
        applyPreferences: () => {
            dispatch({type: "APPLY_PREFERENCES"});
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesWidow);