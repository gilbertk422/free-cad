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

class CommentsToMachinist extends React.Component {
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
          If your job has a simple requirement outside the scope of the software describe it using Comments to Machinist(CTM).
          The charge depends on the extra costs involved and is determined manually by eMachineShop staff after an order is placed.
          Your approval will be requested before proceeding if the extra cost exceeds $25. Be concise. 
          Comments must be well defined and unambiguous.
        </p>
        <p className="AutoTitle" style={{ margin: "10px" }}>
          Clear examples:<br/>
         *Hole must fit a 1.000" inch shaft.<br/>
          *Don't bend 10 parts.
        </p>
        <p className="AutoTitle" style={{ margin: "10px" }}>
          Unclear example:<br/>
          *Override default tolerance to +/- .004"<br/>
          Tolerance missing:<br/>
          *Make sure part is flat.
        </p>
        <p className="AutoTitle" style={{ margin: "10px" }}>
          Use lines and arrows to clarify your text.<br/>
          Specify inch or mm.<br/>
          Use of comments may increase delivery time.<br/>
        </p>
        <div>
          <p className="AutoTitle"  style={{ margin: "10px" }}>Be concise:</p>
          <div style={{display:'flex',margin: "10px"}}>
            <p className="AutoTitle" >
              Concise:<br/>
              *0.500 +/-.002"<br/>
              *Min 3 complete threads
            </p>
            <p className="AutoTitle" style={{marginLeft:'10px'}}>
              Not concise:<br/>
              *Make sure this 0.500 square is within .002" because I will fit another part to it.<br/>
              *Per my email, please make sure there are at least 3 complete threads.

            </p>
          </div>
        </div>
        <p className="AutoTitle" style={{ margin: '10px' }}>
          Examples of uses for Comments to Machinist(CTM):
            </p>
        <p className="AutoTitle" style={{ margin: '10px' }}>
          *Holes in side views of 2D machines such as laser and punch<br/>
          *Holes at angles other than 90 deg<br/>
          *Reaming<br/>
          *Countersinking for 2D parts<br/>
          *Knurling<br/>
          *Sawing as a secondary process<br/>
          *etc<br/>
            </p>
      </div>
    );
  }
}


  export default withRouter(CommentsToMachinist);