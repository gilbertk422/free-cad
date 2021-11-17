/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./bend.scss";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Bend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angleBend: (90).toFixed(2) +' deg'
    };
  }

  handlyChangeInputAngleBend = e => {
// console.log(e.target.value,'e.target.value')
    let angleBend = e.target.value;
    let angleNumber = angleBend.replace(/[^0-9.]/g, "") ;

    this.setState({
      angleBend
    })
    if (e.charCode === 13) {
      this.setState({
        angleBend: (+angleNumber *1).toFixed(2) + " deg"
      });
      this.angleInput.blur();

    }
  }
  render() {
    return (
      <div className="Bend">
        {app.selectElements[0].typeName !== "Line" && (
          <p className="BendTitle" >Please select a straight line(s)</p>
        )}
        {app.selectElements[0].typeName === "Line" && (
          <div className="LinePart">
            <p className="BendTitle2">
              Use this selection to create bends in sheet materials.
            </p>
            <div className="BendPreview">
              <fieldset className="BendFieldSet">
                <legend>Bend</legend>
                <div className="InputAngleGroup">
                      <label>Angle:</label>
                      <input
                        type="text"
                        className="InputAngle"
                        ref={input => {
                          this.angleInput = input;
                        }}
                        value={this.state.angleBend}
                        onChange={this.handlyChangeInputAngleBend}
                        onKeyPress={this.handlyChangeInputAngleBend}
                      />
                    </div>
                <p className="BendTitle2">
              Positive values bend material located to either side of bend <br/>line towards yourself from the<br/> 2D view. 
              Negative values<br/> bend away.
                </p>
              </fieldset>
              <fieldset className="PreviewFieldSet">
                <legend>Preview</legend>
                <p className="BendTitle2">
               Preview picture
                </p>
              </fieldset>
            </div>
            <fieldset className="Notes">
              <legend>Note</legend>
              <p className="BendTitle2">
                To change bend radius choose Job | Settings |
                Specifications:Bend
              </p>
            </fieldset>
          </div>
        )}
      </div>
    );
  }
}
export default Bend;
