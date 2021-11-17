/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./settings.scss";
import Address from "./Address";
// import Payment from "./Payment";
// import OrderOptions from "./OrderOptions";
import Summary from "./Summary";
// import BendSpecification from "./BendSpecification";
import { Route, Redirect, Switch, Link, NavLink } from "react-router-dom";

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        // this.state={
            // bendSpecification:false
        // };
    }

    // componentWillMount() {
    //     let elements = app.currentDocument.getListSimpleElements();
    //
    //     let bendSpecification=false;
    //     for(let el of elements){
    //         bendSpecification |= el.lineType.name=="Bend";
    //     }
    //
    //     this.setState({bendSpecification:bendSpecification});
    // }


    componentDidMount() {
      // console.log(this.props, 'this.props-New')
      // this.props.history.push("/settings/address");

      this.props.history.replace("/settings/address");
    }
    componentWillUnmount() {
      // console.log(this.props, 'this.props-New')
      this.props.history.push("/");
    }

    openLinkSpecifications = () => {
      window.open(
        "https://www.emachineshop.com/standard-specs-and-tolerances/",
        "_blank"
      );
    };

    render() {
      return (
        <div className="Settings">
          <div className="Menu">
            <ul>
                {/*{!!this.state.bendSpecification && (*/}
                    {/*<li>*/}
                        {/*<NavLink*/}
                            {/*className="settingTab"*/}
                            {/*exact*/}
                            {/*activeStyle={{ color: "blue" }}*/}
                            {/*to="/settings/specifications-bend"*/}
                            {/*// replace*/}
                        {/*>*/}
                            {/*Specifications: Bend*/}
                        {/*</NavLink>*/}
                    {/*</li>*/}
                {/*)}*/}
              <li>
                <NavLink
                  className="settingTab"
                  exact
                  activeStyle={{ color: "blue" }}
                  to="/settings/address"
                  // replace
                >
                  Address
                </NavLink>
              </li>
              {/*<li>*/}
                {/*<NavLink*/}
                  {/*className="Payment"*/}
                  {/*activeStyle={{ color: "blue" }}*/}
                  {/*to="/settings/payment"*/}
                {/*>*/}
                  {/*Payment*/}
                {/*</NavLink>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<NavLink*/}
                  {/*className="OrderOption"*/}
                  {/*activeStyle={{ color: "blue" }}*/}
                  {/*to="/settings/order-options"*/}
                {/*>*/}
                  {/*Order Options*/}
                {/*</NavLink>*/}
              {/*</li>*/}
              <li>
                <NavLink
                  className="settingTab"
                  activeStyle={{ color: "blue" }}
                  to="/settings/summary"
                >
                  Summary
                </NavLink>
              </li>
              <li>
                  <a
                    target="_blank"
                    className="settingTab"
                    href="https://www.emachineshop.com/standard-specs-and-tolerances/"
                    onClick={this.openLinkSpecifications}
                  >
                    Specifications
                  </a>
              </li>
            </ul>
          </div>
          <div className="Content">
            <Switch>
              <Route path="/settings/address" exact component={Address} />
              {/*<Route path="/settings/specifications-bend" exact component={BendSpecification} />*/}
              {/*<Route path="/settings/payment" component={Payment} />*/}
              {/*<Route path="/settings/order-options" component={OrderOptions} />*/}
              <Route path="/settings/summary" component={Summary} />
            </Switch>
          </div>
        </div>
      );
    }
}
