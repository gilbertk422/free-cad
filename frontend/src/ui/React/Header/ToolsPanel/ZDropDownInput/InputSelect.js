/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import "./ZDropDownInput.scss";
import React from "react";
import DimensionField from "../../../independentComponents/DimensionField/DemensionField";

export default class InputSelect extends DimensionField {
    constructor(props) {
        super(props);

        this.state = {
            showDropList:false,
            value:this.formattingValue(props.value, props.dimension),
            dimension:props.dimension,
        };

        /** @type {Config} */
        this.config = container.resolve('config');

        this.down=false;
    }

    showDropList(){
        this.setState({showDropList:!this.state.showDropList});
    }

    selectValue(value,e){
        this.down=false;
        this.setState({value: this.formattingValue(value, this.state.dimension), realValue:value, showDropList:false});
        this.props.onChange(value);
    }

    mouseDown(e){
        this.down=true;
    }

    handleBlurInput(e){
        if(!this.down){
            super.handleBlurInput(e);
        }
    }

    handleChangeInput(e){
        super.handleChangeInput(e);
        this.setState({showDropList:false});
    }

    render(){
        return (
            <div id="propertyBarZInputBlock"
                 onFocus={this.showDropList.bind(this)}>
                <input
                    tabIndex={this.props.tabIndex?this.props.tabIndex:0}
                    type="text"
                    onChange={this.handleChangeInput.bind(this)}
                    onKeyPress={this.handleChangeInput.bind(this)}
                    onBlur={this.handleBlurInput.bind(this)}
                    ref={input => {this.input = input;}}
                    value={this.state.value}

                    data-html={true}
                    data-place={this.props.tip.place}
                    data-tip={this.props.tip.value}
                />
                <span onClick={this.showDropList.bind(this)}>^</span>
                {this.state.showDropList &&
                    <div className="DropList">
                        <ul>
                            {this.config.defaultZValues.map((value, index) => {return (
                                <li key={index}
                                    onMouseDown={this.mouseDown.bind(this)}
                                    onClick={(e)=>this.selectValue(value,e)}
                                >
                                    {this.formattingValue(value)}
                                </li>
                            )})}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}
