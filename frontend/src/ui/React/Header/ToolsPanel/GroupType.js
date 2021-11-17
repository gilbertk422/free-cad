/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class GroupType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '',
            height:'',
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
            if (app.selectElements.length == 1||app.selectElements.length > 1) {
                let ext = app.currentDocument.getExtrenum(app.selectElements);
                let width = (ext.max.x- ext.min.x).toFixed(3);
                let height = (ext.max.y- ext.min.y).toFixed(3);
                this.props.updateWidthAndHeight(+width,+height);
                this.setState({
                    width: width,
                    height: height
                });
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)});
    }

    handleChangeInputWidth(width){
        let height = this.props.height;
        this.setState({ width });
        this.props.updateWidthAndHeight(+width,+height);
        app.setSelectedElementsSize(+width, +height);
    }

    handleChangeInputHeight(height){
        let width = this.props.width;
        this.setState({ height });
        this.props.updateWidthAndHeight(+width,+height);
        app.setSelectedElementsSize(+width, +height);
    }

    render(){
        return (
          <>
              {!this.state.mobile && <ReactTooltip delayShow={1000}
                html={true}
                className="tooltipBackgroundTheme"
              />}
              <button className="btn-Horizontal" tabIndex={-1}>
                  <img
                      width="18px"
                      src="resources/images/Width.png"
                      data-place="bottom"
                      data-tip="<span>Horizontal size</span>"
                  />
              </button>
              <DimensionField
                  tabIndex={4}
                  dimension={this.state.dimension}
                  value={this.state.width}
                  tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-horizontal-size')}}
                  onChange={this.handleChangeInputWidth.bind(this)}
              />
              <button className="btn-Vertical" tabIndex={-1}>
                  <img
                      width="18px"
                      src="resources/images/Height.png"
                      data-place="bottom"
                      data-tip="<span>Vertical size</span>"
                  />
              </button>
              <DimensionField
                  tabIndex={5}
                  dimension={this.state.dimension}
                  value={this.state.height}
                  tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-vertical-size')}}
                  onChange={this.handleChangeInputHeight.bind(this)}
              />
        </>)
    }

}

const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    width: state.toolsPanelReducer.width,
    height: state.toolsPanelReducer.height,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateWidthAndHeight: (width,height) => {
      dispatch({ type: "UPDATE_WIDTH_HEIGHT", payload_W:width, payload_H:height });
    }
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(GroupType);
