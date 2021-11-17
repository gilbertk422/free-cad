/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class CircleType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // diameter: this.props.diameter
            diameter: app.config.diameter,
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
        const _elements = app.selectElements;
        let arc = _elements.every(el => el.typeName === "Arc");

        let arc_radius = true;

        let temp = _elements[0].radius;
        for(let i=1; i<_elements.length; i++){
            if(temp!=_elements[i].radius){
                arc_radius=false;
                break;
            }
        }

        if (arc === true && arc_radius === false && app.selectElements.length > 1) {
            let diameter = '';
            this.setState({diameter})
        } else{
            if (arc === true && arc_radius === true && app.selectElements.length > 1) {
                app.addHandler("selectElements", elements => {
                    this.setState({diameter:_elements[0].radius*2});
                });
            } else {
                app.addHandler("selectElements", elements => {
                    if (app.selectElements.length === 1) {
                        if (elements[0].typeName === "Arc") {
                            this.setState({diameter:elements[0].radius*2});
                        }
                    }
                });

            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)});
    }

    handleChangeInputDiameter(diameter){
        this.setState({diameter});
        app.setRadiusForSelectedElements(diameter/2);
    }


  render() {
    // console.log(this.props.diameter,'circle-props')
    return (
      <>
          {!this.state.mobile && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
        <button className="btn-Diameter" tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Diameter18.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-diameter')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={4}
              dimension={this.state.dimension}
              value={this.state.diameter}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-diameter')}}
              onChange={this.handleChangeInputDiameter.bind(this)}
          />
      </>
    );
  }


}
const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    diameter: state.diameterToolsReducer.diameter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDiameter: diameter => {
      dispatch({ type: "UPDATE_DIAMETER", payload_D: diameter });
    }
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(CircleType);
