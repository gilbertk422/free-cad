/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { connect } from "react-redux";

class ConfirmRemoveGrooves extends React.Component {
  constructor(props) {
    super(props);
 
  }

  removeOK=()=>{
    this.props.groovesData.splice(this.props.selectValue,1);
// console.log(this.props.groovesData,'newArr-groovesremove')
    this.props.updateRemoveGrooves(!this.props.openRemoveGrooves)
  }

  render() {
    // console.log(this.props, "props-ConfirmRemove");
    return (
      <Dialog
        onBackdropClick={() => {
            this.props.updateRemoveGrooves(!this.props.openRemoveGrooves)
        }}
        maxWidth={false}
        open={this.props.openRemoveGrooves}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          style={{
            paddingBottom: "0px",
            textAlign: "left",
            maxWidth: "250px",
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
                    this.props.updateRemoveGrooves(!this.props.openRemoveGrooves)
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
            >Remove groove?
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
              onClick={this.removeOK}
              style={{
                backgroundColor: "#dddada",
                boxShadow: "2px 2px 1px #000",
                marginRight: "5px",
                padding: "2px 2px"
              }}
              color="primary"
            >
              OK
            </Button>
            <Button
              onClick={() => {
        this.props.updateRemoveGrooves(!this.props.openRemoveGrooves)
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
    openRemoveGrooves: state.removeGroovesReducer.openRemoveGrooves

  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateRemoveGrooves: (
        openRemoveGrooves
    ) => {
      dispatch({
        type: "OPEN_REMOVE_GROOVES",
        payload: openRemoveGrooves,
    
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRemoveGrooves);
