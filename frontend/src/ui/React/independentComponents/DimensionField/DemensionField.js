/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import GraphicElement from "../../../../model/GraphicElement";


export default class DimensionField extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            value:this.formattingValue(props.value, props.dimension),
            dimension:props.dimension,
            realValue:props.value
        };

        this.input = null
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            dimension:nextProps.dimension,
            value: this.formattingValue(nextProps.value, nextProps.dimension)
        });
    }


    handleChangeInput(e){
        let value = e.target.value;

        if (e.charCode === 13) {
            let realValue = this.value;
            this.setState({value: this.formatValue, realValue:realValue});
            this.props.onChange(realValue);
        }else{
            this.setState({value});
        }
    }

    handleBlurInput(e){
        let value = this.formatValue;
        if(value!=this.state.value) {
            let realValue = this.value;
            this.setState({value: value, realValue:realValue});
            this.props.onChange(realValue);
        }
    }

    get value(){
        return parseFloat(this.inputValue)*this.state.dimension.multiplier;
    }

    get inputValue(){
        return this.input.value.replace(/[^-0-9.]/g, "");
    }

    get formatValue(){
        return this.formattingValue(this.value, this.state.dimension);
    }

    formattingValue(value, dimension=this.state.dimension){
        if(value) {
            if(value==GraphicElement.AirInside){
                return 'Air inside';
            }
            return (value / dimension.multiplier).toFixed(3) + " " + dimension.name;
        }else{
            return '';
        }
    }

    render(){
        return (
            <input
                tabIndex={this.props.tabIndex?this.props.tabIndex:0}
                className={this.props.className}
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
        );
    }
}