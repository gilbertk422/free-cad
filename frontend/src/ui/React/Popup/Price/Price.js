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
import PriceContent from "./PriceContent";
class Price extends React.Component {
    constructor(props) {
        super(props);
    }

    openHelpPrice = () => {
        window.open("https://www.emachineshop.com/help-ordering/#pricing");
    };

  render() {
    // console.log(this.props, "props-Price");
    return (<>

      <Dialog
          onBackdropClick={() => {
              this.props.closePriceModal(!this.props.openPrice);
          }}
        maxWidth={false}
        open={this.props.openPrice}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ color: "black", textAlign: "left" }}
          id="alert-dialog-title"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <img width="25px" src="resources/images/icon.png" />
              <span style={{ marginLeft: "5px" }}>Price</span>
            </span>
            <Button
              onClick={() => {
                this.props.closePriceModal(!this.props.openPrice);
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
            paddingBottom: "0px",
            textAlign: "left",
            maxWidth: "800px",
            minHeight: "440px",
            backgroundColor: "#f0ecec"
          }}
        >
          <PriceContent history={this.props.history} open={this.props.openPrice}/>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.props.closePriceModal(!this.props.openPrice)}
            style={{
              backgroundColor: "#dddada",
              boxShadow: "2px 2px 1px #000"
            }}
            color="primary"
          >
            OK
          </Button>
          <Button
            onClick={() => {this.props.closePriceModal(!this.props.openPrice);
            }}
            style={{
              backgroundColor: "#dddada",
              boxShadow: "2px 2px 1px #000"
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={this.openHelpPrice}
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
      </>
    );
  }
}
const mapStateToProps = state => {
    return {
        openPrice: state.priceReducer.openPrice
        // openOrder: state.priceReducer.openOrder,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closePriceModal: openPrice => {
            dispatch({ type: "CLOSE_PRICE", payload: openPrice });
        }
    };
};
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Price));
