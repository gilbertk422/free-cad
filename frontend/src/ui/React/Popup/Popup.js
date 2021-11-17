/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import Confirmation from "./Confirmation/Confirmation";
import NonWorkFeature from "./NonWorkFeature";
import ExpertNotice from "./ExpertNotice";
import FileNameModal from "../modal/FileName/FileName";
import PreferencesWidow from "./Preferences/PreferencesWindow";
import Price from "./Price/Price";
import Order from "./Order/Order";
import SummaryWindow from "./SummaryWindow";
import CornerWidow from "./Corner/CornerWindow";
import TechSupport from "./TechSupport/TechSupport";
import Divide from "./Divide/Divide";
import ZipCode from './ZipCode/ZipCode'
import Simplify from "./Simplify/Simplify";



export default class Popup extends React.Component{


    render(){
        return (
            <React.Fragment>
                <FileNameModal />
                <PreferencesWidow/>
                <Confirmation />
                <NonWorkFeature/>
                <ExpertNotice/>
                <SummaryWindow/>
                <Price history={this.props.history}/>
                <Order history={this.props.history}/>
                <PreferencesWidow/>
                <CornerWidow/>
                <TechSupport/>
                <Divide/>
                <Simplify/>
                <ZipCode/>
            </React.Fragment>
        );
    }
}