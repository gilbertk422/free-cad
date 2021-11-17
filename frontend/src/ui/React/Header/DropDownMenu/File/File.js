/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import "../dropdown-menu.scss";
import React from "react";
import New from './New/New.js';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ConfirmSaveDesignModal from "./ConfirmSaveDesignModal";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Document from "../../../../../model/Document";


class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMenu: false,
            openNewModal: false,
            desktop: container.resolve('mobileDetector').mobile() == null
        };
    }

    showDropdownMenu = (event) => {
        event.preventDefault();
        this.setState({displayMenu: true}, () => {
            document.addEventListener("click", this.hideDropdownMenu);
        });
    };

    hideDropdownMenu = () => {
        this.setState({displayMenu: false}, () => {
            document.removeEventListener("click", this.hideDropdownMenu);
        });
    };

    toggleDropdownMenu = (event) => {
        event.preventDefault();
        !this.state.displayMenu ? this.setState({displayMenu: true}) : this.setState({displayMenu: false});
    }

    // --------------methods for NewModal Window-------------------------------------
    clickNewModal = event => {
        event.preventDefault();
        app.openDocument(new Document());
    };


    closeNewModal = () => {

        this.setState(
            prevState => ({openNewModal: prevState.openNewModal}),
            () => {
                this.setState({openNewModal: !this.state.openNewModal});
            }
        );
    };

    closeNewModalOfConfirm = (value) => {
        this.setState({ openNewModal: value })
     }
// ------------open link button Help----------
    openWindow = ()=> {
        window.open('https://www.emachineshop.com/help-wizards/')
    };

    openFile = e =>{
        Helper.openFile().then((file)=>{
            app.open(file);
        });
    };

    importFile = e =>{
        Helper.openFile().then((file)=>{
            app.open(file);
        });
    };

    render() {
        if (this.state.desktop) {
            return this.desktopView();
        } else {
            return this.mobileView();
        }
    }

    mobileView() {
        return (
            <li className="metismenu-item" onClick={this.toggleDropdownMenu}>
                <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">File <span>&#x25BA;</span></a>
                <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
                    <li className="metismenu-item" onClick={this.clickNewModal}><a className="metismenu-link" href="#">New</a></li>
                    <li className="metismenu-item" onClick={this.openFile}><a className="metismenu-link" href="#">Open</a></li>
                    <li className="metismenu-item" onClick={()=> app.saveAs('xml')}><a className="metismenu-link" href="#">Save As</a></li>
                    <li className="metismenu-item" onClick={()=> app.print()}><a className="metismenu-link" href="#">Print</a></li>
                    <li className="metismenu-item" onClick={()=>{app.restore()}}><a className="metismenu-link" href="#">Restore</a></li>
                </ul>
                <Dialog
                    maxWidth={false}
                    open={this.state.openNewModal}
                    onClose={this.handleClose}
                    onBackdropClick={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle
                        style={{ color: "black", textAlign: "left" }}
                        id="alert-dialog-title"
                    >
                        <img
                            width="25px"
                            src="resources/images/icon.png"
                        />
                        <span>New Design</span>
                    </DialogTitle>

                    <DialogContent

                        style={{ maxWidth: "950px",minHeight:'425px', backgroundColor: "#f0ecec" }}
                    >
                        <New history={this.props.history}/>
                    </DialogContent>

                    <DialogActions>
                        <Button
                             onClick={() => {
                                this.props.updateConfirmSaveDesign(!this.props.openConfirmSaveDesign);
                                // this.closeNewModal
                                      }}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                        >
                            OK
                        </Button>
                        <Button
                            onClick={this.closeNewModal}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.openWindow}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                            // https://www.emachineshop.com/help-wizards/''
                        >
                            Help
                        </Button>
                    </DialogActions>
                </Dialog>
                <ConfirmSaveDesignModal closeNewModalOfConfirm ={this.closeNewModalOfConfirm}/>
            </li>
        )
    }

    desktopView() {
        return (
            <div className="Menu">
                <div className="btn" onClick={this.showDropdownMenu} >
                    File
                    {this.state.displayMenu ? (
                        <ul>
                            <li onClick={this.clickNewModal}>
                                <a href="#">New</a>
                            </li>
                            <li onClick={this.openFile}>
                                <a href="#">Open</a>
                            </li>
                            <li onClick={()=> app.saveAs('xml')}>
                                <a href="#">Save As</a>
                            </li>
                            {/*<li onClick={this.importFile}>*/}
                                {/*<a href="#">Import</a>*/}
                            {/*</li>*/}
                            <li onClick={()=> app.print()}>
                                <a href="#">Print</a>
                            </li>
                            <li onClick={()=> app.setTracingPaper()}>
                                <a href="#">Tracing paper</a>
                            </li>
                            <li onClick={()=>{app.restore()}}>
                                <a href="#">
                                    Restore
                                </a>
                            </li>
                            {/*<li>*/}
                                {/*<a href="#">Exit</a>*/}
                            {/*</li>*/}
                        </ul>
                    ) : null}
                </div>
                <Dialog
                    maxWidth={false}
                    open={this.state.openNewModal}
                    onClose={this.handleClose}
                    onBackdropClick={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle
                        style={{ color: "black", textAlign: "left" }}
                        id="alert-dialog-title"
                    >
                        <img
                            width="25px"
                            src="resources/images/icon.png"
                        />
                        <span>New Design</span>
                    </DialogTitle>

                    <DialogContent

                        style={{ maxWidth: "950px",minHeight:'425px', backgroundColor: "#f0ecec" }}
                    >
                        <New history={this.props.history}/>
                    </DialogContent>

                    <DialogActions>
                        <Button
                             onClick={() => {
                                this.props.updateConfirmSaveDesign(!this.props.openConfirmSaveDesign);
                                // this.closeNewModal
                                      }}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                        >
                            OK
                        </Button>
                        <Button
                            onClick={this.closeNewModal}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.openWindow}
                            style={{
                                    backgroundColor: "#dddada",
                                    boxShadow: "2px 2px 1px #000"
                                  }}
                            color="primary"
                            // https://www.emachineshop.com/help-wizards/''
                        >
                            Help
                        </Button>
                    </DialogActions>
                </Dialog>
                <ConfirmSaveDesignModal closeNewModalOfConfirm ={this.closeNewModalOfConfirm}/>
            </div>
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
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(File));