/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Paper from '@material-ui/core/Paper';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Draggable from 'react-draggable';
import { connect } from "react-redux";


function PaperComponent(props) {
    return (
        <Draggable>
            <Paper {...props} />
        </Draggable>
    );
}



class ExpertNotice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "0"
    };
  }

  // componentWillMount(){
  //   console.log('WillMount');

  // }
    componentWillReceiveProps(nextProps) {
      if (nextProps.openExpertNotice === !this.props.openExpertNotice) {
        setTimeout(() => this.setState({ value: "0" }), 100);
      }
    }
    handleRadioChange = event => {
      event.preventDefault();

      this.setState({ value: event.target.value }, () => {
        this.setState({ value: this.state.value });
        // console.log(this.state.value, "1-after-this.state.value");
      });
    };
    componentWillUnmount() {
      // this.setState({ value: null })
      console.log("UnMount");
    }
    render() {
      // console.log(this.props, this.state.value,"props-ExpertNoticeKU");
      return (
        <Dialog
            onBackdropClick={() => {
                this.props.callbackCancel();
                this.props.updateExpertNotice(
                    !this.props.openExpertNotice,
                    this.props.expertNoticeText,
                    this.props.options,
                    this.props.callbackOK,
                    this.props.callbackCancel
                );
            }}
          maxWidth={false}
          open={this.props.openExpertNotice}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperComponent={PaperComponent}
        >
          <div
            style={{
              paddingBottom: "0px",
              textAlign: "left",
              maxWidth: "350px",
              // height: "180px",
              backgroundColor: "#f0ecec"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
                paddingLeft: "15px"
              }}
            >
              <span>Expert Notice</span>

              <Button
                onClick={() => {
                  this.props.callbackCancel();
                  this.props.updateExpertNotice(
                    !this.props.openExpertNotice,
                    this.props.expertNoticeText,
                    this.props.options,
                    this.props.callbackOK,
                    this.props.callbackCancel
                  );
                }}
                style={{
                  backgroundColor: "#f0ecec",
                  padding: "0px"
                }}
                color="primary"
              >
                <i className="material-icons">cancel_presentation</i>
              </Button>
            </div>
            <div
              className="Text"
              style={{ margin: "15px 15px", textAlign: "left" }}
            >
              <img width="30px" src="resources/images/InfoIcon.png" />
              <p
                style={{
                  position: "relative",
                  bottom: "25px",
                  marginLeft: "40px",
                  textAlign: "left"
                }}
              >
                {this.props.expertNoticeText}
              </p>
            </div>
              {this.props.options.length>0 && (
            <div
              className="RadioButton"
              style={{ margin: "15px", border: "1px solid #000", padding: "5px" }}
            >
              <FormControl>
                <RadioGroup
                  value={this.state.value}
                  onChange={this.handleRadioChange}
                >
                  {this.props.options.map((el, i) => (
                    <FormControlLabel
                      onClick={el.callback}
                      key={i}
                      classes={{ root: "root" }}
                      value={i.toString()}
                      control={<Radio color="primary" />}
                      label={el.text}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>)}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "10px"
              }}
            >
              <Button
                onClick={() => {
                  this.props.updateExpertNotice(
                    !this.props.openExpertNotice,
                    this.props.expertNoticeText,
                    this.props.options,
                    this.props.callbackOK,
                    this.props.callbackCancel
                  );
                  this.props.callbackOK();
                }}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginRight: "5px",
                  padding: "2px 2px"
                }}
                color="primary"
              >
                OK
              </Button>
              <Button
                onClick={() => {
                  this.props.callbackCancel();
                  this.props.updateExpertNotice(
                    !this.props.openExpertNotice,
                    this.props.expertNoticeText,
                    this.props.options,
                    this.props.callbackOK,
                    this.props.callbackCancel
                  );
                }}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginLeft: "5px",
                  marginRight: "5px",

                  padding: "2px 2px"
                }}
                color="primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      );
    }
}

  const mapStateToProps = state => {
    return {
      openExpertNotice: state.expertNoticeReducer.openExpertNotice,
      expertNoticeText: state.expertNoticeReducer.expertNoticeText,
      options: state.expertNoticeReducer.options,
      callbackOK: state.expertNoticeReducer.callbackOK,
      callbackCancel: state.expertNoticeReducer.callbackCancel
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      updateExpertNotice: (
        openExpertNotice,
        expertNoticeText,
        options,
        callbackOK,
        callbackCancel
      ) => {
        dispatch({
          type: "OPEN_EXPERT_NOTICE",
          payload: openExpertNotice,
          payloadText: expertNoticeText,
          payloadOptions: options,
          payloadOK: callbackOK,
          payloadCancel: callbackCancel
        });
      }
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(ExpertNotice);
