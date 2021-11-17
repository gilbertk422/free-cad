/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { connect } from "react-redux";

class NonWorkFeature extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
    //   console.log(this.props, "props-Non-Work");
        return (
            <Dialog
                onBackdropClick={() => {
                    // this.props.openNonWork(!this.props.openNonWorkFeature);
                    this.props.openNonWork(false);

                }}
            maxWidth={false}
            open={this.props.openNonWorkFeature}
            // open={true}
            // onChange={this.handleChangeSelect}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <div
            style={{
                paddingBottom:'0px',
                textAlign: "left",
                maxWidth: "580px",
                minHeight: "180px",
                // height: "130px",
                backgroundColor:'#f0ecec'
            }}
            >
            <div 
            style={{
            display:'flex',
            justifyContent:"space-between",
            marginTop:'5px',
            paddingLeft:'15px'}}>
                <span>Information</span>

                <Button
                   onClick={() => {
                    // this.props.openNonWork(!this.props.openNonWorkFeature);
                    this.props.openNonWork(false);

                  }}
                    style={{
                        backgroundColor:'#f0ecec',
                        padding:'0px',
                    }}
                    color="primary"
                >
                <i className = "material-icons">
                    cancel_presentation
                </i>
                </Button>
            </div> 
            {/* <div style={{display:'flex',flexDirection:'column',heigh}}> */}
            <div style={{ margin: "15px 15px",textAlign:'left' }}>
                <img
                width="25px"
                src="resources/images/Info.png"
                />
                <p style={{ position:'relative', bottom:'25px',marginLeft: "40px",textAlign:'left',  userSelect: 'text'}}>
                    {this.props.infoText}
                {/* Sorry, this feature will be realised in the next versions */}
                </p>
            </div>
            <div style={{position:'absolute',bottom:15,right:50,
            textAlign:'center'}}>
                <Button
                    onClick={() => {
                        // this.props.openNonWork(!this.props.openNonWorkFeature);
                    this.props.openNonWork(false);
                            }}
                    style={{
                        backgroundColor: "#dddada",
                        boxShadow: "2px 2px 1px #000",
                        margin: "0 auto",
                        padding:'2px 2px',
                    }}
                    color="primary"
                >
                OK
                </Button>
            </div>
            </div>
            {/* </div> */}
            </Dialog>

            );
        }
    }

    const mapStateToProps = state => {
        return {
            openNonWorkFeature: state.nonWorkFeatureReducer.openNonWorkFeature,
            infoText: state.nonWorkFeatureReducer.infoText

        };
    };

    const mapDispatchToProps = dispatch => {
        return {
            openNonWork: (openNonWorkFeature,infoText) => {
                dispatch({ type: "OPEN_NON_WORK_FEATURE", payload: openNonWorkFeature, payloadText:infoText });
            }

        };
    };

export default connect(mapStateToProps,mapDispatchToProps)(NonWorkFeature)