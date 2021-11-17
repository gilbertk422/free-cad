/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./auto.scss";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";

import InputSelectAuto from "./InputSelectAuto";
import InputSelectRadius from "./InputSelectRadius";
import InputSelectAngle from "./InputSelectAngle";

import ParametersWindow from "./ParametersWindows/ParametersWindow";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Auto extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value:this.props.value,
        isCheckedStockMaterial:this.props.isCheckedStockMaterial,
        angle45: false,
        angle90: true,
        angle135: false,
        isCheckedGrooves: false,
        valueFarEdge:'Drilled',
        groovesDisabled:false
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.isCheckedStockMaterial === false) {
        this.setState({
          groovesDisabled:false
        })
      }
  
    }

    handleRadioChange = event => {
      event.preventDefault();
      this.props.updateCloseMachineModal(this.props.openMachineModal,event.target.value,this.props.isCheckedStockMaterial)
    };

    handleCheckedStockMaterial = event => {
      window.setTimeout(() => {
          this.props.updateCloseMachineModal(this.props.openMachineModal,this.props.value,!this.props.isCheckedStockMaterial)
          if(this.props.isCheckedStockMaterial===true){
          this.setState({
            groovesDisabled:!this.state.groovesDisabled
          });
        } 
      }, 0);
    };

    handleCheckedGrooves = event => {
      window.setTimeout(() => {
        this.setState({
          isCheckedGrooves: !this.state.isCheckedGrooves
        });
      }, 0);
    };

  // ---------------------functions for state angle---------------------------------
    updateState45 = (value45) => {
      this.setState({ angle45: value45 ,angle90:false,angle135:false})
    }
    updateState90 = (value90) => {
      this.setState({ angle45:false,angle90: value90, angle135:false })
    }
    updateState135 = (value135) => {
      this.setState({angle45:false,angle90:false, angle135: value135 })
    }
// -----------------------------------------------------------------------------------

    handleRadioChangeFerEdge = event => {
      event.preventDefault();
      this.setState({ valueFarEdge: event.target.value });
    }

    render() {
      // console.log(this.props,'props-Auto')
      return (
        <div className="Auto">
          <p className="AutoTitle">
            Use this selection to design the shape of your part.
          </p>
          <fieldset className="RadiButtonsFieldset">
            <legend>Near edge</legend>
            <div className="RadioButtons">
              <div className="RadioButtonsElelemt">
                <FormControl>
                  <RadioGroup
                    value={this.props.value}
                    onChange={this.handleRadioChange}
                  >
                    <FormControlLabel
                      classes={{ root: "root" }}
                      onClick={
                     ()=>
                      this.props.updateCloseMachineModal(this.props.openMachineModal,'straight',this.props.isCheckedStockMaterial)
                      }
                      value="straight"
                      control={
                        <Radio
                          classes={{ root: "root" }}
                          color="primary"
                        />
                      }
                      label="Straight"
                    />
                    <FormControlLabel
                        onClick={
                      ()=> 
                      this.props.updateCloseMachineModal(this.props.openMachineModal,'chamfer',this.props.isCheckedStockMaterial)
                        }
                      classes={{ root: "root" }}
                      value="chamfer"
                      control={
                        <Radio
                          style={{ margin: "0px" }}
                          color="primary"
                        />
                      }
                      label="Chamfer"
                    />
                    <FormControlLabel
                       onClick={
                      ()=> 
                      this.props.updateCloseMachineModal(this.props.openMachineModal,'round',this.props.isCheckedStockMaterial)
                      }
                      classes={{ root: "root" }}
                      value="round"
                      control={
                        <Radio
                          color="primary"
                        />
                      }
                      label="Round"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="RadioButtonsContent">
                {this.props.value === "straight" && (
                  <div className="Chamfer">
                    <div>
                      <img src="resources/images/straight.png" />
                    </div>
                  </div>
                )}
                {this.props.value === "chamfer" && (
                  <div className="Chamfer">
                    <div>
                      <img src="resources/images/Chamfer.png" />
                    </div>
                    <div className="Inputs">
                      <div className="InputSizeGroup">
                        <label>Size:</label>
                        <input
                          type="text"
                          className="InputSize"
                      
                        />
                      </div>
                      <div className="InputSelectAngleGroup">
                        <span>Angle:</span>

                        <span className="InputSelectAngle">
                          <InputSelectAuto />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {this.props.value === "round" && (
                  <div className="Chamfer">
                    <div>
                      <img src="resources/images/radius.png" />
                    </div>
                    <div className="Inputs">
                      <div className="InputSelectRadiusGroup">
                        <span>Radius:</span>
                        <span className="InputSelectRadius">
                          <InputSelectRadius />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
          <fieldset className="Checkbox">
            <legend>Stock material wall</legend>
            <div className="RadioButtons">
              <div className="RadioButtonsElelemt">
                <Checkbox
                  checked={this.props.isCheckedStockMaterial}
                  onChange={this.handleCheckedStockMaterial}
                  color="primary"
                />
              </div>
              <div className="RadioButtonsContent">
                <div className="Chamfer">
                  <p className="AutoTitle">
                    Use to specify raw material shape of tube, beam, etc. -
                    specify vendor and part number in comments.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="AngleInputFieldset">
            <legend>Side wall</legend>
            <div className="RadioButtons">
              <div className="RadioButtonsElelemt" />
              <div className="RadioButtonsContent">
                <div className="Chamfer">
                  <div>
                    {this.state.angle90 === true && (
                      <img src="resources/images/angle90.png" />
                    )}
                    {this.state.angle45 === true && (
                      <img src="resources/images/angle45.png" />
                    )}
                    {this.state.angle135 === true && (
                      <img src="resources/images/angle135.png" />
                    )}
                  </div>
                  <div className="InputAngle">
                    <div className="InputSelectAngleGroup2">
                      <span style={{color:this.state.groovesDisabled===true?'grey':'black'}}>Angle:</span> 

                      <span className="InputSelectAngle2">
                        <InputSelectAngle 
                        disabled={this.state.groovesDisabled}                        
                        updateState45={this.updateState45} 
                        updateState90={this.updateState90} updateState135 = {this.updateState135}/>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div>
  <hr />
  </div> 

              <div className="RadioButtons">
                <div className="RadioButtonsElelemt">
                  <Checkbox
                    checked={this.state.isCheckedGrooves}
                    onChange={this.handleCheckedGrooves}
                    disabled={this.state.groovesDisabled}
                    color="primary"
                  />
                <span style={{color:this.state.groovesDisabled===true?'grey':'black'}}>Grooves</span> 
                </div>
                <div className="RadioButtonsContent">
                  <div className="Chamfer">
                    <div>
                      <img src="resources/images/Grooves1.png" />
                    </div>
                  <div className="InputAngle">
                    <div className="InputSelectAngleGroup2">
                      <Button
                        className="Parameters"
                        disabled={this.state.groovesDisabled}
                        onClick={
                      ()=> this.props.updateSetGrooves(!this.props.openSetGrooves)
                        }
                        style={{ backgroundColor: "#dddada" }}
                        color="primary"
                      >
                        Parameters...
                      </Button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
        
          </fieldset>
          <fieldset className="RadioFarEdge">
            <legend>Far edge</legend>
            <div className="RadioButtons">
              <div className="RadioButtonsElelemt">
                <FormControl>
                  <RadioGroup
                    value={this.state.valueFarEdge}
                    onChange={this.handleRadioChangeFerEdge}
                  >
                    <FormControlLabel
                      disabled
                      classes={{ root: "root" }}
                      value="Drilled"
                      control={
                        <Radio
                          classes={{ root: "root" }}
                          color="primary"
                        />
                      }
                      label="Drilled*"
                    />
                    <FormControlLabel
                    disabled
                      classes={{ root: "root" }}
                      value="Round"
                      control={
                        <Radio
                          style={{ margin: "0px" }}
                          color="primary"
                        />
                      }
                      label="Round"
                    />
                    <FormControlLabel
                      disabled
                      classes={{ root: "root" }}
                      value="Straight"
                      control={
                        <Radio
                          color="primary"
                        />
                      }
                      label="Straight"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="RadioButtonsContent">
              <div className="Chamfer">
                    <div>
                      <img src="resources/images/Grooves1.png" />
                    </div>
                    <div className="InputAngle">
                      <div className="InputFarEdge">
                      <span className="AutoTitle" style={{color:'grey'}}>A small fillet will be applied<br/> to prevent stress cracks.<br/> Drill bottom holes are usually<br/>
                      less expensive.</span>       
                      </div>
                    </div>
                  </div>
            </div>
            </div>
          </fieldset>
          <fieldset className="Notes">
            <legend>Notes</legend>
            <p className="AutoTitle">
              To set edge settings for the Bottom view first select View | Bottom.
            </p>
            <p className="AutoTitle">
              *Drilled holes may be machined with flat bottoms.
            </p>
          </fieldset>
          <ParametersWindow/>
        </div>
      );
    }
}

    const mapStateToProps = state => {
      return {
        openSetGrooves: state.setGroovesReducer.openSetGrooves,
        openMachineModal: state.machineWindowReducer.openMachineModal,
        value: state.machineWindowReducer.value,
        isCheckedStockMaterial:state.machineWindowReducer.isCheckedStockMaterial
      };
    };

    const mapDispatchToProps = dispatch => {
      return {
        updateSetGrooves: openSetGrooves => {
          dispatch({
            type: "OPEN_SET_GROOVES",
            payload: openSetGrooves,
          });
        },
        updateCloseMachineModal: (openMachineModal,value,isCheckedStockMaterial) => {
          dispatch({ type: "CLOSE_MACHINE_MODAL", payload: openMachineModal,payloadValue:value,payloadIsChecked:isCheckedStockMaterial});
        }
    
      };
    };

export default connect(mapStateToProps,mapDispatchToProps)(Auto);