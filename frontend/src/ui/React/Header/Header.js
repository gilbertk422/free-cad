/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

import Menu from './DropDownMenu/DropDownMenu'
import ToolPanel from './UpMenu/UpMenu';
import PropertyBar from './ToolsPanel/ToolsPanel';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import CheeseburgerMenu from "cheeseburger-menu";
import HamburgerMenu from "react-hamburger-menu";
import OptionMenu from './OptionMenu/OptionMenu';
import "./header.scss"

class Header extends React.Component {

    constructor(params) {
        super(params);
        this.state = {
            desktop: container.resolve('mobileDetector').mobile() == null,
            optionMenuOpen: false
        }
    }

    openOptionMenu() {
        this.setState({optionMenuOpen: true});
    }

    closeOptionMenu() {
        this.setState({optionMenuOpen: false});
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
            <React.Fragment>
                <div className="MobileHeader" style={{display: "flex", paddingBottom: "50000px", marginBottom: "-50000px", overflowX: "scroll"}}>
                    <CheeseburgerMenu
                        isOpen={this.state.optionMenuOpen}
                        closeCallback={this.closeOptionMenu.bind(this)}>
                        <OptionMenu closeCallback={this.closeOptionMenu.bind(this)} />
                    </CheeseburgerMenu>
                    <HamburgerMenu
                        isOpen={this.state.optionMenuOpen}
                        menuClicked={this.openOptionMenu.bind(this)}
                        width={34}
                        height={34}
                        strokeWidth={2}
                        rotate={0}
                        color='black'
                        borderRadius={0}
                        animationDuration={0.5}
                    />
                    <ToolPanel style={{backgroundColor: "#e0e0e0", width: "calc(100% - 40px)", paddingLeft: "10px"}}/>
                </div>
            </React.Fragment>
        );
    }

    desktopView() {
        return (
            <React.Fragment>
                <Menu />
                <ToolPanel />
                <PropertyBar />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        showProperties: state.propertyBarReducer.fields.length > 0,
    }
};

const mapDispatchToProps = dispatch => {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));