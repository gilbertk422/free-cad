/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Slider from '@material-ui/core/Slider';
import {connect} from "react-redux";
import './preferences.scss';

class Preferences extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quality: container.resolve('config').discretizationQuality,
        };
    }

    handleRadioChange() {
        this.props.updateDimension(this.props.dimension === "Inches" ? "Millimeters" : "Inches");
    };

    changeQuality(e, value) {
        if (this.state.value == value / 10000) {
            return;
        }
        container.resolve('config').discretizationQuality = value / 10000;
        this.setState({quality: value / 10000});
        //todo: move to preference reducer
    }

    handleChangeShowRuler() {
        this.props.updateShowRuler(!this.props.showRuler);
    }

    render() {
        return (
            <div className="Preferences">
                <p>Measurements</p>
                <div>
                    <form>
                        <fieldset>
                            <legend>All dimensions are in</legend>

                            <FormControl>
                                <RadioGroup
                                    value={this.props.dimension}
                                    onChange={this.handleRadioChange.bind(this)}
                                >
                                    <FormControlLabel
                                        value="Inches"
                                        control={
                                            <Radio color="primary" classes={{root: "root"}}/>
                                        }
                                        label="Inches"
                                    />
                                    <FormControlLabel
                                        value="Millimeters"
                                        control={
                                            <Radio classes={{root: "root"}} color="primary"/>
                                        }
                                        label="Millimeters"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </fieldset>
                        <fieldset>
                            <legend>Calibrate Screen</legend>
                            <Button variant="contained" style={{marginTop: '12px'}} onClick={() => {
                                app.screenCalibrate()
                            }}>Calibrate</Button>
                            <p style={{marginTop: '12px'}}>To insure that the 1:1 button shows real-life size
                                accurately, hold a ruler to your screen and draw a 5 inch line. Then click this
                                button.</p>
                        </fieldset>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.props.showRuler}
                                    onChange={this.handleChangeShowRuler.bind(this)}
                                    color="primary"
                                />
                            }
                            label="Show ruler"
                        />

                        {/*<fieldset>*/}
                        {/*<legend>3D rendering quality.</legend>*/}
                        {/*<Slider min={400} max={10000} value={this.state.quality*10000} onChange={this.changeQuality.bind(this)}/>*/}
                        {/*<div style={{display:"flex", justifyContent: "space-between"}}>*/}
                        {/*<p>* This value may affect performance</p>*/}
                        {/*<p>{(this.state.quality*100).toFixed(2)} %</p>*/}
                        {/*</div>*/}
                        {/*</fieldset>*/}

                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        dimension: state.preferencesReducer.popup.dimension,
        showRuler: state.preferencesReducer.popup.showRuler
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateDimension: value => {
            dispatch({type: "UPDATE_DIMENSION", dimension: value, apply: false});
        },
        updateShowRuler: value => {
            dispatch({type: "UPDATE_SHOW_RULER", showRuler: value});
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
