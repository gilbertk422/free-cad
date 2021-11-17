/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { connect } from "react-redux";

class ErrorGroovesWindow extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
    //   console.log(this.props, "props-Non-Work");
        return (
            <Dialog
                onBackdropClick={() => {
                    // this.props.openNonWork(!this.props.openNonWorkFeature);
                    this.props.openErrorGroovesWindow(!this.props.openErrorGrooves);

                }}
            maxWidth={false}
            open={this.props.openErrorGrooves}
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
                // height: "180px",
                minHeight: "140px",
                backgroundColor:'#f0ecec'
            }}
            >
            <div 
            style={{
            display:'flex',
            justifyContent:"space-between",
            marginTop:'5px',
            paddingLeft:'15px'}}>
                <span>Error</span>

                <Button
                   onClick={() => {
                    // this.props.openNonWork(!this.props.openNonWorkFeature);
                    this.props.openErrorGroovesWindow(!this.props.openErrorGrooves);

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
            <div style={{ margin: "15px 15px",textAlign:'left',paddinBottom:'15px' }}>
                <img
                width="25px"
                src="resources/images/Error1.jpg"
                />
                <p style={{ position:'relative', bottom:'25px',marginLeft: "60px",textAlign:'left'  }}>
             Groove top depth must be larger than 0.0.<br/>
             Specify a positive non-zero value.
                </p>
            </div>
            <div style={{position:'absolute',bottom:15,left:250,
            textAlign:'center'}}>
                <Button
                    onClick={() => {
                    this.props.openErrorGroovesWindow(!this.props.openErrorGrooves);
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
            </Dialog>

            );
        }
    }

    const mapStateToProps = state => {
        return {
            openErrorGrooves: state.errorGroovesWindowReducer.openErrorGrooves,

        };
    };

    const mapDispatchToProps = dispatch => {
        return {
            openErrorGroovesWindow:openErrorGrooves => {
                dispatch({ type: "OPEN_ERROR_GROOVES", payload: openErrorGrooves});
            }

        };
    };

export default connect(mapStateToProps,mapDispatchToProps)(ErrorGroovesWindow)