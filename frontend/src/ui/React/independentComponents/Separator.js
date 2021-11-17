

/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

export default class Separator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{width:"100%",  height:"11px",  borderBottom:"1px solid #000000", textAlign:"center", marginBottom:"10px"}}>
              <span style={{fontSize:"18px", backgroundColor:"rgb(240, 236, 236)", padding:"0 10px"}}>
                  {this.props.text}
              </span>
            </div>
        );
    }
}
