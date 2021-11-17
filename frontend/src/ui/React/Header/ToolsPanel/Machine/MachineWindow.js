/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Machine from "./Machine"

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";

import './machineWindow.scss';

class MachineWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lineType: container.resolve('config').lineType
        };
    }

    resetToDefault = () => {
        this.props.updateCloseMachineModal(true,'straight',false);
    };

    changeLineType(lineType){
        this.setState({lineType});
    }

    openHelpURL(){
        window.open(this.state.lineType.helpURL);
    }

    ok(){
        this.props.updateCloseMachineModal(!this.props.openMachineModal,this.props.value,this.props.isCheckedStockMaterial);
        const item = app.config.defaultLineTypes.find(l => l.label === this.state.lineType.label);

        if (!item)
            return;
        localStorage.setItem('lineType', item.label);
        app.config.lineType = this.state.lineType;
        app.setElementsLineType(this.state.lineType);
    }

    componentWillUpdate(){

    }

    render(){
        return(
            <Dialog
                onBackdropClick={()=>this.props.updateCloseMachineModal(!this.props.openMachineModal,this.props.value,this.props.isCheckedStockMaterial)}
                maxWidth={false}
                open={this.props.openMachineModal}
                aria-labelledby="lineTypeDialogTitle"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="lineTypeDialogTitle">
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div>
                            <img width="25px" src="resources/images/icon.png"/>
                            <span>Machine</span>
                        </div>
                        <Button
                            onClick={()=>this.props.updateCloseMachineModal(!this.props.openMachineModal,this.props.value,this.props.isCheckedStockMaterial)}
                            color="primary"
                            >
                            <i className = "material-icons">
                                cancel_presentation
                            </i>
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent
                  style={{
                    maxWidth: "950px",
                    minHeight: "425px",
                    backgroundColor: "#f0ecec"
                  }}
                >
                    <Machine
                        history={this.props.history}
                        changeLineType={this.changeLineType.bind(this)}
                        lineType={this.state.lineType}
                    />
                </DialogContent>

                <DialogActions style={{display:'flex',justifyContent:'space-between'}}>
                    <Button
                        onClick={this.resetToDefault}
                        style={{ backgroundColor: "#dddada",textAlign:'left' }}
                        color="primary"
                        >
                            Reset to Default
                    </Button>
                    <div>
                        <Button
                            onClick={this.ok.bind(this)}
                            style={{ backgroundColor: "#dddada",marginRight:'10px' }}
                            color="primary"
                            >
                             OK
                        </Button>
                        <Button
                            onClick={()=>this.props.updateCloseMachineModal(!this.props.openMachineModal,this.props.value,this.props.isCheckedStockMaterial)}
                            style={{ backgroundColor: "#dddada", marginRight:'10px'}}
                            color="primary"
                            >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.openHelpURL.bind(this)}
                            style={{ backgroundColor: "#dddada" }}
                            color="primary"
                            >
                            Help
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
        openMachineModal: state.machineWindowReducer.openMachineModal,
        value:state.machineWindowReducer.value,
        isCheckedStockMaterial:state.machineWindowReducer.isCheckedStockMaterial
    }
};
     
const mapDispatchToProps = dispatch => {
    return {
        updateCloseMachineModal: (openMachineModal, value, isCheckedStockMaterial) => {
            dispatch({
                type: "CLOSE_MACHINE_MODAL",
                payload: openMachineModal,
                payloadValue: value,
                payloadIsChecked: isCheckedStockMaterial
            });
        }
    };
};
    
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MachineWindow))