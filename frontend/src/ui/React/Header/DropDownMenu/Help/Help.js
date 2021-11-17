/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../dropdown-menu.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


export default class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false,
      displaySubMenu: false,
      open: false,
      openSubModal: false,
      openSuggestionModal: false,
      suggestion: false,
      tech_support: false,
      release: 'September 1, 2019',
      desktop: container.resolve('mobileDetector').mobile() == null,
    };
  }

  outputFlat2D = () => {
    let doc = Helper.Request.httpGet("/resources/doc/Flat2D.emsx");
    var file = new File([doc], "Flat2D.emsx");
    app.open(file);
  };

  outputTutorial = ()=>{
    let doc = Helper.Request.httpGet("/resources/doc/tutorial.new.emsx");
    var file = new File([doc], "tutorial.emsx");
    app.open(file);
  };

  outputBend2D = () => {
    let doc = Helper.Request.httpGet("resources/doc/Bend2D.emsx");
    var file = new File([doc], "Bend2D.emsx");
    app.open(file);
  };

  showDropdownMenu = event => {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  };

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  };

  toggleDropdownMenu = (event) => {
    event.preventDefault();
    !this.state.displayMenu ? this.setState({displayMenu: true}) : this.setState({displayMenu: false});
  }

  showSubMenu = event => {
    event.preventDefault();
    this.setState({ displaySubMenu: true }, () => {
      document.addEventListener("click", this.hideSubMenu);
    });
  };

  hideSubMenu = () => {
    this.setState({ displaySubMenu: false }, () => {
      document.removeEventListener("click", this.hideSubMenu);
    });
  };

  handleOpenTechSupport() {
    global.store.dispatch({ type: "OPEN_TECH_SUPPORT" });
  }

  handleOpenFeedback() {
    console.log("feedback 1");
    global.store.dispatch({ type: "OPEN_FEEDBACK" });
  }
  // -----Dialog MOdal About-----

  handleClickOpen = event => {
    event.preventDefault();
    this.setState(
      prevState => ({ open: !prevState.open }),
      () => {
        this.setState({ open: this.state.open });
      }
    );
  };

  handleClose = () => {
    this.setState(
      prevState => ({ open: prevState.open }),
      () => {
        this.setState({ open: !this.state.open });
      }
    );
  };
  // --------------methods for SubModal Window-------------------------------------
  clickSubModal = event => {
    event.preventDefault();
    this.setState({
      openSubModal: true
    });
  };

  closeSubModal = () => {
    this.setState(
      prevState => ({ openSubModal: prevState.openSubModal }),
      () => {
        this.setState({ openSubModal: !this.state.openSubModal });
      }
    );
  };

  // ------------open link Video Tutorial----------
  openWindow = () => {
    window.open("https://www.emachineshop.com/video-tutorials/");
  };
  openHelpLink = () => {
    window.open("https://www.emachineshop.com/help/");
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
        <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">Help <span>&#x25BA;</span></a>
        <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
            <li className="metismenu-item" onClick={this.outputTutorial}><a className="metismenu-link" href="#">Drawing tutorial</a></li>
            <li className="metismenu-item" onClick={this.openHelpLink}><a className="metismenu-link" href="https://www.emachineshop.com/help/" target="_blank" rel="noreferrer noopener">User Guide</a></li>
            <li className="metismenu-item" onClick={this.openWindow}><a className="metismenu-link" href="https://www.emachineshop.com/video-tutorials/" target="_blank" rel="noreferrer noopener">Video Tutorials</a></li>
            <li className="metismenu-item" onClick={() => {window.open('https://www.emachineshop.com/free-download/');}}><a className="metismenu-link" href="#">Windows version</a></li>
            <li className="metismenu-item" onClick={this.handleOpenTechSupport.bind(this)}><a className="metismenu-link" href="#">Tech Support</a></li>
            <li className="metismenu-item" onClick={this.handleOpenFeedback.bind(this)}><a className="metismenu-link" href="#">Feedback</a></li>
            <li className="metismenu-item" onClick={this.handleClickOpen}><a className="metismenu-link" href="#">About</a></li>
        </ul>
        {/* -------------------------About window-------------------------------------------- */}
        <Dialog
          open={this.state.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">About eMachineShop CAD</DialogTitle>
          <DialogContent
            className="Content"
            style={{ background: "#f0ecec", padding: 10 }}
          >
            <div
              id="alert-dialog-description"
              style={{ maxWidth: "280px", color: "black" }}
            >
              <div
                className="ContentHeader"
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                <img width="45px" src="resources/images/icon.png" />
                <DialogContentText
                  style={{ textAlign: "center", color: "black", marginLeft: '45px' }}
                >
                  Version 1.0.3
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
                  Released {this.state.release}
                </DialogContentText>

              </div>
              <div
                className="ContentBottom"
                style={{ textAlign: "center", padding: 0 }}
              >
                <DialogContentText
                  style={{ margonBottom: "5px", padding: "5px" }}
                >
                  Copyright&copy; 2018-2019
                </DialogContentText>

                <DialogContentText>
                  <a
                    href="https://www.emachineshop.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    eMachineShop
                  </a>
                </DialogContentText>
              </div>
            </div>
            <div className="OK-buttons" style={{ textAlign: 'center' }}>

              <Button
                onClick={this.handleClose}
                style={{ backgroundColor: "#dddada", boxShadow: "2px 2px 1px #000", margin: '0 auto' }}
                color="primary"
              >
                OK
              </Button>
              {/*
               <Button
                onClick={this.clickSubModal}
                style={{ backgroundColor: "#f0ecec", color: "orangered" }}
                color="primary"
              >
                Licenses...
              </Button>
           */}
            </div>
          </DialogContent>


        </Dialog>
        {/* ----------------------------------------------------------------------   */}
        {/* SubModalWindow-License */}

        <Dialog
          onClick={this.clickSubModal}
          style={{
            maxWidth: "800px",
            minHeight: "750px",
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
            style={{ maxWidth: "400px", background: "#f0ecec", padding: 10 }}
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
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* <DialogMaterialUi open={this.state.open} /> */}
    </li>
    )
  }

  desktopView() {
    return (
      <div className="Menu">
        <div className="btn" onClick={this.showDropdownMenu} >
          Help
          {this.state.displayMenu ? (
            <ul>
              <li
              // onMouseEnter={this.showSubMenu}
              // onMouseLeave={this.hideSubMenu}
              >
                <a href="#" onClick={this.outputTutorial}>
                  Drawing tutorial
                  {/*<span>&#x25BA;</span>*/}
                </a>
                {/*{this.state.displaySubMenu ? (*/}
                {/*<ul className="Submenu">*/}
                {/*<li onClick={this.outputFlat2D}>*/}
                {/*<a href="#">Flat 2D</a>*/}
                {/*</li>*/}
                {/*<li onClick={this.outputBend2D}>*/}
                {/*<a href="#">Bend 2D</a>*/}
                {/*</li>*/}
                {/*</ul>*/}
                {/*) : null}*/}
              </li>
              <li onClick={this.openHelpLink}>
                <a
                  href="https://www.emachineshop.com/help/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  User Guide
                </a>
              </li>
              <li onClick={this.openWindow}>
                <a
                  href="https://www.emachineshop.com/video-tutorials/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Video Tutorials
                </a>
              </li>
              <li onClick={() => {
                window.open('https://www.emachineshop.com/free-download/');
              }}>
                <a href="#">Windows version</a>
              </li>
              <li onClick={this.handleOpenTechSupport.bind(this)}>
                <a href="#">Tech Support</a>
              </li>
              <li onClick={this.handleOpenFeedback.bind(this)}>
                <a href="#">Feedback</a>
              </li>
              <li onClick={this.handleClickOpen}>
                <a href="#">About</a>
              </li>
            </ul>
          ) : null}
        </div>

        {/* -------------------------About window-------------------------------------------- */}
        <Dialog
          open={this.state.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">About eMachineShop CAD</DialogTitle>
          <DialogContent
            className="Content"
            style={{ background: "#f0ecec", padding: 10 }}
          >
            <div
              id="alert-dialog-description"
              style={{ maxWidth: "280px", color: "black" }}
            >
              <div
                className="ContentHeader"
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                <img width="45px" src="resources/images/icon.png" />
                <DialogContentText
                  style={{ textAlign: "center", color: "black", marginLeft: '45px' }}
                >
                  Version 1.0.3
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
                  Released {this.state.release}
                </DialogContentText>

              </div>
              <div
                className="ContentBottom"
                style={{ textAlign: "center", padding: 0 }}
              >
                <DialogContentText
                  style={{ margonBottom: "5px", padding: "5px" }}
                >
                  Copyright&copy; 2018-2019
                </DialogContentText>

                <DialogContentText>
                  <a
                    href="https://www.emachineshop.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    eMachineShop
                  </a>
                </DialogContentText>
              </div>
            </div>
            <div className="OK-buttons" style={{ textAlign: 'center' }}>

              <Button
                onClick={this.handleClose}
                style={{ backgroundColor: "#dddada", boxShadow: "2px 2px 1px #000", margin: '0 auto' }}
                color="primary"
              >
                OK
              </Button>
              {/*
               <Button
                onClick={this.clickSubModal}
                style={{ backgroundColor: "#f0ecec", color: "orangered" }}
                color="primary"
              >
                Licenses...
              </Button>
           */}
            </div>
          </DialogContent>


        </Dialog>
        {/* ----------------------------------------------------------------------   */}
        {/* SubModalWindow-License */}

        <Dialog
          onClick={this.clickSubModal}
          style={{
            maxWidth: "800px",
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
            style={{ maxWidth: "400px", background: "#f0ecec", padding: 10 }}
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
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* <DialogMaterialUi open={this.state.open} /> */}
      </div>
    );
  }
}
