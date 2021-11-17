/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from 'react'
import '../dropdown-menu.scss'

export default class View extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            displayMenu: false,
            desktop: container.resolve('mobileDetector').mobile() == null
        }
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

    fullScreen () {
        document.documentElement.requestFullscreen();
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
                <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">View <span>&#x25BA;</span></a>
                <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
                    <li className="metismenu-item" onClick={this.fullScreen.bind(this)}><a className="metismenu-link" href="#">Fullscreen</a></li>
                </ul>
            </li>
        )
    }

    desktopView () {
        return (
            <div className="Menu">
                <div
                  className="btn"
                  onClick={this.showDropdownMenu}
                >
                    View
                    {this.state.displayMenu ? (
                        <ul>
                            <li>
                                <a href="#" onClick={this.fullScreen.bind(this)}>
                                    Fullscreen
                                </a>
                            </li>
                        </ul>
                    ) : null}
                </div>
            </div>
        )
    }
}
