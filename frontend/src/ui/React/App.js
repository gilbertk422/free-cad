/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./index.scss";
import BoardToolButtons from "./BoardToolButtons/desktop/LeftMenu";
import BottomPanel from "./BottomPanel/BottomPanel";
import {
    HashRouter as Router, withRouter,
} from "react-router-dom";
import { createStore } from "redux";
import {connect, Provider} from "react-redux";
import rootReducer from "./../Redux/rootReducer";
import Header from "./Header/Header";
import Popup from "./Popup/Popup";
import ReactTooltip from "react-tooltip";
import BoardToolButtonsMob from './BoardToolButtons/mobile/RadialToolButtons'
import PropertyBarMob from "./PropertyBar/mobile/index";
import Div100vh from 'react-div-100vh';

let store = null;

if(ENV =='development'){
    store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}else{
    store = createStore(rootReducer);
}


window.store = store;



export default class App extends React.Component{
    constructor(props){
        super(props);

        this.canvasContainer=null

        this.state = {
            desktop:container.resolve('mobileDetector').mobile()==null
        }
    }

    componentDidMount(){
        /** @type {Board} */
        let board = container.resolve('mainBoard');
        board.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
        Helper.Window.addHandler('resize', ()=>{
            board.setSize(0,0);
            board.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);

        });
        this.canvasContainer.appendChild(board.canvas);

        document.getElementById('startLoader').remove();
    }

    render(){
        return (
            <Div100vh className="appContainer">
                {/* <div className="appContainer"> */}
                    <Provider store={store}>
                        {this.state.desktop && <ReactTooltip delayShow={1000} html={true} className="tooltipBackgroundTheme" />}
                        <Router>
                            <Header />
                        </Router>
                        <section>
                            {this.state.desktop && <BoardToolButtons />}
                            <div className="mainCanvas" ref={(node)=>{this.canvasContainer=node}}></div>
                            {!this.state.desktop && <BoardToolButtonsMob />}
                            {!this.state.desktop && <PropertyBarMob/>}
                        </section>
                        {this.state.desktop && <BottomPanel />}
                        <Router>
                            <Popup />
                        </Router>
                    </Provider>
                {/* </div> */}
            </Div100vh>
        );
    }
}