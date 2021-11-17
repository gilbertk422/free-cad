/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./front-panel.scss";
import Button from "@material-ui/core/Button";

export default class FrontPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lengthValue: `6,000${String.fromCharCode(34)}`,
      width: `2,000${String.fromCharCode(34)}`,
      diameter: `0,150${String.fromCharCode(34)}`
    };
  }
  handleInputLenght = event => {
    // event.preventDefault();

    this.setState({ lengthValue: event.target.value  });
    if(event.charCode === 13){

        this.setState({
          lengthValue: event.target.value + `${String.fromCharCode(34)}`
        });
    }
    console.log(
    //   this.state.lengthValue,
      event.target,
      "event.target.lengthValue"
    );
  };


  handleInputWidth = event => {
    // event.preventDefault();

    this.setState({ width: event.target.value });
    if(event.charCode === 13){

      this.setState({
        width: event.target.value + `${String.fromCharCode(34)}`
      });
  }
    console.log(this.state.width, "this.state.width");
  };

  handleInputDiameter = event => {
    
    // event.preventDefault();

    this.setState({ diameter: event.target.value });
    if(event.charCode === 13){

      this.setState({
        diameter: event.target.value + `${String.fromCharCode(34)}`
      });
    console.log(this.state.diameter, "this.state.diameter");
  };
}
  // ------------------Rest Button------------
  resetButton = () => {
    this.setState({
      lengthValue: `6,000${String.fromCharCode(34)}`,
      width: `2,000${String.fromCharCode(34)}`,
      diameter: `0,150${String.fromCharCode(34)}`
    });
  };
  render() {
    return (
      <div className="FrontPanel">
        {/* <p className="Title">
          A polygon where each side has the same lenght, and all interior angles
          are equal and less then 180 degrees.
        </p> */}
        <div className="Parameters">
          <p className="ParamTitle">Parameters:</p>{" "}
          <Button
          onClick={this.resetButton}
            style={{
              marginTop:'10px',
              backgroundColor: "#dddada",
              boxShadow: "2px 2px 1px #000",
              height:'30px'
            }}
            color="primary"
            size="small"
          >
            Reset
          </Button>
        </div>
     

        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Length</td>
              <td className="Value">
                <input
                  type="text"
                  className="Input"
                  value={
                    this.state.lengthValue
                  }

                  onChange={this.handleInputLenght}
                  onKeyPress={this.handleInputLenght}

                />
              </td>
            </tr>
            <tr>
              <td>Width</td>
              <td>
                <input
                  type="text"
                  className="Input"
                  value={this.state.width}
                  onChange={this.handleInputWidth}
                  onKeyPress={this.handleInputWidth}

                />
              </td>
            </tr>
            <tr>
              <td>Mounting Hole Diameter</td>
              <td>
                <input
                  type="text"
                  className="Input"
                  value={this.state.diameter}
                  onChange={this.handleInputDiameter}
                  onKeyPress={this.handleInputDiameter}


                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* <p className="Parameters">Preview:</p> */}
      </div>
    );
  }
  }

