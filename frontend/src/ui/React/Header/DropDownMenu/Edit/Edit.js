/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "../dropdown-menu.scss";
import {connect} from "react-redux";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMenu: false,
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
                <a className={this.state.displayMenu ? "metismenu-link active" : "metismenu-link"} href="#">Edit <span>&#x25BA;</span></a>                
                <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
                    <li className="metismenu-item" onClick={() => app.undo()}><a className="metismenu-link" href="#">Undo</a></li>
                    <li className="metismenu-item" onClick={() => app.redo()}><a className="metismenu-link" href="#">Redo</a></li>
                    <li className="metismenu-item" onClick={() => container.resolve('buffer').cut()}><a className="metismenu-link" href="#">Cut</a></li>
                    <li className="metismenu-item" onClick={() => container.resolve('buffer').copy()}><a className="metismenu-link" href="#">Copy</a></li>
                    <li className="metismenu-item" onClick={() => container.resolve('buffer').paste()}><a className="metismenu-link" href="#">Paste</a></li>
                    <li className="metismenu-item" onClick={() => app.selectAll()}><a className="metismenu-link" href="#">Select All</a></li>
                    <li className="metismenu-item" onClick={this.props.openPreferencesModal}><a className="metismenu-link" href="#">Preferences</a></li>
                </ul>
            </li>
        )
    }

    desktopView() {
        return (
            <div className="Line Menu">
                <div
                    className="btn-Edit btn"
                    onClick={this.showDropdownMenu}
                >
                    Edit
                    {this.state.displayMenu ? (
                        <ul>
                            <li onClick={() => app.undo()}>
                                <a href="#">Undo</a>
                            </li>
                            <li onClick={() => app.redo()}>
                                <a href="#">Redo</a>
                            </li>
                            <li onClick={() => container.resolve('buffer').cut()}>
                                <a href="#">Cut</a>
                            </li>
                            <li onClick={() => container.resolve('buffer').copy()}>
                                <a href="#">Copy</a>
                            </li>
                            <li onClick={() => container.resolve('buffer').paste()}>
                                <a href="#">Paste</a>
                            </li>
                            <li onClick={() => app.selectAll()}>
                                <a href="#">Select All</a>
                            </li>
                            <li onClick={this.props.openPreferencesModal}>
                                <a href="#">Preferences</a>
                            </li>
                        </ul>
                    ) : null}
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        openPreferencesModal: () => {
            dispatch({type: "OPEN_PREFERENCE_POPUP"});
        }
    };
};

export default connect(null, mapDispatchToProps)(Edit);