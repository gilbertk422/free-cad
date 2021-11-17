/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./order-options.scss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
// import { connect } from "react-redux";

export default class OrderOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "Standard Order",
      originalOrder:'',
      isChecked: false
    };
  }
  componentWillMount(){
    const Order = localStorage.getItem('order');
    if(Order===null){
    this.setState({order:this.state.order})
    } else{
      this.setState({order:Order})
    }
    const OriginalOrder = localStorage.getItem('originalOrder');
    if(OriginalOrder===null){
    this.setState({originalOrder:this.state.originalOrder})
    } else{
      this.setState({originalOrder:OriginalOrder})
    }
  }
  handleRadioChange = event => {
    event.preventDefault();

    this.setState({ order: event.target.value },
      ()=>{
    localStorage.setItem('order', this.state.order);

    // console.log(this.state.order, "this.state.value");

      });
  };

  handleOriginalOrderChange = (e) =>{
    this.setState({originalOrder: e.target.value},()=>{
    localStorage.setItem('originalOrder', '#'+this.state.originalOrder);

    });
  }
  handleChecked = event => {
    window.setTimeout(() => {
      this.setState({
        isChecked: !this.state.isChecked
      });
    }, 0);
  };
  render() {
    return (
      <div className="OrderOptions">
        <form>
          <div className="RadioButton">
            <FormControl /*component="fieldset" */>
              <RadioGroup
                // aria-label="Order"

                value={this.state.order}
                onChange={this.handleRadioChange}
                // onChange={(e)=>{
                //   this.props.updateOrder(e.target.value)
                // }}
              >
                <FormControlLabel
                  value="Standard Order"
                  control={
                    <Radio
                      color="primary"
                      // color="default"
                      classes={{ root: "root" }}
                    />
                  }
                  label="Standard Order"
                />
                <FormControlLabel
                  value="Change order"
                  control={
                    <Radio
                      classes={{ root: "root" }}
                      color="primary"
                      // color="default"
                    />
                  }
                  label="Change order in progress"
                />
                <FormControlLabel
                  value=" "
                  control={
                    <Radio
                      color="primary"
                      //  color="default"
                    />
                  }
                  label="Resubmit payment information"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {/* {this.state.value === "order1" && (
            <div className="Text">
              <p style={{textAlign:'left'}}>
                Use this option normally
                <br />
                To process the above selection click OK and then do Order |
                Place Order
              </p>
              <div className="InputOrder">
                Machine IDs #: <input type="text" /> (separated by commas)
                <br />
              </div>
            </div>
          )} */}

          {this.state.order === "Change order" && (
            <div className="Text">
              <p style={{textAlign:'left'}}>
                Use this option to make a change to in order in progress. (Do not
                use this mode if you received parts already and are changing your
                disign.) The minimum cost is 25$.The maximum can be substantial
                if the job has progressed.Your approval of the cost will be
                requested if above the minimum. The charge will be determined
                manually by eMachineShop staff.
                <br />
                Changing your order will delay your job. If your request a change
                and don't approve the cost a 25$ administrative fee will be
                charged.After placing order, a new order number will be assigned
                as a replacement for the old order number.The new number will be
                emailed to you.
                <br />
                To process the above selection click OK and then do Order |
                Place Order
              </p>
              {/* <div className="InputOrder">
                Machine IDs: <input type="text" /> (separated by commas)
                <br />
              </div>
              <p style={{textAlign:'left'}}>
                Thees numbers can be found in your prior order confirmation
                email.
              </p> */}
              <div className="InputOrder">
                Original order #: <input type="text" 
                   value={this.state.originalOrder}
                   onChange={this.handleOriginalOrderChange}
                />
                <br />
              </div>
              <div className="Textarea">
                <p style={{textAlign:'left'}}> Summary of changes:</p>
                <textarea rows="10" cols="88" />
              </div>
            </div>
          )}

          {this.state.order === " " && (
            <div className="Text">
              <p style={{textAlign:'left'}}>
                Use this option if the eMachineShop staff advises you to make a
                change that corrects payment information. There is no
                administrative charge for resubmitting an order in this way.
                <br />
                Note: Any disign changes may be ignored.
                <br />
                To process the above selection click OK and then do Order |
                Place Order
              </p>
              <div className="InputOrder">
                Original order #: <input type="text"
                  value={this.state.originalOrder}
                  onChange={this.handleOriginalOrderChange}
                />
                <br />
              </div>
            </div>
          )}

          {/* <fieldset className="Fieldset">
            <legend>Wrap parts individually (extra cost):</legend>
            <div style={{ padding: "10px" }}>
              <label>
                <Checkbox
                  checked={this.state.isChecked}
                  onChange={this.handleChecked}
                  color="primary"
                />
                Recommended for decorative parts
              </label>
            </div>
        
          </fieldset> */}
          {/* <fieldset className="Fieldset">
            <legend>Reuse tooling</legend>
            <label>
              Reuse from job # <input type="text" /> Tooling is kept for 1 year
              (renewed on reordering)
            </label>
            <br />
            <p style={{textAlign:'left'}}>
              (Use this only if the prior job shows "Hard Tooling - Yes" in the
              order confirmation e-mail and no disign changes were made)
            </p>
          </fieldset> */}
        </form>
      </div>
    );
  }
}
// const mapStateToProps = state => {
//   return {
//     // firstName: state.summaryReducer.firstName,
//     // lastName: state.summaryReducer.lastName
//     order:state.summaryReducer.order

//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     updateOrder: value => {
//       dispatch({ type: "ORDER", payload: value });
//     }
//   };
// };
// export default connect(mapStateToProps,mapDispatchToProps)(OrderOptions);