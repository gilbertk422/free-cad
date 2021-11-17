/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./routing-part.scss";
import CreditCard from "./CreditCard";
import PrepayByCheck from "./PrepayByCheck";
import PurchaseOrder from "./PurchaseOrder";
import {
    Route,
    Switch,
    NavLink,
    Link, withRouter
} from "react-router-dom";
import Order from "../../../../../model/order/Order";
import {connect} from "react-redux";


class RoutingPart extends React.Component {

    componentDidMount() {
        this.props.changePaymentType(Order.PAYMENT_TYPE_CREDIT_CARD);
        this.props.history.push('/order/credit-card');
    }

    componentWillUnmount() {
        this.props.history.push('/')
    }

    render(){
       return (
           <div className="RoutingPart" >
               <div className="Menu">
                   <ul>
                       <li>
                           <NavLink
                             className="CreditCard"
                             activeStyle={{ color: "blue" }}
                             to="/order/credit-card"
                             onClick={()=>this.props.changePaymentType(Order.PAYMENT_TYPE_CREDIT_CARD)}
                           >
                             Credit Card
                           </NavLink>
                       </li>
                       <li>
                           <NavLink
                             className="PrepayByCheck"
                             activeStyle={{ color: "blue" }}
                             to="/order/prepay-by-check"
                             onClick={()=>this.props.changePaymentType(Order.PAYMENT_TYPE_CHECK)}
                           >
                             Prepay by check
                           </NavLink>
                       </li>
                       <li>
                           <NavLink
                             className="PurchaseOrder"
                             exact
                             activeStyle={{ color: "blue" }}
                             to="/order/purchase-order"
                             onClick={()=>this.props.changePaymentType(Order.PAYMENT_TYPE_PURCHASE)}
                             // replace
                           >
                            Purchase Order
                           </NavLink>
                       </li>
                   </ul>
               </div>
               <div className="Content">
                   <Switch>
                       <Route path="/order/credit-card" component={CreditCard}/>
                       <Route path="/order/prepay-by-check" component={PrepayByCheck}/>
                       <Route path="/order/purchase-order" exact component={PurchaseOrder} />
                   </Switch>
               </div>
           </div>
       );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changePaymentType: (type)=>{
            dispatch({type:"CHANGE_ORDER_PAYMENT_TYPE", paymentType:type});
        }
    };
};
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(RoutingPart)
);

