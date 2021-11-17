/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";

import { connect } from "react-redux";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class ArcType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radius: '',
            startAngle: "",
            insideAngle: "",
            dimension:this.getDimension(this.props.dimension),
            mobile:container.resolve('mobileDetector').mobile()!=null
        };
    }

    getDimension(name){
        if (name === "Millimeters") {
            return {name:'mm', multiplier:1};
        } else {
            return {name:"''", multiplier:25.4};
        }
    }

    componentWillMount() {
        app.addHandler("selectElements", elements => {
            if (app.selectElements.length == 1) {
                if (elements[0].typeName === "Arc") {
                    let startAngle = app.selectElements[0].startAngle.toFixed(2);
                    let incrementAngle = app.selectElements[0].incrementAngle.toFixed(2);
                    let radius = (app.selectElements[0].radius).toFixed(3);
                    this.props.updateRadius(radius); //todo: ????
                    this.setState({
                        startAngle: startAngle,
                        insideAngle: incrementAngle,
                        radius: radius
                    });
                }
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)})
    }

    handleChangeInputRadius(radius){
        this.setState({radius});
        app.setRadiusForSelectedElements(radius);
        this.props.updateRadius(radius);
    }

    handleChangeInputStartAngle(startAngle){
        this.setState({startAngle: +startAngle});
        app.setArcAngles(+startAngle, null);
    }

    handleChangeInsideAngle(insideAngle){
        this.setState({ insideAngle });
        app.setArcAngles(null, insideAngle);
    }

    render() {
        return (
            <>
                {!this.state.mobile && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
                <button className="btn-Radius" tabIndex={-1}>
                    <img
                        width="18px"
                        src="resources/images/radius.jpg"
                        data-place="bottom"
                        data-tip={container.resolve("tips").getTip('numeric-radius')} data-html={true}
                    />
                </button>
                <DimensionField
                    tabIndex={4}
                    dimension={this.state.dimension}
                    value={this.state.radius}
                    tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-radius')}}
                    onChange={this.handleChangeInputRadius.bind(this)}
                />
                <button className="btn-StartAngle" tabIndex={-1}>
                    <img
                      width="18px"
                      src="resources/images/start_angle.jpg"
                      data-place="bottom"
                      data-tip={container.resolve("tips").getTip('numeric-start-angle')} data-html={true}
                    />
                </button>
                <DimensionField
                    tabIndex={5}
                    dimension={{name:'deg', multiplier:1}}
                    value={this.state.startAngle}
                    tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-start-angle')}}
                    onChange={this.handleChangeInputStartAngle.bind(this)}
                />

                <button className="btn-LineAngle" tabIndex={-1}>
                    <img
                        width="18px"
                        src="resources/images/increment_angle.jpg"
                        data-place="bottom"
                        data-tip={container.resolve("tips").getTip('numeric-inside-angle')} data-html={true}
                    />
                </button>
                <DimensionField
                    tabIndex={6}
                    dimension={{name:'deg', multiplier:1}}
                    value={this.state.insideAngle}
                    tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-inside-angle')}}
                    onChange={this.handleChangeInsideAngle.bind(this)}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    radius: state.toolsPanelReducer.radius
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateRadius: radius => {
      dispatch({ type: "UPDATE_RADIUS", payload: radius });
    }
  };
};
 export default connect(mapStateToProps,mapDispatchToProps)(ArcType);
