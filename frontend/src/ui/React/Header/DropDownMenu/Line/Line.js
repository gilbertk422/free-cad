/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../dropdown-menu.scss";

let Trigonometric = container.resolve('math').Trigonometric;

export default class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false,
      displaySubMenu: false,
      displaySubNudge: false,
      desktop: container.resolve('mobileDetector').mobile() == null,
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
    !this.state.displayMenu ? this.setState({displayMenu: true}) : this.setState({displayMenu: false, displaySubMenu: false});
  }

  showSubMenu = (event) => {
    event.preventDefault();
    this.setState({ displaySubMenu: true, displaySubMenuClass: "metismenu-container visible" }, () => {
      document.addEventListener("click", this.hideSubMenu);
    });
  }

  hideSubMenu = () => {
    this.setState({ displaySubMenu: false, displaySubMenuClass: "metismenu-container" }, () => {
      document.removeEventListener("click", this.hideSubMenu);
    });
  }

  toggleSubMenu = (event) => {
    event.stopPropagation();
    !this.state.displaySubMenu ? this.setState({ displaySubMenu: true}) : this.setState({ displaySubMenu: false});
  }

  showSubNudge = (event) => {
    console.log(event);
    event.preventDefault();
    this.setState({ displaySubNudge: true }, () => {
      document.addEventListener("click", this.hideSubNudge);
    });
  }

  hideSubNudge = () => {
    this.setState({ displaySubNudge: false }, () => {
      document.removeEventListener("click", this.hideSubNudge);
    });
  }

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
            <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">Line <span>&#x25BA;</span></a>
            <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
              <li className="metismenu-item" onClick={() => app.group()}><a className="metismenu-link" href="#">Group</a></li>
              <li className="metismenu-item" onClick={() => app.ungroup()}><a className="metismenu-link" href="#">Ungroup</a></li>
              <li className="metismenu-item" onClick={() => app.intersectSelectedElements()}><a className="metismenu-link" href="#" target="_blank" rel="noreferrer noopener">Intersect</a></li>
              <li className="metismenu-item" onClick={() => app.divideSelectElement()}><a className="metismenu-link" href="#" target="_blank" rel="noreferrer noopener">Divide</a></li>
              <li className="metismenu-item" onClick={() => app.corner()}><a className="metismenu-link" href="#">Corner</a></li>
              <li className="metismenu-item" onClick={() => app.tangentsSelectedArcs()}><a className="metismenu-link" href="#">Tangents</a></li>
              <li className="metismenu-item" onClick={() => app.simplify()}><a className="metismenu-link" href="#">Simplify</a></li>
              <li className="metismenu-item" onClick={this.toggleSubMenu}>
                <a className="metismenu-link" href="#">Mirror <span>&#x25BA;</span></a>
                <ul className={this.state.displaySubMenu ? "metismenu-container visible" : "metismenu-container"}>
                  <li className="metismenu-item" onClick={() => app.mirrorSelected(Trigonometric.axisX)}><a className="metismenu-link" href="#">Horizontally</a></li>
                  <li className="metismenu-item" onClick={() => app.mirrorSelected(Trigonometric.axisY)}><a className="metismenu-link" href="#">Vertically</a></li>
                </ul>
              </li>
            </ul>
        </li>
    )
  }

  desktopView() {
    return (
      <div className="Menu">
        <div
          className="btn"
          onClick={this.showDropdownMenu}
        >
          Line
          {this.state.displayMenu ? (
          <ul
          >
            <li onClick={() => app.group()}>
              {/* className="active" */}
              <a href="#">Group</a>
            </li>
            <li onClick={() => app.ungroup()}>
              <a href="#">Ungroup</a>
            </li>
            <li onClick={() => app.intersectSelectedElements()}>
              <a href="#" target="_blank" rel="noreferrer noopener">
                Intersect
              </a>
            </li>
            <li onClick={() => app.divideSelectElement()}>
              <a href="#" target="_blank" rel="noreferrer noopener">
                Divide
              </a>
            </li>
            <li onClick={()=>app.corner()}>
              <a href="#">Corner</a>
            </li>

              <li onClick={() => app.tangentsSelectedArcs()}>
                <a href="#">Tangents</a>
              </li>
            <li onClick={() => app.simplify()}>
              <a href="#">Simplify</a>
            </li>


              <li
                onMouseEnter={this.showSubMenu}
                onMouseLeave={this.hideSubMenu}
              >
                <a className="SubMenuBtn"href="#">
                  <span>Mirror</span>
                  <span>&#x25BA;</span>
                </a>
                {this.state.displaySubMenu ? (
                  <div className="SubMenu">
                    <ul>
                      <li onClick={() => app.mirrorSelected(Trigonometric.axisX)}>
                        <a href="#">Horizontally</a>
                      </li>
                      <li onClick={() => app.mirrorSelected(Trigonometric.axisY)}>
                        <a href="#">Vertically</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              {/* <li
                onMouseEnter={this.showSubNudge}
                onMouseLeave={this.hideSubNudge}
              >
                <a href="#" className="a-Nudge">
                  <span>Nudge</span>
                  <span>&#x25BA;</span>
                </a>
                {this.state.displaySubNudge ? (
                  <ul className="SubNudge">
                    <li onClick={()=>{app.moveSelected(0,app.config.moveStep);}}>
                      <a href="#">
                     Up  Up Arrow
                      </a>
                    </li>
                    <li onClick={()=>{app.moveSelected(0,-app.config.moveStep);}}>
                      <a href="#">
                      Down Down Arrow
                      </a>
                    </li>
                    <li onClick={()=>{app.moveSelected(-app.config.moveStep,0);}}>
                      <a href="#">
                      Left Left Arrow
                      </a>
                    </li>
                    <li onClick={()=>{app.moveSelected(app.config.moveStep,0);}}>
                      <a href="#">
                      Right Right Arrow
                      </a>
                    </li>
                  </ul>
                ) : null}
              </li> */}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}
