/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React, { Fragment } from "react";
import ReactTooltip from "react-tooltip";
import {connect} from 'react-redux';
import DimensionField from "../../independentComponents/DimensionField/DemensionField";

class MoveButtons extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          bgColorCopy: container.resolve('config').copymode ? "#fff" : "#f0f0f0d9",
          moveStep:container.resolve('config').moveStep,
          rotateStep: container.resolve('config').rotateStep,
          dimension:this.getDimension(this.props.dimension)
      };
    }

    getDimension(name){
        if (name === "Millimeters") {
            return {name:'mm', multiplier:1};
        } else {
            return {name:"''", multiplier:25.4};
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({dimension:this.getDimension(nextProps.dimension)});
    }


    handleClickCopy(){
        container.resolve('config').copymode = !container.resolve('config').copymode;
        this.setState({
            bgColorCopy: container.resolve('config').copymode ? "#fff" : "#f0f0f0d9"
        });
    }

    /**
     * @return {boolean}  - true if enable coppy mode
     */
    copyMode() {
        return container.resolve('config').copymode;
    }

    moveUp = () => {
        if (!this.copyMode()) {
            app.moveSelected(0, app.config.moveStep);
        } else {
            app.copyMoveSelected(0, app.config.moveStep);
        }
    }

    moveDown = () => {
        if (!this.copyMode()) {
            app.moveSelected(0, -app.config.moveStep);
        } else {
             app.copyMoveSelected(0, -app.config.moveStep);
        }
    }

    moveLeft = () => {
        if (!this.copyMode()) {
            app.moveSelected(-app.config.moveStep, 0);
        } else {
            app.copyMoveSelected(-app.config.moveStep, 0);
        }
    }

    moveRight = () => {
        if (!this.copyMode()) {
            app.moveSelected(app.config.moveStep, 0);
        } else {
             app.copyMoveSelected(app.config.moveStep, 0);
        }
    };


    handlyChangeInputMove(moveStep){
        this.props.updateMoveStep(moveStep);
        this.setState({moveStep});
        container.resolve('config').moveStep = +moveStep;
    }
// -------------------------------------Rotate-------------------------------------------------------
    rotateLeft = () => {
        if (!this.copyMode()) {
            app.rotateSelected(-app.config.rotateStep);
        } else {
             app.copyRotateSelected(-app.config.rotateStep);
        }
    };

    rotateRight = () => {
        if (!this.copyMode()) {
            app.rotateSelected(app.config.rotateStep);
        } else {
            app.copyRotateSelected(app.config.rotateStep);
        }
    };

    handlyChangeInputRotate(rotateStep){
        this.setState({rotateStep});
        container.resolve('config').rotateStep = +rotateStep;
    };

  render() {
    return (
      <Fragment>
        <button
            tabIndex={-1}
          className="btn-Copy"
          onClick={this.handleClickCopy.bind(this)}
          style={{ backgroundColor: this.state.bgColorCopy }}
        >
            <img
              width="18px"
              src="resources/images/Copy.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-repeat')} data-html={true}
            />
        </button>
        <button className="btn-Up" onClick={this.moveUp} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Up.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-nudge')} data-html={true}
            />
        </button>
        <button className="btn-Down" onClick={this.moveDown} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Down.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-nudge')} data-html={true}
            />
        </button>
        <button className="btn-Left" onClick={this.moveLeft} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Left.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-nudge')} data-html={true}
            />
        </button>
        <button className="btn-Right" onClick={this.moveRight} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Right.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-nudge')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={11}
              dimension={this.state.dimension}
              value={this.state.moveStep}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-nudge-step')}}
              onChange={this.handlyChangeInputMove.bind(this)}
          />

        <button className="btn-LeftRotate" onClick={this.rotateLeft} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Unclock.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-rotate-counterclockwise')} data-html={true}
            />
        </button>
        <button className="btn-RightRotate" onClick={this.rotateRight} tabIndex={-1}>
            <img
              width="18px"
              src="resources/images/Clock.png"
              data-place="bottom"
              data-tip={container.resolve("tips").getTip('numeric-rotate-clockwise')} data-html={true}
            />
        </button>
          <DimensionField
              tabIndex={12}
              dimension={{name:'deg', multiplier:1}}
              value={this.state.rotateStep}
              tip={{place:'bottom', value:container.resolve("tips").getTip('numeric-rotate-step')}}
              onChange={this.handlyChangeInputRotate.bind(this)}
          />
      </Fragment>
    );
  }
}
const mapStateToProps = (state)=>{
    return {
        dimension: state.preferencesReducer.dimension,
        moveStep: state.movingReducer.moveStep,
    }
};
const mapDispatchToProps = dispatch => {
    return {
        updateMoveStep: moveStep => {
            dispatch({ type: "UPDATE_MOVE_STEP", payload: moveStep });
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(MoveButtons)