/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./filename.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";

class FileName extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            name:name
        }
    }

    componentWillReceiveProps(nextProps){
        let name = app.currentDocument.fileName;
        if(app.currentDocument.fileName==""){
            name = localStorage.getItem('lastFileName');
            if(!name){
                name= "";
            }
        }

        this.setState({
            name:name
        });
    }

    changeName(e){
        localStorage.setItem('lastFileName', e.target.value);
        this.setState({name:e.target.value});
    }

    render() {
        return (
            <Dialog
                maxWidth={false}
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                id='file-name-modal'
                onBackdropClick={() => {
                    this.props.openConfirmModal(!this.props.open);
                    this.props.cancelCallback();
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Save as</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="Content">
                        <div className="Text">
                            <input type="text"
                                   value={this.state.name}
                                onChange={this.changeName.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="Yes-No-buttons">
                        <Button
                            onClick={() => {
                                this.props.openConfirmModal(!this.props.open);
                                this.props.okCallback(this.state.name);
                            }}
                            style={{
                                backgroundColor: "#dddada",
                                boxShadow: "2px 2px 1px #000",
                                margin: "0 auto",
                                marginRight: "5px"
                            }}
                            color="primary"
                        >
                            Ок
                        </Button>
                        <Button
                            onClick={() => {
                                this.props.openConfirmModal(!this.props.open);
                                this.props.cancelCallback();
                            }}
                            style={{
                                backgroundColor: "#dddada",
                                boxShadow: "2px 2px 1px #000",
                                margin: "0 auto"
                            }}
                            color="primary"
                            //   autoFocus
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        open: state.fileNameModalReducer.open,
        okCallback: state.fileNameModalReducer.okCallback,
        cancelCallback: state.fileNameModalReducer.cancelCallback,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openConfirmModal: openConfirm => {
            dispatch({ type: "OPEN_FILE_NAME_MODAL", open: openConfirm });
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(FileName);
