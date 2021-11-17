/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./order-options.scss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
// import { connect } from "react-redux";

export default class BendSpecification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:0
        };
    }

    componentWillMount() {
        let elements = app.currentDocument.getListSimpleElements();
        let radius = 0;

        for(let el of elements){
            if(el.lineType.name =="Bend"){
                radius = el.lineType.processing[0].radius;
                break;
            }
        }
        this.setState({value:radius});
    }


    changeRadius(e){
        let val = e.target.value;
        app.changeBendRadius(parseFloat(val));
        this.setState({value:val});
    }

    render() {
        return (
            <div className="OrderOptions">
                <fieldset className="Fieldset">
                    <legend>Tolerance, General</legend>
                    Linear (bend position): +/- 0.7 mm <br/>
                    Angles: +/-2&#176; <br/>

                    Tolerances apply to the position of the bend line on the flat part - not to be exterior or interior dimensions after bending.<br/>
                    If you need to specify a tolerance on some final dimension, use the Model Bend command and show the critical dimension and tolerance using Comments to Machinist.<br/>
                    Tolerances are not applicable to parts with inadequate structure.
                </fieldset>
                <fieldset className="Fieldset">
                    <legend>Radius of Bend Tool</legend>
                    <select value={this.state.value} onChange={this.changeRadius.bind(this)}>
                        <option value="0.79">0.79 mm Lowest cost</option>
                        <option value="1.59">1.59 mm</option>
                        <option value="3.17">3.17 mm</option>
                        <option value="6.35">6.35 mm</option>
                    </select>
                    Radius of bend tool. See Job | Model Bends for approximation of bend radius.
                </fieldset>
                <fieldset className="Fieldset">
                    <legend>Notes</legend>
                    To reduce cost, design parts that pack efficiently.
                </fieldset>
            </div>
        );
    }
}
// const mapStateToProps = state => {
//   return {
//     // firstName: state.summaryReducer.firstName,
//     // lastName: state.summaryReducer.lastName
//     order:state.summaryReducer.order

//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     updateOrder: value => {
//       dispatch({ type: "ORDER", payload: value });
//     }
//   };
// };
// export default connect(mapStateToProps,mapDispatchToProps)(OrderOptions);