/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ErrorGroovesWindow from "./ErrorGroovesWindow";
import ConfirmRemoveGrooves from "./ConfirmRemoveGrooves";
import { connect } from "react-redux";

class ParametersWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topDepth:this.props.topDepth.toFixed(3) + ' mm',
      width:this.props.width.toFixed(3) + ' mm',
      horisontalDepth:this.props.horisontalDepth.toFixed(3) + ' mm',
      add:false,
      // groovesData:[],
      groovesData:this.props.groovesData,
      selectValue:this.props.groovesData,
      isDisabled:true,
    };
  }

  componentWillMount(){
    let topDepth = this.props.topDepth;
    let width = this.props.width;
    let horisontalDepth = this.props.horisontalDepth;

    if(this.props.dimension==='Millimeters'){  
        this.setState({
          topDepth: (topDepth*1).toFixed(3) + ' mm',
          width: (width*1).toFixed(3) + ' mm',
          horisontalDepth: (horisontalDepth*1).toFixed(3) + ' mm',
      })
      this.props.groovesData.map(
        (el)=>{
          this.setState({groovesData:[{topDepth:el.topDepth.toFixed(3)+' mm',width:el.width.toFixed(3)+' mm',
          horisontalDepth:el.horisontalDepth.toFixed(3) +' mm'}]})
        })
      this.props.updateGroovesData(+topDepth,width,horisontalDepth,
      this.props.groovesData);
      } else {
        this.setState({topDepth: (topDepth/25.4).toFixed(3) + ' "',
       width: (width/25.4).toFixed(3) + ' "',
       horisontalDepth: (horisontalDepth/25.4).toFixed(3) + ' "',
      })
        this.props.groovesData.map(
          (el)=>{
            this.setState({groovesData:[{topDepth:(el.topDepth/25.4).toFixed(3)+' "',width:(el.width/25.4).toFixed(3)+' "',
            horisontalDepth:(el.horisontalDepth/25.4).toFixed(3) +' "'}]})
          })
    this.props.updateGroovesData(+topDepth,width,horisontalDepth,this.props.groovesData);

      }
  }
      componentDidUpdate(prevProps, prevState) {
        if (this.props.dimension !== prevProps.dimension) {
          let topDepth = this.props.topDepth;
          let width = this.props.width;
          let horisontalDepth = this.props.horisontalDepth;
  
          if(this.props.dimension==='Millimeters'){  
              this.setState({
                topDepth: (topDepth*1).toFixed(3) + ' mm',
                width: (width*1).toFixed(3) + ' mm',
                horisontalDepth: (horisontalDepth*1).toFixed(3) + ' mm'
            })
                this.props.groovesData.map(
                (el)=>{
                  this.setState({groovesData:[{topDepth:el.topDepth.toFixed(3)+' mm',width:el.width.toFixed(3)+' mm',
                  horisontalDepth:el.horisontalDepth.toFixed(3) +' mm'}]})
                })
          this.props.updateGroovesData(+topDepth,+width,+horisontalDepth,this.props.groovesData);

            } else {
              this.setState({
                topDepth: (topDepth/25.4).toFixed(3) + ' "',
                width: (width/25.4).toFixed(3) + ' "',
                horisontalDepth: (horisontalDepth/25.4).toFixed(3) + ' "'})
                this.props.groovesData.map(
                (el)=>{
                  this.setState({groovesData:[{topDepth:(el.topDepth/25.4).toFixed(3)+' "',width:(el.width/25.4).toFixed(3)+' "',
                  horisontalDepth:(el.horisontalDepth/25.4).toFixed(3) +' "'}]})
                })
          this.props.updateGroovesData(+topDepth,+width,+horisontalDepth,this.props.groovesData);
            }
        }
      }

    handlyChangeInputTopDepth = e => {
      let topDepth = e.target.value;
      let topDepthNumber = topDepth.replace(/[^0-9.]/g, "") ;
      this.props.updateGroovesData((+topDepthNumber*1).toFixed(3),this.props.width,this.props.horisontalDepth)
      this.setState({
        topDepth
      });
    
      if (e.charCode === 13) {
        if (this.props.dimension === 'Millimeters') {
    
            this.setState({
              topDepth: this.props.topDepth.replace(/[^0-9.]/g, "") + ' mm'
            })

          let topDepth1 = +this.state.topDepth.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+topDepth1,+this.props.width,+this.props.horisontalDepth,
            [{topDepth:topDepth1,width:+this.props.width,
            horisontalDepth:+this.props.horisontalDepth}]
            );
          this.topInput.blur();
        } else {
          this.setState({
            topDepth: this.props.topDepth.replace(/[^0-9.]/g, "") + ' "'
          });
          let topDepth1 = this.state.topDepth.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+topDepth1*25.4,+this.props.width,+this.props.horisontalDepth,
            [{topDepth:+topDepth1*25.4,width:this.props.width,
            horisontalDepth:+this.props.horisontalDepth}]
            );
          this.topInput.blur();
        }
      }
    }

    handlyChangeInputWidth = e => {
      let width = e.target.value;
      let widthNumber = width.replace(/[^0-9.]/g, "") ;
      this.props.updateGroovesData(this.props.topDepth,(widthNumber*1).toFixed(3),this.props.horisontalDepth)
      this.setState({
        width
      });
    
      if (e.charCode === 13) {
        if (this.props.dimension === 'Millimeters') {
    
            this.setState({
              width: this.props.width.replace(/[^0-9.]/g, "") + ' mm'
            })
          let width1 = this.state.width.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+this.props.topDepth,+width1,+this.props.horisontalDepth,
            [{topDepth:this.props.topDepth,width:+width1,
            horisontalDepth:+this.props.horisontalDepth}]
            );
          this.widthInput.blur();
        } else {
          this.setState({
            width: this.props.width.replace(/[^0-9.]/g, "") + ' "'
          });
          let width1 = this.state.width.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+this.props.topDepth,+width1*25.4,+this.props.horisontalDepth,
            [{topDepth:this.props.topDepth,width:+width1*25.4,
            horisontalDepth:+this.props.horisontalDepth}]
            );
          this.widthInput.blur();
        }
      }
    }

    handlyChangeHorisontalDepthInput = e => {
      let horisontalDepth = e.target.value;
      let horisontalDepthNumber = horisontalDepth.replace(/[^0-9.]/g, "") ;
      this.props.updateGroovesData(this.props.topDepth,this.props.width,
        (horisontalDepthNumber*1).toFixed(3),this.props.groovesData)
      this.setState({
        horisontalDepth
      });
      if (e.charCode === 13) {
        if (this.props.dimension === 'Millimeters') {
    
            this.setState({
              horisontalDepth:this.props.horisontalDepth.replace(/[^0-9.]/g, "") + ' mm',
          })
          let horisontalDepth1 = this.state.horisontalDepth.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+this.props.topDepth,+this.props.width,+horisontalDepth1,
            [{topDepth:this.props.topDepth,width:this.props.width,
            horisontalDepth:+horisontalDepth1}]
            );
          this.horisontalInput.blur();
        } else {
          this.setState({
            horisontalDepth: this.props.horisontalDepth.replace(/[^0-9.]/g, "") + ' "'
          });
          let horisontalDepth1 = this.state.horisontalDepth.replace(/[^0-9.]/g, "")
          this.props.updateGroovesData(+this.props.topDepth,+this.props.width,+horisontalDepth1*25.4,
            [{topDepth:this.props.topDepth,width:this.props.width,
            horisontalDepth:(+horisontalDepth1*25.4).toFixed(3)}]
            );
          this.horisontalInput.blur();        
        }
      }
    }

    addGroovesData = () => {
      if (this.props.topDepth === 0 || this.props.width === 0 || this.props.horisontalDepth === 0) {
        this.props.openErrorGroovesWindow(!this.props.openErrorGrooves);
      } else {
   
        this.props.groovesData.map(
          (el) => {
  
            if (this.props.dimension === 'Millimeters') {

              this.state.groovesData.push({ topDepth: (el.topDepth * 1).toFixed(3) + ' mm', width: (el.width * 1).toFixed(3) + ' mm', horisontalDepth: (el.horisontalDepth * 1).toFixed(3) + ' mm' })
              this.props.updateGroovesData(+this.props.topDepth, +this.props.width, +this.props.horisontalDepth,
                this.props.groovesData
              );
      
              this.setState({ add: true })

            } else {
              this.state.groovesData.push({ topDepth: (el.topDepth / 25.4).toFixed(3) + ' "', width: (el.width / 25.4).toFixed(3) + ' "', horisontalDepth: (el.horisontalDepth / 25.4).toFixed(3) + ' "' })
              this.props.updateGroovesData(+this.props.topDepth, +this.props.width, +this.props.horisontalDepth,
                this.props.groovesData
              );
              this.setState({ add: true })
            }
          }
        
        )
      }
    }
    
    handleChangeSelect = e => {
      // console.log(e.target.value, 'selectValue')
      this.setState({selectValue:e.target.value});
    }

    replaceGroovesData = () => {
        this.state.groovesData.map(
                (el,i)=>{
              if( i==this.state.selectValue){
                  if(el.topDepth!==this.state.topDepth){
                    el.topDepth = this.state.topDepth;
                  }
                  if(el.width!==this.state.width){
                    el.width = this.state.width;
                  }
                  if(el.horisontalDepth!==this.state.horisontalDepth){
                    el.horisontalDepth = this.state.horisontalDepth;
                  }
            this.setState({
              groovesData:this.state.groovesData 
            })
          }
        })
    }

    removeGroovesData = () => {
      this.props.updateRemoveGrooves(!this.props.openRemoveGrooves)
    }
    
    openGroovesHelp = () => {
      window.open("https://www.emachineshop.com/help-3d-drawing/#grooves");
    }
    
    render() {
      // console.log(this.props, "props-Grooves");
      return (
        <>
        <Dialog
            onBackdropClick={() => {
                this.props.updateSetGrooves(!this.props.openSetGrooves);
            }}
          maxWidth={false}
          open={this.props.openSetGrooves}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            style={{
              paddingBottom: "0px",
              textAlign: "left",
              maxWidth: "420px",
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
              <span>Set grooves parameters</span>

              <Button
                onClick={() => {
                  this.props.updateSetGrooves(!this.props.openSetGrooves);
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

            <fieldset
              className="SideView"
              style={{
                margin: "15px",
                padding: "5px"
              }}
            >
            <div  style={{
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "10px",
                // padding: "5px"
              }}>
              <div>
                <img src="resources/images/ParametersGrooves.png" />
              </div>
              <div  style={{
                display: "flex",
                flexDirection:"column",
                marginLeft: "10px",
          
              }}>
                  <div className="Input">
                        <input
                            ref={input => {
                              this.topInput = input;
                            }}
                            value={this.state.topDepth}
                            onChange={this.handlyChangeInputTopDepth}
                            onKeyPress={this.handlyChangeInputTopDepth}
                          type="text"
                      style={{width:'80px',margin:'15px'}}
                        />
                        <label
                      style={{fontSize:'14px'}}                                           
                        >Top Depth</label>

                      </div>
                      <div className="Input">
                        <input
                              ref={input => {
                                this.widthInput = input;
                              }}
                              value={this.state.width}
                              onChange={this.handlyChangeInputWidth}
                              onKeyPress={this.handlyChangeInputWidth}
                          type="text"
                          style={{width:'80px',margin:'15px'}}
                      
                        />
                        <label 
                      style={{fontSize:'14px'}}                     
                        >Width</label>

                      </div>
                          <div className="Input">
                        <input
                            ref={input => {
                              this.horisontalInput = input;
                            }}
                            value={this.state.horisontalDepth}
                            onChange={this.handlyChangeHorisontalDepthInput}
                            onKeyPress={this.handlyChangeHorisontalDepthInput}
                          type="text"
                          style={{width:'80px',margin:'15px'}}                   
                        />
                        <label
                      style={{fontSize:'14px'}}                                           
                        >Horisontal Depth</label>

                      </div>
              </div>
              </div>
            </fieldset>

            <fieldset
              className="Grooves"
              style={{ margin: "15px", border: "1px solid #000", padding: "5px" }}
            >
              <legend>Grooves</legend>

              <div  style={{
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "10px",
                // padding: "5px"
              }}>
              <div style={{width:'220px',height:'160px',backgroundColor:"white"}}>
      
                    {this.state.add && 
                    <select
                      multiple={true}
                      className="SelectMode"
                      value={this.state.selectValue}
                      onChange={this.handleChangeSelect}
                      style={{width:'220px',height:'160px',backgroundColor:"white", overflowY: 'auto'}}
                    >
                      {this.state.groovesData.map((el, i) => (
                        <option value={i} key={i} >
                          {i + 1} - {el.topDepth}, {el.width}, {el.horisontalDepth}
                         
                        </option>
                      ))}
                    </select>}
              </div>
              <div  style={{
                display: "flex",
                flexDirection:"column",
                marginLeft: "10px",
          
              }}>
                  <Button
                onClick={this.addGroovesData}
                style={{
                  width:'130px',
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginBottom:'10px',
                  padding: "2px 2px"
                }}
                color="primary"
              >
                Add
              </Button>
              <Button
                onClick={this.replaceGroovesData}            
                style={{
                  width:'130px',
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginBottom:'10px',
                  padding: "2px 2px"
                }}
                color="primary"
                disabled={this.state.groovesData.length===0 ? this.state.isDisabled : !this.state.isDisabled}
              >
                Replace
              </Button>
              <Button
                onClick={this.removeGroovesData}
            
                style={{
                  width:'130px',
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  // marginRight: "5px",
                  marginBottom:'10px',
                  padding: "2px 2px"
                }}
                color="primary"
                disabled={this.state.groovesData.length===0 ? this.state.isDisabled : !this.state.isDisabled}
              >
                Remove
              </Button>
                      {/* </div> */}
              </div>
              </div>
            </fieldset>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "10px"
              }}
            >
              <Button
                onClick={() => {
                  this.props.updateSetGrooves(!this.props.openSetGrooves);
                }}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginRight: "5px",
                  padding: "2px 2px"
                }}
                color="primary"
                disabled={this.state.groovesData.length===0 ? this.state.isDisabled : !this.state.isDisabled}
              >
                OK
              </Button>
              <Button
                onClick={() => {
                  this.props.updateSetGrooves(!this.props.openSetGrooves);
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
              <Button
                onClick={this.openGroovesHelp}
                style={{
                  backgroundColor: "#dddada",
                  boxShadow: "2px 2px 1px #000",
                  marginLeft: "5px",
                  marginRight: "5px",
                  padding: "2px 2px"
                }}
                color="primary"
              >
                Help
              </Button>
            </div>
          </div>
        </Dialog>
        <ErrorGroovesWindow/>
        <ConfirmRemoveGrooves selectValue={this.state.selectValue} groovesData={this.state.groovesData}/>
        </>
      );
    }
}

    const mapStateToProps = state => {
      return {
        openSetGrooves: state.setGroovesReducer.openSetGrooves,
        dimension: state.preferencesReducer.dimension,
        topDepth:state.groovesParametersReducer.topDepth,
        width:state.groovesParametersReducer.width,
        horisontalDepth:state.groovesParametersReducer.horisontalDepth,
        groovesData:state.groovesParametersReducer.groovesData,
        openErrorGrooves: state.errorGroovesWindowReducer.openErrorGrooves,
        openRemoveGrooves: state.removeGroovesReducer.openRemoveGrooves


      };
    };

    const mapDispatchToProps = dispatch => {
      return {
        updateSetGrooves: openSetGrooves => {
          dispatch({
            type: "OPEN_SET_GROOVES",
            payload: openSetGrooves
          });
        },
        updateGroovesData: (topDepth,width,horisontalDepth,groovesData) => {
          dispatch({ type: "UPDATE_GROOVES_DATA", 
          payloadTopDepth: topDepth,
          payloadWidth:width,
          payloadHorisontalDepth: horisontalDepth ,
          payloadGrooves:groovesData});
        },
        openErrorGroovesWindow:openErrorGrooves => {
          dispatch({ type: "OPEN_ERROR_GROOVES", payload: openErrorGrooves});
      },
      updateRemoveGrooves: openRemoveGrooves => {
      dispatch({type: "OPEN_REMOVE_GROOVES", payload: openRemoveGrooves});
    }
      };
    };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParametersWindow);
