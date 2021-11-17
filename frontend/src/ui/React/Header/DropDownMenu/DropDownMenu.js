/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./dropdown-menu.scss";
import File from "./File/File";
import Edit from "./Edit/Edit";

import Line from "./Line/Line";
import Job from "./Job/Job";
import Help from "./Help/Help";
import View from './View/View'

export default class DropDownMenu extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            mobile:container.resolve('mobileDetector').mobile()!=null
        }

    }
    render(){
        if(!this.state.mobile){
            return this.desktopView();
        }else{
            return this.mobileView();
        }

    }

    mobileView(){
        console.log("sdfsdf");
        return (
            <div className="DropDownMenu">
                <File history={this.props.history}/>
                <Edit />
                <Line/>
                <View />
                <Job history={this.props.history}/>
                <Help />
            </div>
        );
    }

    desktopView(){
        return (
            <div className="DropDownMenu">
                <div>
                    <File history={this.props.history}/>
                    <Edit />
                    <Line/>
                    <Job history={this.props.history}/>
                    <Help />
                </div>
                <div className="logoBlock">
                    <img src="resources/images/logo-white.png" alt="logo"/>
                </div>
            </div>
        );
    }

}
