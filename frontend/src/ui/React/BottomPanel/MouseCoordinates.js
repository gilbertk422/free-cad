/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./bottom-panel.scss";
import { connect } from "react-redux";

class MouseCoordinates extends React.Component {

  /**
   * @param {number} value
   */
  formatPosition(value) {
    let dimensionPostfix = " mm";

    if (this.props.dimension != "Millimeters") {
      value /= 25.4;
      dimensionPostfix = " ''";
    }
    let format = value.toFixed(2);
    return format + dimensionPostfix;
  }

  render() {
    // console.log(this.props, 'mouse-Coordinate');

    return (
      <div className="MouseCoordinates">
        <span className="MouseX">{this.formatPosition(this.props.mouseX)}</span>
        <span className="MouseY">{this.formatPosition(this.props.mouseY)}</span>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    mouseX: state.mouseCoordinatesReducer.mouseX,
    mouseY: state.mouseCoordinatesReducer.mouseY
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MouseCoordinates);
