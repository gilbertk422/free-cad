/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./tools-panel.scss";
import ReactTooltip from "react-tooltip";
import MoveButtons from "./MoveButtons";
import {connect} from 'react-redux';
import PropertyList from '../../PropertyBar/PropertyList/PropertyList'


class ToolsPanel extends React.PureComponent {

    isShow() {
        return this.props.fields.length > 0;
    }


    render() {
        if (this.isShow()) {
            return this.getPanelHtml();
        } else {
            return (
                <div className="ToolsPanel"></div>
            );
        }
    }

    getPanelHtml() {
        return (
            <div className="ToolsPanel">
                <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme"/>
                <div className="Left-Tools">
                    <PropertyList/>
                    <div className="property">
                        <button className="btn-Question" tabIndex={-1}>
                            <a
                                href="https://www.emachineshop.com/help-2d-drawing/#numeric-values"
                                target="_blank"
                                rel="noreferrer noopener"
                                tabIndex={-1}
                                data-place="bottom"
                                data-tip="<span>Shows how to use numeric values.</span>"
                            >
                                <svg className="icon">
                                    <use xlinkHref="icons.svg#Question"></use>
                                </svg>
                            </a>
                        </button>
                    </div>

                </div>
                <div className="Right-Tools">
                    <MoveButtons/>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);