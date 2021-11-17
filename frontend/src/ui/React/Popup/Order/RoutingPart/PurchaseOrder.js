/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./routing-part.scss";

export default class PurchaseOrder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="PurchaseOrder">
        <p className="Text">If your organization requires a purchasing agent to approve an
        order,use this mode to upload your design to eMachineShop in preparation
        for a purchasing agent in your company, at their discretion, to approve
        and complete the order. Placing an order this way will not commit your
        company in any way and will become an order only upon approval of your
        purchasing agent.</p> 
        <p className="Text" >To proceed, use menu Order | Place Order and email
        your purchasing agent as in this example: </p>
        <p className="Text"> Subject:<br/>
          Request for Purchase Completion </p>
        <p className="Text">Message: <br/>
        I have upload mechanical drawing
        #_____ to eMachineShop.com to manufacture, upon your approval, 25 custom
        brackets at a total cost of $123,45. Please finalize the order by
        calling them at 201-962-7511 with credit card payment details and
        shipping address.Thank you.</p>
      </div>
    );
  }
}
