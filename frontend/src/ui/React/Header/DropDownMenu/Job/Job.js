/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../dropdown-menu.scss";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Settings from "./Settings/Settigs";
import Price from "../../../Popup/Price/Price";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Material from '../../UpMenu/RightButtons/Material';
import SelectFinish from '../../UpMenu/RightButtons/SelectFinish';

//working  import 

class Job extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      displayMenu: false,
      openSubModal: false,
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

  // --------------methods for SubModal Window-------------------------------------
  clickSubModal = event => {
    event.preventDefault();
    this.setState({
      openSubModal: true
    });
  };

  closeSubModal = () => {
    this.setState({ openSubModal: !this.state.openSubModal });
  };

  // -------------------------------------openLinkHelp---------------------------------------
  openLinkHelp = () => {
    window.open(
      "https://www.emachineshop.com/help-ordering/#address-and-payment"
    );
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
        <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">Job <span>&#x25BA;</span></a>
        <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
          <li className="metismenu-item" onClick={this.clickSubModal}><a className="metismenu-link" href="#">Settings</a></li>
          <li className="metismenu-item" onClick={()=>{window.open('https://www.emachineshop.com/help-ordering/#pre-order-checklist');}}><a className="metismenu-link" target="_blank" rel="noreferrer noopener"> Pre-Order Checklist </a></li>
          <li className="metismenu-item" onClick={()=>{window.open('https://www.emachineshop.com/order-status');}}><a className="metismenu-link" target="_blank" rel="noreferrer noopener"> Order status </a></li>
          <li className="metismenu-item" onClick={()=>{this.props.openPriceModal(!this.props.openPrice);}}><a className="metismenu-link" href="#">Review & Place Order...</a></li>
          <Material></Material>
          <SelectFinish></SelectFinish>
        </ul>
        <Dialog
          maxWidth="lg"
          fullWidth={true}
          open={this.state.openSubModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={this.closeSubModal}
        >
        <DialogTitle
          style={{ color: "black", textAlign: "left" }}
          id="alert-dialog-title"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <img
                  width="25px"
                  src="resources/images/icon.png"
              />
              <span style={{ marginLeft: "5px" }}>Job settings</span>
            </div>
            <Button
                onClick={this.closeSubModal}
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
            backgroundColor: "#f0ecec"
          }}
        >
          <Settings history={this.props.history}/>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.closeSubModal}
            style={{ backgroundColor: "#f0ecec" }}
            color="primary"
          >
            OK
          </Button>
          <Button
            onClick={this.closeSubModal}
            style={{ backgroundColor: "#f0ecec" }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={this.openLinkHelp}
            style={{ backgroundColor: "#f0ecec" }}
            color="primary"
          >
            Help
          </Button>
        </DialogActions>
      </Dialog>
    </li>
    )
  }

  desktopView() {
    // console.log(this.props, "props-Job");

    return (
      <div className="Menu">
        <div
          className="btn"
          onClick={this.showDropdownMenu}
        >
          Job
          {this.state.displayMenu ? (
            <ul>
              <li onClick={this.clickSubModal}>
                <a href="#">Settings</a>
              </li>
              <li onClick={()=>{
                  window.open('https://www.emachineshop.com/help-ordering/#pre-order-checklist');
                }}>
                <a target="_blank" rel="noreferrer noopener"> Pre-Order Checklist </a>
              </li>
              <li onClick={()=>{
                window.open('https://www.emachineshop.com/order-status');
              }}>
                <a target="_blank" rel="noreferrer noopener"> Order status</a>
              </li>
              <li 
                onClick={() => {
                  this.props.openPriceModal(!this.props.openPrice);
                } }
                  >
                <a href="#">Review & Place Order...</a>
              </li>
            </ul>
          ) : null}
        </div>
        <Dialog
          maxWidth="lg"
          fullWidth={true}
          open={this.state.openSubModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={this.closeSubModal}
        >
          <DialogTitle
            style={{ color: "black", textAlign: "left" }}
            id="alert-dialog-title"
          >

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <img
                    width="25px"
                    src="resources/images/icon.png"
                />
                <span style={{ marginLeft: "5px" }}>Job settings</span>
              </div>
              <Button
                  onClick={this.closeSubModal}
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
              backgroundColor: "#f0ecec"
            }}
          >
            <Settings history={this.props.history}/>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.closeSubModal}
              style={{ backgroundColor: "#f0ecec" }}
              color="primary"
            >
              OK
            </Button>
            <Button
              onClick={this.closeSubModal}
              style={{ backgroundColor: "#f0ecec" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.openLinkHelp}
              style={{ backgroundColor: "#f0ecec" }}
              color="primary"
            >
              Help
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    openPrice: state.priceReducer.openPrice
  };
};
const mapDispatchToProps = dispatch => {
  return {
    openPriceModal: openPrice => {
      app.priceAnalyze();
    }
  };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Job));