/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./suggestion.scss";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {connect} from "react-redux";
import TextField from "../../independentComponents/TextFieldStyled";
import TextFieldStyled from "../../independentComponents/TextFieldStyled";

class TechSupport extends React.Component {

    handleChangeInputEmail(e){
        this.props.changeEmail(e.target.value);
    }

    handleChangeCategory(e){
        this.props.changeCategory(e.target.value);
    }

    handleChangeAddDrawing(){
        this.props.changeAddDrawing(!this.props.addDrawing);
    }

    handleChangeMessage(e){
        this.props.changeMessage(e.target.value);
    }

    sendMessage(){
        this.props.send();
    }

    openGuideSuggestionWindow(){
        window.open("https://www.emachineshop.com/help/");
    }

    render() {
        return (
            <Dialog
                className="techSupport"
                maxWidth={false}
                open={this.props.openTechSupport || this.props.openFeedback}
                onClose={this.props.closeTechSupport}
                onBackdropClick={this.props.closeTechSupport}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" >
                    <img width="25px" src="resources/images/icon.png"/>
                    {this.props.openTechSupport?"Tech Support":"Feedback"}
                </DialogTitle>

                <DialogContent className="content">
                    <form onSubmit={(e)=>{e.preventDefault()}}>
                        <div className="Email">
                            <label>Reply to:</label>
                            <br />
                            <TextFieldStyled
                                error={this.props.errors.filter(e=>e.fieldName=="email").length>0?"error":""}
                                fullWidth
                                required
                                label={"Email"}
                                value={this.props.email}
                                onChange={this.handleChangeInputEmail.bind(this)}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="SelectBlock">
                            <label>
                                Category:
                                <select
                                    className="Select"
                                    value={this.props.category}
                                    onChange={this.handleChangeCategory.bind(this)}
                                >
                                    <option value="Drawing">Drawing</option>
                                    <option value="Material">Material</option>
                                    <option value="Finish">Finish</option>
                                    <option value="Feature">Feature</option>
                                    <option value="Analyzer">Analyzer</option>
                                    <option value="Pricing">Pricing</option>
                                    <option value="Other">Other (please specify)</option>
                                </select>
                            </label>
                            {this.props.category==="Other" && <input className="InputInSelect" type="text" />}
                        </div>
                        <div className="Textarea">
                            <label>Inquiry:</label><br/>
                            <TextField
                                error={this.props.errors.filter(e=>e.fieldName=="message").length>0?"error":""}
                                multiline={true}
                                variant="outlined"
                                rows="10" style={{width:"100%"}}
                                onChange={this.handleChangeMessage.bind(this)}
                                value={this.props.message}
                            />
                        </div>
                        <div className="Checkbox">
                            <label>
                                <Checkbox
                                    onChange={this.handleChangeAddDrawing.bind(this)}
                                    checked={this.props.addDrawing}
                                    color="primary"
                                />
                                Send my design and command log
                            </label>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions className="actions">
                    <Button
                        onClick={this.sendMessage.bind(this)}
                        color="primary"
                        disabled={this.props.blockSendButton || this.props.errors.length!=0}
                    >
                        Send
                    </Button>
                    <Button
                        onClick={this.props.closeTechSupport}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.openGuideSuggestionWindow.bind(this)}
                        color="primary"
                    >
                        CAD Guide
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
const mapStateToProps = state => {
    return {
        openTechSupport: state.techSupportReducer.openTechSupport,
        openFeedback: state.feedbackReducer.openFeedback,
        category:state.feedbackReducer.category,
        email:state.feedbackReducer.email,
        message:state.feedbackReducer.message,
        addDrawing:state.feedbackReducer.addDrawing,
        blockSendButton:state.feedbackReducer.blockSendButton,
        errors:state.feedbackReducer.errors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeTechSupport: () => {
            dispatch({ type: "CLOSE_TECH_SUPPORT"});
            dispatch({ type: "CLOSE_FEEDBACK"});
        },
        changeCategory: value=>{dispatch({type:"CHANGE_FEEDBACK_CATEGORY", category:value})},
        changeEmail: value=>{dispatch({type:"CHANGE_FEEDBACK_EMAIL", email:value})},
        changeMessage: value=>{dispatch({type:"CHANGE_FEEDBACK_MESSAGE", message:value})},
        changeAddDrawing: value=>{dispatch({type:"CHANGE_FEEDBACK_ADD_DRAWING", addDrawing:value})},
        send: ()=> {dispatch({type:"SEND_FEEDBACK"})}
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TechSupport);