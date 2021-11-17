/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import ReactTooltip from "react-tooltip";
import { Fragment } from "react";

export default class InputSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile:container.resolve('mobileDetector').mobile()!=null
    };
  }


  render() {

    /** @type {FontManager} */
    let fm = container.resolve("fontManager");

    return (
      <Fragment>
        {!this.state.mobile && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
        <button className="btn-Font">
          <a href="#">
            <img
              width="18px"
              src="resources/images/Text.png"
              data-place="bottom"
              data-tip="<span>Font<br/>Name of font used to draw text.To change,<br/> select a new value. </span>"
            />
          </a>
        </button>

        <select
            tabIndex={4}
            className="SelectMode"
            // value={this.state.value}
            // onChange={this.handleChangeSelect.bind(this)}
        >
          {fm.fonts.map((font, i) => (
              <option value={font.name} key={i} >
                {font.name}
              </option>
          ))}

        </select>
      </Fragment>
    );
  }
}
