/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./material.scss";
import Finish from "../../../../../model/Finish";


let finishes = Finish.listOfFinishes();

export default class SelectFinish extends React.Component {
    constructor(props, context) {
        super(props, context);

        let finish = container.resolve('config').finishes;
        if(!finish){
            finish = new Finish();
            finish.name="Select Finish";
            finish.type="Select Finish";
        }
        this.state = {
            displayMenu: false,
            finishing: finish,
            desktop: container.resolve('mobileDetector').mobile() == null
        };

        container.resolve('config').addHandler('change', (fieldName)=>{
            if(fieldName=='finishes'){
                this.setState({finishing:container.resolve('config').finishes});
            }
        });
    }

    showDropdownMenu = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener("click", this.hideDropdownMenu);
        });
    };

    hideDropdownMenu = () => {
        event.stopPropagation();
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener("click", this.hideDropdownMenu);
        });
    };


    changeFinishMethod(finish){
        // if(finish && !this.isCompatible(finish)){
        //     return;
        // }
        container.resolve('config').finishes = finish;
        if(!finish){
            let f = new Finish();
            f.name="None";
            f.type="Select Finish";
            this.setState({ finishing: f});
        }else{
            this.setState({ finishing: finish});
        }
    }

    openWindow(){
        window.open("https://www.emachineshop.com/secondary-finishes/");
    }


    formatFinishName(finish){
        let res = finish.type;
        if(finish.specialColor!=null) {
            res += " "+finish.specialColor.name;
        }else{
            if(finish.name!='None') {
                res += " "+finish.name;
            }
        }
        if(finish.showName){
            res = finish.showName;
        }

        if(res == "Select Finish Select Finish"){
            res = "Select Finish";
        }

        return res;
    }

    isCompatible(finish){
        let material = container.resolve('config').material;
        if(!material){
            return true;
        }
        return finish.isCompatible(material);
    }

    render() {
        if (this.state.desktop) {
            return this.desktopView();
        } else {
            return this.mobileView();
        }
    }

    mobileView() {
        return (
            <li className="metismenu-item" onClick={this.showDropdownMenu}>
                <a className="metismenu-link metismenu-hasborder" href="#">{this.formatFinishName(this.state.finishing)}</a>
                <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
                    {finishes.map((finish, index) =>(
                        <li value={finish.name} onClick={()=>this.changeFinishMethod(finish)} key={index} className={this.isCompatible(finish) ? "metismenu-item" : "metismenu-item disableItem"}>
                            <a className="metismenu-link" href="#">{this.formatFinishName(finish)}</a>
                        </li>
                    ))}
                    <li className="metismenu-item" onClick={()=>this.changeFinishMethod(null)}>
                        <a className="metismenu-link" href="#">None</a>
                    </li>
                    <li className="metismenu-item" onClick={this.openWindow.bind(this)}>
                        <a className="metismenu-link" target="_blank" rel="noreferrer noopener">Help</a>
                    </li>
                </ul>
            </li>
        )
    }

    desktopView() {
        return (
        <div className="Material">
            <button className="btn-Material" onClick={this.showDropdownMenu} tabIndex={-1}>
            {this.formatFinishName(this.state.finishing)}
            </button>

            {this.state.displayMenu ? (
            <ul className="ul-Material">
                {finishes.map((finish, index) =>(
                    <li value={finish.name}
                        onClick={()=>this.changeFinishMethod(finish)} key={index}
                        // className={this.isCompatible(finish)?"":"disableItem"}
                    >
                        <a>{this.formatFinishName(finish)}</a>
                    </li>
                ))}
                <li onClick={()=>this.changeFinishMethod(null)}>
                <a href="#">None</a>
                </li>
                <li onClick={this.openWindow.bind(this)}>
                <a
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Help
                </a>
                </li>
            </ul>
            ) : null}
        </div>
        );
    }
}