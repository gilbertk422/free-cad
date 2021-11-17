/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./corner.scss";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
// import Checkbox from "@material-ui/core/Checkbox";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";
import {connect} from "react-redux";
import CornerCommand from './../../../../command/Corner';

class Corner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.type==CornerCommand.TYPE_ROUND?"Round":"Chamfer",
            radius: this.props.radius,
            distance: this.props.distance,
            dimension:this.getDimension(this.props.dimension)
        };
    }

    getDimension(name){
        if (name === "Millimeters") {
            return {name:'mm', multiplier:1};
        } else {
            return {name:"''", multiplier:25.4};
        }
    }

    handleRadioChange(event){
        this.setState({ value: event.target.value });
        this.props.updateType(event.target.value=="Round"?CornerCommand.TYPE_ROUND:CornerCommand.TYPE_CHAMFER);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            dimension:this.getDimension(nextProps.dimension),
            radius:nextProps.radius,
            distance:nextProps.distance,
        });
    }

    handleChangeInputRadius(value){
        this.props.updateRadius(value);
    }

    handleChangeInputDistance(value){
        this.props.updateDistance(value);
    }


  render() {
    return (
      <div className="Corner">
        <form onSubmit={((e)=>e.preventDefault())}>
          <fieldset>
              <legend>Corner</legend>

              <FormControl>
                  <RadioGroup
                    value={this.state.value}
                    onChange={this.handleRadioChange.bind(this)}
                  >
                        <FormControlLabel
                          value="Round"
                          onClick={() => {this.state.value === "Round" ? "Chamfer" : "Round";}}
                          control={<Radio color="primary" classes={{ root: "root" }} />}
                          label="Round"
                        />
                        <FormControlLabel
                          value="Chamfer"
                          onClick={() => {this.state.value === "Chamfer" ? "Round" : "Chamfer";}}
                          control={<Radio classes={{ root: "root" }} color="primary"/>}
                          label="Chamfer"
                        />
                  </RadioGroup>
              </FormControl>
          </fieldset>
          {this.state.value === "Round" && (
            <>
              <p>Sharp corners will be rounded to the specified radius.</p>
              <div className="Block">
                <div className="LeftBlock">

                  <div className="Input">
                    <label>Radius</label>
                    <br />
                      <DimensionField
                          dimension={this.state.dimension}
                          value={this.state.radius}
                          tip={{place:'bottom', value:container.resolve("tips").getTip('corner-radius')}}
                          onChange={this.handleChangeInputRadius.bind(this)}
                      />
                  </div>
                  {/*<label className="Label">*/}
                    {/*<Checkbox*/}
                      {/*disabled*/}
                      {/*value="checkedD"*/}
                      {/*style={{ margin: 0, padding: 0, paddingLeft: "10px" }}*/}
                    {/*/>*/}
                    {/*Inside corner*/}
                  {/*</label>*/}
                  {/*<br />*/}
                  {/*<label className="Label">*/}
                    {/*<Checkbox*/}
                      {/*disabled*/}
                      {/*checked*/}
                      {/*value="checkedE"*/}
                      {/*style={{ margin: 0, padding: 0, paddingLeft: "10px" }}*/}
                    {/*/>*/}
                    {/*Outside corner*/}
                  {/*</label>*/}
                  {/*<p className="TextBlock">*/}
                    {/*To apply to a specific corner*/}
                    {/*<br /> first ungroup the lines.{" "}*/}
                  {/*</p>*/}
                </div>
              <div className="ImageBlock">
                <img width="145px" src="resources/images/Corner.jpg" />
              </div>
            </div>
            </>
          )}
          {this.state.value === "Chamfer" && (
            <>
              <p>Sharp corners will be beveled to the specified distance.</p>

              <div className="Input">
                <label>Distance</label>
                <br />
                  <DimensionField
                      dimension={this.state.dimension}
                      value={this.state.distance}
                      tip={{place:'bottom', value:container.resolve("tips").getTip('corner-distance')}}
                      onChange={this.handleChangeInputDistance.bind(this)}
                  />
              </div>
            </>
          )}

        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        dimension: state.preferencesReducer.dimension,
        radius: state.cornerWindowReducer.radius,
        distance: state.cornerWindowReducer.distance,
        type: state.cornerWindowReducer.type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateRadius: radius => {
            dispatch({ type: "CHANGE_CORNER_RADIUS", radius: radius });
        },
        updateDistance: distance => {
            dispatch({ type: "CHANGE_CORNER_DISTANCE", distance: distance });
        },
        updateType: type => {
            dispatch({ type: "CHANGE_CORNER_TYPE", corner_type: type });
        }
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(Corner);
