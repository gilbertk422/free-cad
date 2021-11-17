/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./bottom-panel.scss";
import MouseCoordinates from './MouseCoordinates';

export default class BottomPanel extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          fileName:app.currentDocument.fileName
      };

      app.addHandler('openNewFile',(doc)=>{
          this.setState({fileName:doc.fileName});
      });
    }

    openSuggestion(){
        global.store.dispatch({ type: "OPEN_FEEDBACK"});
    }


    render(){
        return(
            <div className="BottomPanel">
                <div className="FileNameLabel">{this.state.fileName}</div>
                <div>Beta Release - 2D CAD. Also, try our full-featured <a target="_blank" href="https://www.emachineshop.com/free-download/">CAD for Windows</a>.</div>
                <MouseCoordinates/>

                <div className="suggestionsBorderButton">
                    <div onClick={this.openSuggestion.bind(this)}>
                        <svg className="icon"><use xlinkHref="icons.svg#box-paper"></use></svg>
                        Suggestions
                    </div>
                </div>
            </div>
        )
    }
}