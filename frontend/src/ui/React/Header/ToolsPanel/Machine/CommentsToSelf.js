/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./auto.scss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { withRouter } from "react-router-dom";

class CommentsToSelf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.lineType ? props.lineType.type : 'Solid'
    };
  }

  handleRadioChange = event => {
    event.preventDefault();

    this.setState({ value: event.target.value });
    this.props.changeLineType(event.target.value);
  };

  render() {
    return (
      <div className="CommentsToSelf">
        <p className="AutoTitle" style={{ margin: "10px" }}>
          Use this selection to add comments to your design. To add comments
          draw lines, circles, text, etc and then select this line type.
        </p>
        <fieldset className="LineType" style={{ margin: "10px" }}>
          <legend>Line Type</legend>
          {/* <FormControl 
                  style={{display:'flex'}}
                  >

                <RadioGroup
                  value={this.state.value}
                  onChange={this.handleRadioChange}
                  style={{display:'flex'}}
                  // classes={{ root: "root" }}

                > */}
                {/* <span  style={{display:'flex'}}> */}
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <FormControlLabel
                    classes={{ root: "root" }}
                    // style={{border:'1px solid red',paddinTop:'0px!important'}}
                    value="Solid"
                    control={
                      <Radio
                      checked={this.state.value === 'Solid'}
                      onChange={this.handleRadioChange}
                        classes={{ root: "root" }}
                        color="primary"
                      />
                    }
                    label="Solid"
                  />
                  <FormControlLabel
                    classes={{ root: "root" }}
                    value="Striple"
                    control={
                      <Radio
                      checked={this.state.value === 'Striple'}
                      onChange={this.handleRadioChange}
                        style={{ margin: "0px" }}
                        color="primary"
                      />
                    }
                    label="Dashed"
                  />
                  <FormControlLabel
                    classes={{ root: "root" }}
                    value="Font"
                    control={
                      <Radio
                        checked={this.state.value === 'Font'}
                        onChange={this.handleRadioChange}
                        color="primary"
                      />
                    }
                    label="Font"
                  />
                        <FormControlLabel
                    classes={{ root: "root" }}
                    value="Arrow"
                    control={
                      <Radio
                        checked={this.state.value === 'Arrow'}
                        onChange={this.handleRadioChange}
                        color="primary"
                      />
                    }
                    label="Arrow"
                  />
                        <FormControlLabel
                    classes={{ root: "root" }}
                    value="Dimension"
                    control={
                      <Radio
                        checked={this.state.value === 'Dimension'}
                        onChange={this.handleRadioChange}
                        color="primary"
                        fontSize='small'
                      />
                    }
                    label="Dimension"
                  />
                  </div>
                  {/* </span> */}
                {/* </RadioGroup> */}
              {/* </FormControl> */}
        </fieldset>
        <p className="AutoTitle" style={{ margin: "10px" }}>
          I his type comment is NOT SEEN by the machinist and will have no
          effect on your parts or cost. I his type of line is for your own use
          only to create comment lines and text to label sections of your
          design, create alignment guides, show inactive portions of a design,
          etc.
        </p>
      </div>
    );
  }
}
export default withRouter(CommentsToSelf);
