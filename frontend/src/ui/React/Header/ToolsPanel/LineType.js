/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";
import { Fragment } from "react";
import { connect } from "react-redux";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class LineType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lengthLine:'',
            angle: "",
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
                if (elements[0].typeName === "Line") {
                    let angle = app.selectElements[0].angle;
                    let lengthLine = elements[0].length();
                    this.props.updateLengthLine(lengthLine);
                    this.setState({
                        lengthLine:lengthLine,
                        angle:angle
                    });
                }
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)})
    }

    handleChangeInputLength(lengthLine){
        this.setState({ lengthLine });
        this.props.updateLengthLine(lengthLine);
        app.setLineLengthElement(lengthLine);
    }

    handleChangeLineAngle(angle){
        this.setState({angle});
        app.setLineAngleElement(angle);
    };

  render() {
    // console.log(this.props, "props-LineLength");
    return (
      <Fragment>
          {!this.state.mobile && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
        <button className="btn-Length" tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Line-length.jpg"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-line-length')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={4}
              dimension={this.state.dimension}
              value={this.state.lengthLine}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-line-length')}}
              onChange={this.handleChangeInputLength.bind(this)}
          />
        <button className="btn-LineAngle" tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Line-angle.jpg"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-line-angle')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={5}
              dimension={{name:'deg', multiplier:1}}
              value={this.state.angle}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-line-angle')}}
              onChange={this.handleChangeLineAngle.bind(this)}
          />
      </Fragment>
    );
  }

}
const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    lengthLine: state.toolsPanelReducer.lengthLine
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateLengthLine: lengthLine => {
      dispatch({ type: "UPDATE_LENGTH_LINE", payload: lengthLine });
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineType);
