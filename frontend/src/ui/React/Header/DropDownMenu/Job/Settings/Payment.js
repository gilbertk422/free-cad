/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import "./payment.scss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "payment1",
      isChecked: false,
      isCheckedTaxExempt: false,
      isCheckedPayment2: false
    };
  }

  handleRadioChange = event => {
    // event.preventDefault();

    this.setState({ value: event.target.value });
    console.log(this.state.value, "this.state.value");
  };

  handleChangeTaxExempt = event => {
    window.setTimeout(() => {
      this.setState({ isCheckedTaxExempt: !this.state.isCheckedTaxExempt });
    }, 0);
  };
  handleChange = event => {
    window.setTimeout(() => {
      this.setState({
        isChecked: !this.state.isChecked
      });
    }, 0);
  };
  handleChangePayment2 = event => {
    window.setTimeout(() => {
      this.setState({ isCheckedPayment2: !this.state.isCheckedPayment2 });
    }, 0);
  };
  render() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const years = [
      2018,
      2019,
      2020,
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
      2028,
      2029,
      2030
    ];
    return (
      <div className="Payment">
          Doesn't work
          <form>
              <input  id="card_number" type="tel" name="card_number"
                      autoCorrect="off" spellCheck="off" autoCapitalize="off"
                     placeholder="Card number" data-reactid=".0.1.1.0.0.5.0.0"
                     x-autocompletetype="cc-number" autocompletetype="cc-number"/>
                  <input name="cc-exp"/>
                      <input name="cc-exp-month"/>
                          <input name="cc-exp-year"/>
          </form>

          Works
          <form>
              <input id="card_number" type="tel" name="card_number"
                     autoCorrect="off" spellCheck="off" autoCapitalize="off"
                     placeholder="Card number" data-reactid=".0.1.1.0.0.5.0.0"
                     x-autocompletetype="cc-number" autocompletetype="cc-number"/>
                  <input name="cc-exp-month"/>
                      <input name="cc-exp-year"/>
                          <input name="cc-exp"/>
          </form>

        <form>
          <div className="RadioButton">
            <FormControl /*component="fieldset" */>
              <RadioGroup
                // aria-label="Order"

                value={this.state.value}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="payment1"
                  control={
                    <Radio
                      color="primary"
                      // color="default"
                    />
                  }
                  label="Credit Card"
                />
                <FormControlLabel
                  value="payment2"
                  control={
                    <Radio
                      color="primary"
                      // color="default"
                    />
                  }
                  label="Prepay by check"
                />
                <FormControlLabel
                  value="payment3"
                  control={
                    <Radio
                      color="primary"
                      //  color="default"
                    />
                  }
                  label="Engineering Upload"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {this.state.value === "payment1" && (
            <div>
              <fieldset className="Fieldset">
                <legend>Credit Card</legend>
                <div className="InputLabel-Block InputBlock-Hide">
                  <div className="Label">
                    <div> Holder name:</div>
                    <div> Number: </div>
                    <div>CW:</div>
                  </div>
                  <div className="InputGroup">
                    <div className="Input">
                      <input type="text" />
                    </div>
                    <div className="Input">
                      <input type="text" />
                    </div>
                    <div className="Input ">
                      <input className="Select" type="text" />
                    </div>
                  </div>
                </div>
                <p style={{textAlign:'left'}}>Expiration date:</p>
                <div className="InputLabel-Block InputBlock-Hide">
                  <div className="Label">
                    <div> Month:</div>
                    <div> Year: </div>
                  </div>
                  <div className="InputGroup">
                    <div className="Input">
                      <select className="Select">
                        {months.map((item, i) => (
                          <option value={item} key={i}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="Input">
                      <select className="Select">
                        {years.map((item, i) => (
                          <option value={item} key={i}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "10px" }}>
                  <label>
                    <Checkbox
                      onChange={this.handleChange}
                      checked={this.state.isChecked}
                      color="primary"
                    />
           
                    Remember my credit card information
                  </label>
                </div>
                {/* <p style={{textAlign:'left'}}>
                  Note: Your payment information will be transmitted safely to
                  eMachineShop using advanced encryption technology.
                </p>{" "} */}
              </fieldset>
              <fieldset>
                <legend>Tax exempt</legend>
                <div
                >
                  <label>
                    <Checkbox
                      onChange={this.handleChangeTaxExempt}
                      checked={this.state.isCheckedTaxExempt}
                      color="primary"
                    />
                    NJ customer exempt from sales tax
                  </label>
                </div>
                <p style={{textAlign:'left'}}>
                  Please email your ST-3 form via the web site customer service
                  page.
                  <br />
                  Sales tax will be charged if form not received.
                </p>{" "}
              </fieldset>
            </div>
          )}
          {this.state.value === "payment2" && (
            <div>
              <fieldset className="Fieldset">
                <div className="Input">
                  <label>
                    Check number: <input type="text" />
                  </label>
                </div>
                <p style={{textAlign:'left'}}>
                  So that order processing can begin please mail your check
                  promptly.
                  <br />
                  Mail to:
                  <br />
                  eMachineShop
                  <br />
                  Unit 6, 31 Industrial Ave.
                  <br />
                  Mahwah, NJ 07430
                  <br />
                  U.S.A.
                  <br />
                  <br />
                  <br />
                  Note:
                  <br />
                  If you are paying by company check and can't obtain a check
                  number in advance, enter '11111111'
                </p>
              </fieldset>
              <fieldset>
                <legend>Tax exempt</legend>
                <div
                >
                  <label>
                    <Checkbox
                      onChange={this.handleChangePayment2}
                      checked={this.state.isCheckedPayment2}
                      color="primary"
                    />
                    NJ customer exempt from sales tax
                  </label>
                </div>
                <p style={{textAlign:'left'}}>
                  Please email your ST-3 from via the web site customer service
                  page.
                  <br />
                  Sales tax will be charged if from not received.
                </p>{" "}
              </fieldset>
            </div>
          )}
          {this.state.value === "payment3" && (
            // <fieldset className="Fieldset">
            <div className="Payment3">
              <p style={{textAlign:'left'}}>
                If your organization requires a purchasing agent to approve an
                order,use this mode to upload your design to eMachineShop in
                preparation for a purchasing agent in your company, at their
                discretion, to approve and complete the order. Placing an order
                this way will not commit your company in any way and will become
                an order only upon approval of your purchasing agent.
                <br />
                <br />
                To proceed, use menu Order | Place Order and email your
                purchasing agent as in this example:
                <br />
                <br />
                Subject:
                <br />
                Request for Purchase Completion<br/>
                <br/>
                Message:<br/>
                I have upload mechanical drawing #_____ to eMachineShop.com to manufacture, upon your approval, 25 custom brackets 
                at a total cost of $123,45. Please finalize the order by calling them at 201-962-7511 with credit card payment details and 
                shipping address.Thank you.
              </p>
            </div>
            // </fieldset>
          )}
        </form>
      </div>
    );
  }
}
