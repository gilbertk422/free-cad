/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import CreatableSelect from "react-select/lib/Creatable";
import { Fragment } from "react";
import { connect } from "react-redux";

const options = [
  { value: "45.00", label: '45.00 deg' },
  { value: "60.00", label: '60.00 deg' },
  { value: "90.00", label: '90.00 deg' },
  { value: "92.00", label: '92.00 deg'}, 
  { value: "95.00", label: '95.00 deg'}, 
  { value: "135.00", label: '135.00 deg'}, 

//   { value: "", label: "" },
];

// ---------------------------------------------------------------------------------------------------------------------------------------
class InputSelectAuto extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        options:options,
        displayInputSelect: true,
        newValue:options[2]
      };
    }


    handleChange = (newValue, actionMeta) => {
      // console.log(+newValue.value,'1-newValue');
        if(+newValue.value<90){
            this.props.updateState45(true);
        } else if(+newValue.value > 90){
            this.props.updateState135(true);
        } else {
            this.props.updateState90(true);
        }

        this.setState({
          options: options,
          newValue: newValue,
          displayInputSelect: false
        });

      }


    handleInputChange = (inputValue, actionMeta) => {
      // console.group('Input Changed');
      // console.log(inputValue,'inputValue');
      // console.log(`action: ${actionMeta.action}`);
      // console.groupEnd();
          let newValue = options.some(el => el.value === (+inputValue * 1).toFixed(2));
      // console.log(newValue, 'valueList')
        if (newValue === false && inputValue !== null && inputValue !== '') {
          options.push({
            value: (+inputValue * 1).toFixed(2), label: (+inputValue * 1).toFixed(2) + ' deg'
          });
        
        }
 
    }
 
    render() {
      // console.log(this.props,'props-input-select')
      //Warning!!! CustomStyles for React-Select module - https://react-select.com/props#statemanager-props
      const customStyles = {
        container:(styles)=>({
            ...styles,
        }),
        menuList: styles => ({
          ...styles,
          position: "relative",
          bottom: 8,
          backgroundColor: "white"
        }),
        control:
         () => ({
          //  styles => ({
          //  ...styles,
          display: "flex",
          paddingTop: '2px',
          paddingBottom:'0px',
          height: 18,
          width: 200,
          color:'black',
          fontFamily:'sans-serif',
          fontSize: '12.5px',
          fontWeght:'bold',
          // color:'green',
          backgroundColor: "#fff",
          border: "1px solid #808080"
        }),
        input: 
        // styles => ({
        //   ...styles,
        () => ({
          background: "white",
        }),
        option: () => ({
          fontFamily:'sans-serif',
          fontSize: '12.5px',
          fontWeght:'bold',
          borderLeft: "2px solid transparent",
          borderBottom: "1px solid #e5e5e5",
          padding: 2,
          ":hover": {
            backgroundColor: "#e5e5e5",
            borderLeft: "2px solid orange",
            cursor: "pointer"
          }
        }),
        dropdownIndicator: () => ({
          color: "orangered"
        }),
        indicatorSeparator: () => ({
          color: "orange"
        })
      };

      return (
        
    
          <CreatableSelect
            onMouseLeave={this.handleInputChange}
            styles={customStyles}
            isDisabled={this.props.disabled}
            // isClearable
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            // onKeyPress={this.handleInputChange}
            options={this.state.options}
            value={this.state.newValue}
            placeholder=""
          />
      );
    }
  }

  export default InputSelectAuto;


