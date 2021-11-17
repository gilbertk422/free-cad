/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
export default class DialogMaterialUi extends React.Component {
    constructor(props){
super(props);
console.log(this.props.open,'props.open');
this.state={
    open: this.props.open,
    openSubModal: false
}
console.log(this.state.open,'state.open');

    }
    componentDidMount(){
        this.setState=({
            open: this.props.open,
        })
        console.log(this.state.open,'didMount')
    }
  // -----Dialog MOdal-----

//   handleClickOpen=(event)=> {
//     event.preventDefault();
//     this.setState(
//       prevState => ({ open: !prevState.open }),
//       () => {
//         this.setState({ open: this.state.open });
//       }
//     );
//   }

//   handleClose=()=> {
//     this.setState(
//       prevState => ({ open: prevState.open }),
//       () => {
//         this.setState({ open: this.state.open });
//       }
//     );
//   }
handleClose=(e)=> {
    e.preventDefault();
    // this.setState(
    //   prevState => ({ open: prevState.open }),
    //   () => {
    //     this.setState({ open: this.state.open });
    //   }
    // );
    // this.state.open=this.props.open;
    this.setState({open:!this.props.open})
    console.log(this.state.open,'close')
  }
//   --------------methods for SubModal Window-------------------------------------
  clickSubModal=(event)=> {
    event.preventDefault();
    this.setState({
      openSubModal: true
     
    });
  }

  closeSubModal=()=> {
  
    this.setState(
      prevState => ({ openSubModal: prevState.openSubModal }),
      () => {
        this.setState({ openSubModal: !this.state.openSubModal });
      }
    );
  }
      render(){
console.log(this.state.open,'render-state.open');

  return (
    <Fragment>
  <Dialog
        //   onClick={this.handleClickOpen}
          style={{
            backgroundColor: "transparent",
            maxWidth: "400px",
            minHeight: "750px",
            margin: "0 auto"
          }}
        //   open={this.state.open}
          open={this.state.open}

          // onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            style={{ height: "10px", color: "black", textAlign: "center" }}
            id="alert-dialog-title"
          >
            About eMashine shop
          </DialogTitle>
          <DialogContent
            className="Content"
            style={{ background: "#f0ecec", padding: 10 }}
          >
            {/* <Typography> */}
              <div
                id="alert-dialog-description"
                style={{ height: "320px", maxWidth: "280px", color: "black" }}
              >
                <div
                  className="ContentHeader"
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <img
                    width="45px"
                    src="resources/images/icon.png"
                    // data-tip="<span>Shows how to use numeric values.</span>"
                  />
                  <DialogContentText
                    style={{ textAlign: "center", color: "black" }}
                  >
                    {" "}
                    eMashine Shop&reg;Version 1.931.1.26
                  </DialogContentText>
                </div>
                <div
                  className="ContentTop"
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    padding: 5
                  }}
                >
                  <DialogContentText>
                    {" "}
                    Compilation Data: 22.11.2018
                  </DialogContentText>
                  <DialogContentText>
                    {" "}
                    Price file number: 3527
                  </DialogContentText>
                  <DialogContentText>
                    {" "}
                    Program folder: C:\ProgramFiles(x86)\eMashineshop
                  </DialogContentText>
                </div>
                <div
                  className="ContentBottom"
                  style={{ textAlign: "center", padding: 0 }}
                >
                  <DialogContentText
                    style={{ margonBottom: "5px", padding: "5px" }}
                  >
                    {" "}
                    Copyright&copy; 2003-2018 eMashineshop&reg;
                  </DialogContentText>
                  <DialogContentText style={{ margon: "5px", padding: "5px" }}>
                    {" "}
                    CAD version is current
                  </DialogContentText>
                  <DialogContentText style={{ margon: "5px", padding: "5px" }}>
                    {" "}
                    Price File is current
                  </DialogContentText>
                  <DialogContentText>
                    <a
                      href="https://www.emachineshop.com/"

                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      www.emachineshop.com
                    </a>
                  </DialogContentText>
                </div>
              </div>
          </DialogContent>

          <DialogActions>
            <Button
            //   onClick={this.clickSubModal}
              style={{ backgroundColor: "#f0ecec", color: "orangered" }}
              color="primary"
            >
              Licenses...
            </Button>
            <Button
              onClick={this.handleClose}
              style={{ backgroundColor: "#f0ecec", color: "orangered" }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* ----------------------------------------------------------------------   */}
        {/* SubModalWindow-License */}

        {/* <Dialog
          onClick={this.clickSubModal}
          style={{
            width: "800px",
            height: "750px",
            margin: "0 auto"
          }}
          open={this.state.openSubModal}
          // onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            style={{ height: "10px", color: "black", textAlign: "left" }}
            id="alert-dialog-title"
          >
            Licenses
          </DialogTitle>
          <DialogContent
            style={{ width: "400px", background: "#f0ecec", padding: 10 }}
          >
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Free Type</div>
                <div>
                  <a
                    href="https://www.freetype.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>

            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Indy</div>
                <div>
                  <a
                    href="https://www.indyproject.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>

            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>GLTT</div>
                <div>
                  <a
                    href="http://gltt.sourceforge.net/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Open CASCADE</div>
                <div>
                  <a
                    href="https://www.opencascade.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>FastMM</div>
                <div>
                  <a
                    href="https://sourceforge.net/projects/fastmm/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>JEDY Code Library</div>
                <div>
                  <a
                    href="http://www.delphi-jedi.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: "10px" }}
                  >
                    homepage
                  </a>
                  <a href="" target="_blank" rel="noreferrer noopener">
                    show license
                  </a>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.closeSubModal}
              style={{ backgroundColor: "#878787", color: "orangered" }}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog> */}
    </Fragment>
  );
}
}