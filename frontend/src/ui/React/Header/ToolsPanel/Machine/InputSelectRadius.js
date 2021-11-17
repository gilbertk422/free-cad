/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import CreatableSelect from "react-select/lib/Creatable";
import { Fragment } from "react";
import { connect } from "react-redux";

const options = [
  { value: "0.508", label: '0.508 mm' },
  { value: "0.794", label: '0.784 mm' },
  { value: "1.016", label: '1.016 mm' },
  { value: "1.191", label: '1.191 mm'}, 
  { value: "1.588", label: '1.588 mm'}, 
  { value: "1.981", label: '1.981 mm'}, 
  { value: "2.381", label: '2.381 mm'}, 
  { value: "3.175", label: '3.175 mm'}, 
  { value: "3.969", label: '3.969 mm'}, 
  { value: "4.763", label: '4.763 mm'}, 
  { value: "5.556", label: '5.556 mm'}, 
  { value: "6.350", label: '6.350 mm'}, 
  { value: "9.525", label: '9.525 mm'}, 
  { value: "12.700", label: '12.700 mm'}, 
  { value: "19.050", label: '19.050 mm'}, 
  { value: "25.400", label: '25.400 mm'}, 
  
//   { value: "", label: "" },
];

// ---------------------------------------------------------------------------------------------------------------------------------------
class InputSelectRadius extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        options:options,
        displayInputSelect: true,
        newValue:options[0]
      };
    }


    handleChange = (newValue, actionMeta) => {
      // console.log(newValue,'1-defaultState');
        
        this.setState({
          options: options,
          newValue: newValue,
          displayInputSelect: false
        });

      }


    handleInputChange = (inputValue, actionMeta) => {
      // console.group('Input Changed');
      // console.log(inputValue);
      // console.log(`action: ${actionMeta.action}`);
      // console.groupEnd();
          let newValue = options.some(el => el.value === (+inputValue * 1).toFixed(3));
      // console.log(newValue, 'valueList')
        if (newValue === false && inputValue !== null && inputValue !== '') {
          options.push({
            value: (+inputValue * 1).toFixed(3), label: (+inputValue * 1).toFixed(3) + ' mm'
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

  export default InputSelectRadius;