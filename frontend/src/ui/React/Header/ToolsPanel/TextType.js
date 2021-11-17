/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";
import { Fragment } from "react";
import TextSelect from "./TextSelect";
import { connect } from "react-redux";
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class TextType extends React.Component {
    constructor(props) {
        super(props);
        //todo: app.selectElements[0].text -   need take from properties maybe
        this.state = {
            text: app.selectElements[0].text,
            textSize: this.props.textSize,
            dimension:this.getDimension(this.props.dimension),
            mobile:container.resolve('mobileDetector').mobile()!=null
        };
    }

    getDimension(name){
        if (name === "Millimeters") {
            return {name:'mm', multiplier:1};
        } else {
            return {name:"''", multiplier:25.4};
        }
    }

    componentWillMount() {
        app.addHandler("selectElements", elements => {
            if (app.selectElements.length == 1) {
                if (elements[0].typeName === "Text") {
                    let textSize = app.selectElements[0].fontSize.toFixed(3);
                    this.props.updateTextSize(textSize);
                    this.setState({ textSize: textSize});
                }
            }
        });
    }


    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)})
        if(this.state.text==="" && this.props.withoutText) {
            this.textInput.focus();
        }
    }

    handlyChangeTextInput = e => {
        let value = e.target.value;
        let text="";

        for(let i=0; i<value.length; i++){
            if(value.charCodeAt(i)<=127){
                text+=value.charAt(i);
            }
        }

      this.setState({text: text});
      app.setTextForSelectedElement(text);
    };

    handlyChangeTextSizeInput(textSize){
        this.setState({ textSize });
        this.props.updateTextSize(textSize);
        app.setFontSizeForSelectedElement(textSize);
    };

  render() {
    return (
      <Fragment>
          {!this.state.mobile && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
        <button className="btn-FontSize" tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/text-size.jpg"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-text-size')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={4}
              dimension={this.state.dimension}
              value={this.state.textSize}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-text-size')}}
              onChange={this.handlyChangeTextSizeInput.bind(this)}
          />
        {this.props.withoutText && (
          <>
            <button className="btn-Text" tabIndex={-1}>
                <img
                  width="18px"
                  src="resources/images/TEXT2.jpg"
                  data-place="bottom"
                  data-tip={container.resolve("tips").getTip('numeric-text')} data-html={true}
                />
            </button>
            <input
              id="text"
              style={{ maxWidth: "200px" }}
              type="text"
              data-place="bottom"
              tabIndex={5}
              data-tip={container.resolve("tips").getTip('numeric-text')} data-html={true}
              value={this.state.text}
              onChange={this.handlyChangeTextInput}
              ref={input => {
                this.textInput = input;
              }}
            />
          </>
        )}

        {this.props.withoutText && this.props.value === "Auto" && (
          <TextSelect />
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    dimension: state.preferencesReducer.dimension,
    textSize: state.toolsPanelReducer.textSize
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTextSize: textSize => {
      dispatch({ type: "UPDATE_TEXT_SIZE", payload: textSize });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextType);
