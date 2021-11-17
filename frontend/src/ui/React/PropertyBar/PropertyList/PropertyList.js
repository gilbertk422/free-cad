/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React, {Fragment} from "react";
import "./propertyList.scss";

import InputSelect from "../ZDropDownInput/InputSelect";
import {connect} from 'react-redux';

import Comment from '../../../../model/line_types/Comment';
import DimensionField from "../../independentComponents/DimensionField/DemensionField";
import Thread from "../../../../model/line_types/processings/Thread";
import ThreadLineType from "../../../../model/line_types/Thread";

class ToolsPanel extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValues.text == "" && this.show('text')) {
            this.textInput.focus();
        }
    }

    get dimension() {
        if (this.props.dimension == "Millimeters") {
            return {name: 'mm', multiplier: 1};
        } else {
            return {name: "''", multiplier: 25.4};
        }
    }

    /**
     * @param {string} fieldName
     * @return {boolean}
     */
    show(fieldName) {
        for (let el of this.props.fields) {
            if (el == fieldName) {
                return true;
            }
        }
        return false;
    }

    isShow() {
        return this.props.fields.length > 0;
    }

    render() {       return (
            <Fragment>
                {this.show('type') && (<div className="property">
                        <select
                            tabIndex={1}
                            className="SelectMode"
                            value={this.props.fieldValues.lineType}
                            onChange={e => this.props.changeLineType(e.target.value)}
                        >
                            {this.props.fieldValues.lineType == "" && (<option value="" key={-1}></option>)}
                            {app.config.defaultLineTypes.map((typLine, i) => (
                                <option value={typLine.name} key={i}>
                                    {typLine.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {this.show('metric') && (<div className="property">
                        <select
                            tabIndex={2}
                            className="SelectMode"
                            value={this.props.fieldValues.metric}
                            onChange={e => this.props.changeMetric(e.target.value)}
                            // tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-thread-select')}}
                        >
                            {this.props.fieldValues.metric == "" && (<option value="" key={-1}></option>)}
                            <option value={Thread.TYPE_UN} key={1}>Imperial</option>
                            <option value={Thread.TYPE_M} key={2}>Metric</option>
                        </select>
                    </div>
                )}
                {this.show('threadRadius') && (<div className="property">
                        <select
                            tabIndex={3}
                            className="SelectMode"
                            value={this.props.fieldValues.threadRadius}
                            onChange={e => this.props.changeThreadRadius(e.target.value, this.props.fieldValues.metric)}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-thread-select')}}
                        >
                            {this.props.fieldValues.threadRadius == "" && (<option value="" key={-1}></option>)}
                            {Thread.getListTrheadsByType(this.props.fieldValues.metric).map((thread, i) => (
                                <option value={thread.id} key={i}>
                                    {thread.size}
                                </option>
                            ))}

                        </select>

                    </div>
                )}
                {this.show('typeOfComment') && (<div className="property">
                        <select className="SelectMode"
                                tabIndex={4}
                                value={this.props.fieldValues.typeOfComment}
                                onChange={e => this.props.changeTypeOfComment(e.target.value)}
                                tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-comment-type')}}
                        >
                            {this.props.fieldValues.typeOfComment == "" && (<option value="" key={-1}></option>)}
                            <option value={Comment.TYPE_SOLID} key={1}>Solid</option>
                            <option value={Comment.TYPE_DASHES} key={2}>Dashes</option>
                            <option value={Comment.TYPE_DIMENSION} key={3}>Dimension</option>
                            <option value={Comment.TYPE_ARROW} key={4}>Arrow</option>
                        </select>

                    </div>
                )}
                {this.show('bendAngle') && (<div className="property">
                        <DimensionField
                            tabIndex={5}
                            className={"bendInput"}
                            dimension={{name: 'deg', multiplier: 1}}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-bend-angle')}}
                            value={this.props.fieldValues.bendAngle}
                            onChange={this.props.changeBendAngle}
                        />
                    </div>
                )}
                {this.show('lineLength') && (<div className="property">
                        <button className="btn-Length" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/Line-length.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-line-length')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={6}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-line-length')}}
                            value={this.props.fieldValues.lineLength}
                            onChange={this.props.changeLineLength}
                        />
                    </div>
                )}
                {this.show('lineAngle') && (<div className="property">
                        <button className="btn-LineAngle" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/Line-angle.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-line-angle')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={7}
                            dimension={{name: 'deg', multiplier: 1}}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-line-angle')}}
                            value={this.props.fieldValues.lineAngle}
                            onChange={this.props.changeLineAngle}
                        />
                    </div>
                )}
                {this.show('radius') && (<div className="property">
                        <button className="btn-Radius" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/radius.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-radius')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={8}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-radius')}}
                            value={this.props.fieldValues.radius}
                            onChange={this.props.changeRadius}
                        />
                    </div>
                )}
                {this.show('startAngle') && (<div className="property">
                        <button className="btn-StartAngle" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/start_angle.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-start-angle')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={9}
                            dimension={{name: 'deg', multiplier: 1}}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-start-angle')}}
                            value={this.props.fieldValues.startAngle}
                            onChange={this.props.changeStartAngle}
                        />
                    </div>
                )}
                {this.show('insideAngle') && (<div className="property">
                        <button className="btn-LineAngle" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/increment_angle.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-inside-angle')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={10}
                            dimension={{name: 'deg', multiplier: 1}}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-inside-angle')}}
                            value={this.props.fieldValues.insideAngle}
                            onChange={this.props.changeInsideAngle}
                        />
                    </div>
                )}
                {this.show('textSize') && (<div className="property">
                        <button className="btn-FontSize" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/text-size.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-text-size')} data-html={true}
                            />
                        </button>
                        <DimensionField
                            tabIndex={11}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-text-size')}}
                            value={this.props.fieldValues.textSize}
                            onChange={this.props.changeTextSize}
                        />
                    </div>
                )}
                {this.show('width') && (<div className="property">
                        <button className="btn-Horizontal" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/Width.png"
                                data-place="bottom"
                                data-tip="<span>Horizontal size</span>"
                            />
                        </button>
                        <DimensionField
                            tabIndex={12}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-horizontal-size')}}
                            value={this.props.fieldValues.width}
                            onChange={w => this.props.changeSize(w, this.props.fieldValues.height)}
                        />
                    </div>
                )}
                {this.show('height') && (<div className="property">
                        <button className="btn-Vertical" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/Height.png"
                                data-place="bottom"
                                data-tip="<span>Vertical size</span>"
                            />
                        </button>
                        <DimensionField
                            tabIndex={13}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-vertical-size')}}
                            value={this.props.fieldValues.height}
                            onChange={h => this.props.changeSize(this.props.fieldValues.width, h)}
                        />
                    </div>
                )}
                {this.show('text') && (<div className="property">
                        <button className="btn-Text" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/TEXT2.jpg"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-text')} data-html={true}
                            />
                        </button>
                        <input
                            id="text"
                            style={{maxWidth: "200px"}}
                            type="text"
                            data-place="bottom"
                            tabIndex={14}
                            data-tip={container.resolve("tips").getTip('numeric-text')} data-html={true}
                            value={this.props.fieldValues.text}
                            onChange={e => this.props.changeText(e.target.value)}
                            ref={input => {
                                this.textInput = input;
                            }}
                        />
                    </div>
                )}
                {this.show('font') && (<div className="property">
                        <select
                            tabIndex={15}
                            className="SelectMode"
                            value={this.props.fieldValues.fontName}
                            onChange={e => this.props.changeFont(e.target.value)}
                            // tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-thread-select')}}
                        >
                            {container.resolve('fontManager').fonts.map((font, i) => (
                                <option value={font.name} key={i}>
                                    {font.name}
                                </option>
                            ))}

                        </select>
                    </div>
                )}
                {this.show('Z') && (<div className="property">
                        <button className="btn-Z tooltip-Z" tabIndex={-1}>
                            <img
                                width="18px"
                                src="resources/images/Z.png"
                                data-place="bottom"
                                data-tip={container.resolve("tips").getTip('numeric-Z')} data-html={true}
                            />
                        </button>
                        <InputSelect
                            tabIndex={16}
                            dimension={this.dimension}
                            tip={{place: 'bottom', value: container.resolve("tips").getTip('numeric-Z')}}
                            value={this.props.fieldValues.Z}
                            onChange={this.props.changeZ}
                        />
                    </div>
                )}

            </Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        dimension: state.preferencesReducer.dimension,
        fields: state.propertyBarReducer.fields,
        fieldValues: state.propertyBarReducer.fieldValues,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeLineType: lineTypeName => {
            const item = app.config.defaultLineTypes.find(l => l.label === lineTypeName);
            app.setElementsLineType(item);
        },
        changeMetric: value => {
            let processing = Thread.getListTrheadsByType(value).find(p => p.size == "1/4-20" || p.size == "M6x1");
            if (!processing) {
                return;
            }
            let nlt = new ThreadLineType();
            nlt.processing = [processing];
            app.setElementsLineType(nlt);
        },
        changeThreadRadius: (id, metric) => {
            let processing = Thread.getListTrheadsByType(metric).find(p => p.id == id);
            if (!processing) {
                return;
            }
            let nlt = new ThreadLineType();
            nlt.processing = [processing];
            app.setElementsLineType(nlt);
        },
        changeBendAngle: angle => {
            const item = app.config.defaultLineTypes.find(l => l.name == "Bend");
            if (!item)
                return;
            angle = angle % 360;
            if (Math.abs(angle) > 180) {
                let resAngle = Math.abs(angle + 180) % 180;
                if (angle > 0) {
                    resAngle -= 180;
                }
                angle = resAngle;
                this.setState({bendAngle: angle});
            }

            item.processing[0].angle = angle;
            app.setElementsLineType(item);
        },
        changeTypeOfComment: value => {
            let lineType = app.selectElements[0].lineType.copy();
            lineType.type = value;
            app.setElementsLineType(lineType);
        },
        changeLineLength: value => {
            app.setLineLengthElement(value);
        },
        changeLineAngle: value => {
            app.setLineAngleElement(value);
        },
        changeRadius: value => {
            app.setRadiusForSelectedElements(value);
        },
        changeInsideAngle: value => {
            app.setArcAngles(null, value);
        },
        changeStartAngle: value => {
            app.setArcAngles(+value, null);
        },
        changeTextSize: value => {
            app.setFontSizeForSelectedElement(value);
        },
        changeSize: (width, height) => {
            app.setSelectedElementsSize(+width, +height);
        },
        changeText: value => {
            let text = "";
            for(let i=0; i<value.length; i++){
                if(value.charCodeAt(i)<=127){
                    text+=value.charAt(i);
                }
            }
            app.setTextForSelectedElement(text);
        },
        changeZ: value => {
            app.setElementsHeight(value);
        },
        changeFont: name=>{
            app.changeFont(name);
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);