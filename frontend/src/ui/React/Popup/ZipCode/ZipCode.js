/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./zipCode.scss";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";
import Address from '../../../../model/order/Address'

class ZipCode extends React.Component {

    changeCountry(e){
        let value = e.target.value;
        this.props.changeCountry(value);
    }

    changeZipCode(e){
        let value = e.target.value;
        this.props.changeZipCode(value);
    }

    handleCloseModal(e){
        this.props.openModal(!this.props.open);
        this.props.cancelCallback();
    }

    canDone(){
        return this.props.zipCode.length>0 && this.props.country.length>0 && Helper.Validator.validatePostIndex(this.props.country, this.props.zipCode);
    }

    done(){
        if(this.canDone()) {
            this.props.openModal(!this.props.open);
            this.props.okCallback(this.props.count);
        }
    }
    render() {
        return (
            <Dialog
                onBackdropClick={this.handleCloseModal.bind(this)}
                maxWidth={false}
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                id='zip-code-modal'
            >
                <DialogTitle id="alert-dialog-title">
                    <div style={{display:'flex',justifyContent:"space-between"}}>
                        <span>Zip Code</span>
                        <Button
                            onClick={this.handleCloseModal.bind(this)}
                            style={{
                                backgroundColor: "#fff",
                                padding:'0px',

                            }}
                            color="primary"
                        >
                            <i className="material-icons">
                                cancel_presentation
                            </i>
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="message">
                        <div>
                            <svg className="icon"><use xlinkHref="icons.svg#UPS_logo"></use></svg>
                        </div>
                        <div>
                            <p>To Calculate Your Shipping Cost</p>
                            <p>We'll Just Need Your:</p>
                        </div>
                        <div></div>
                    </div>
                        <div className="input-field">
                            <label>Country:</label>
                            <div>
                                <select
                                    value={this.props.country}
                                    onChange={this.changeCountry.bind(this)}
                                >
                                    <option value="" key="-1"></option>
                                    {Address.countries.map((item, i) => (
                                        <option value={item} key={i}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <div className="input-field">
                            <label>Zip Code:</label>
                            <div>
                                <input type="text"
                                       value={this.props.zipCode}
                                       onChange={this.changeZipCode.bind(this)}
                                />
                            </div>
                        </div>
                    <div className="Yes-No-buttons">
                        <Button
                            disabled={!this.canDone()}
                            onClick={this.done.bind(this)}
                            style={{
                                backgroundColor: "#dddada",
                                boxShadow: "2px 2px 1px #000",
                                margin: "0 auto",
                                marginRight: "5px"
                            }}
                            color="primary"
                        >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        open: state.zipCodeWindowReducer.openModal,
        okCallback: state.zipCodeWindowReducer.okCallback,
        cancelCallback: state.zipCodeWindowReducer.cancelCallback,
        country: state.zipCodeWindowReducer.country,
        zipCode: state.zipCodeWindowReducer.zipCode,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openModal: open => {
            dispatch({ type: "OPEN_ZIP_CODE_MODAL", payload: open });
        },
        changeCountry: country =>{
            dispatch({ type: "ZIP_CHANGE_COUNTRY", payload: country });
        },
        changeZipCode: zipCode =>{
            dispatch({ type: "ZIP_CHANGE_CODE", payload: zipCode });
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ZipCode);
