/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import './index.scss';
import {connect} from "react-redux";
import PropertyList from '../PropertyList/PropertyList'
import MoveButtons from '../../Actions/mobile/Actions';

class PropBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            currentTab: 'props'
        }
    }

    openTab(name) {
        if (this.state.currentTab == name) {
            this.setState({open: !this.state.open});
        } else {
            this.setState({currentTab: name, open:true});
        }
    }


    canOpenTab() {
        return this.props.fields.length>0;
    }


    isOpen() {
        return this.props.fields.length > 0 && this.state.open;
    }

    isActive(name) {
        return this.state.currentTab == name;
    }

    render() {
        return (
            <div className={"mobilePropBar" + (this.isOpen() ? " openTab" : "")}>
                <div className={"tabList" + (this.canOpenTab() > 0 ? "" : " disable")}>
                    <div className={"tabButton" + (this.isActive('props') ? " active" : "")}
                         onClick={() => this.openTab("props")}>
                        Properties
                    </div>
                    <div className={"tabButton" + (this.isActive('actions') ? " active" : "")}
                         onClick={() => this.openTab("actions")}>
                        Actions
                    </div>
                </div>
                <div className="tabContent">
                    {this.state.currentTab == "props" && (<div className="propertyBar">
                            <PropertyList/>
                        </div>
                    )}
                    {this.state.currentTab == "actions" && (<div className="actionsBar">
                            <MoveButtons/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fields: state.propertyBarReducer.fields,
    }
};

const mapDispatchToProps = dispatch => {
};

export default connect(mapStateToProps, mapDispatchToProps)(PropBar);