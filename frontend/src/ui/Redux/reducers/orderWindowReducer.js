/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Order from "../../../model/order/Order";
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
} from './CreditCard/utils';
import CreditCard from "../../../model/order/CreditCard";
import Address from "../../../model/order/Address";
import User from "../../../model/order/User";


const initialState = {
    openOrder: false,
    price: null,
    quantity: 0,
    ship: null,
    paymentType: Order.PAYMENT_TYPE_CREDIT_CARD,

    creditCard: {
        number: "",
        name: "",
        expiry: "/",
        cv: ""
    },
    checkNumber: "",
    checkIsAvailable: true,

    shippingAddress: {
        firstName: "",
        lastName: "",
        street: "",
        region: "",
        city: "",
        zip: "",
        country: "",
        businessName: "",
        phone: "",
        email: "",
    },
    hasBillingAddress: false,

    billingAddress: {
        firstName: "",
        lastName: "",
        street: "",
        region: "",
        city: "",
        zip: "",
        country: "",
        businessName: "",
        phone: "",
        email: "",
    },

    allowPublicationOfPartImages: false,
    functionOfPart: "",
    agree: false,


    needValidate: false,
    blockSendButton: false,

    errors: []
};

export default function orderWindowReducer(state = initialState, action) {
    let res = state;
    switch (action.type) {
        case "OPEN_ORDER":
            res = {
                ...initialState,
                openOrder: true,
                price: action.price,
                quantity: action.quantity,
                ship: action.ship
            };
            initState(res);
            break;
        case "CLOSE_ORDER":
            res = {...state, openOrder: false};
            break;
        case "CHANGE_ORDER_CHECK_NUMBER":
            res = {...state, checkNumber: action.checkNumber};
            break;
        case "CHANGE_ORDER_CHECK_AVAILABLE":
            res = {...state, checkIsAvailable: action.available, checkNumber: ""};
            break;
        case "CHANGE_ORDER_CC":
            let cc = {...state.creditCard};
            cc[action.fieldName] = changeCreditCardField(action.fieldName, action.value);
            res = {...state, creditCard: cc};
            break;
        case "CHANGE_ORDER_HAS_BILLING_ADDRESS":
            res = {...state, hasBillingAddress: action.value};
            break;
        case "CHANGE_ORDER_AGREE":
            res = {...state, agree: action.agree};
            break;
        case "CHANGE_ORDER_PAYMENT_TYPE":
            res = {
                ...state,
                paymentType: action.paymentType,
                creditCard: {
                    number: "",
                    name: "",
                    expiry: "/",
                    cv: ""
                },
                checkNumber: ""
            };
            break;
        case "CHANGE_ORDER_SHIPPING_ADDRESS":
            let address = {...state.shippingAddress};
            address[action.fieldName] = action.value;
            res = {...state, shippingAddress: address};
            break;
        case "CHANGE_ORDER_BILLING_ADDRESS":
            let address2 = {...state.billingAddress};
            address2[action.fieldName] = action.value;
            res = {...state, billingAddress: address2};
            break;
        case "CHANGE_ORDER_LOCK_BUTTON":
            res = {...state, blockSendButton: action.value};
            break;
        case "CHANGE_ORDER_FUNCTION_OF_PART":
            res = {...state, functionOfPart: action.functionOfPart};
            break;
        case "CHANGE_ORDER_ALLOW_PUBLISH":
            res = {...state, allowPublicationOfPartImages: action.allow};
            break;


    }
    if (res.needValidate || action.type == "ORDER_SUBMIT") {
        let order = createOrder(res);
        let valid = order.validate();
        if (!valid) {
            res.errors = [];

            if (action.type == "ORDER_SUBMIT") {
                sendOrder(order);
                res.blockSendButton = true;
            } else {
                res.blockSendButton = false;
            }

        } else {
            res.errors = valid;
            res.blockSendButton = true;
        }
        res.needValidate = true;
    }

    return res;
}


function createOrder(state) {
    let order = new Order();
    order.shippingRequisites = createUser(state.shippingAddress);
    if (state.hasBillingAddress) {
        order.billingRequisites = createUser(state.billingAddress);
    }
    order.quantity = state.quantity;
    order.finish = container.resolve('config').finishes;
    order.material = container.resolve('config').material;
    order.creditCard = createCreditCard(state.creditCard);
    order.shipping = state.ship;
    order.functionOfPart = state.functionOfPart;
    order.totalCost = state.price.MfgPrice + state.ship.price;
    order.businessDays = state.price.est;
    order.document = app.currentDocument.getSnapshot();
    order.checkOrPONo = state.checkNumber;
    order.pymentType = state.paymentType;
    order.agreePrivate = state.agree;
    order.checkAvailable = state.checkIsAvailable;

    return order;
}

function createCreditCard(state) {
    let creditCard = new CreditCard();
    creditCard.number = state.number;
    creditCard.ownername = state.name;
    let exp = state.expiry.split('/');
    if (exp.length == 2) {
        creditCard.month = exp[0];
        creditCard.year = "20" + exp[1];
    }
    creditCard.CCV = state.cv;
    return creditCard;
}

function createUser(state) {
    let user = new User();
    user.address = createAddress(state);
    user.firstName = state.firstName;
    user.lastName = state.lastName;
    user.businessName = state.businessName;
    user.phone = state.phone;
    user.email = state.email;
    return user;
}

function createAddress(state) {
    let address = new Address();
    address.country = state.country;
    address.state = state.region;
    address.city = state.city;
    address.zipCode = state.zip;
    address.street = state.street;
    return address;
}

/**
 *
 * @param {Order} order
 */
function sendOrder(order) {
    setTimeout(() => {
        if (Helper.Validator.validateStreet(order.shippingRequisites.address.street)) {
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Cannot ship to post office box - please provide street address.");
        }

        order.send().then(res => {
            let material = order.material.name.toUpperCase().replace(/ /g, '');
            let total = order.totalCost;
            let date = Math.floor((new Date().getTime() - new Date(1899, 11, 30).getTime()) / 8.64e4);
            window.open("https://www.emachineshop.com/order-success-cad/?order=EMS-WEB-CAD|AUTO|" + material + "|" + total + "|" + date, "_blank");
            if (res) {
                if (res == 'true') {
                    container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Thank you for your order! You will receive an order confirmation email once your order has been processed.");
                    store.dispatch({type: "CLOSE_ORDER"});
                } else if (res instanceof Array) {
                    console.log("errors", res);
                }
            } else {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Error that order wasn't sent. Please try later.");
                store.dispatch({type: "CHANGE_ORDER_LOCK_BUTTON", value: false});
            }
        }).catch(error => {
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Error that order wasn't sent. Please try later.");
            store.dispatch({type: "CHANGE_ORDER_LOCK_BUTTON", value: false});
            throw new Exception(error, this.order);
        });
    });
}


function initState(state) {
    /** @type {User} */
    let shippingAddress = container.resolve('config').shippingRequisites;
    state.shippingAddress.firstName = shippingAddress.firstName;
    state.shippingAddress.lastName = shippingAddress.lastName;
    state.shippingAddress.businessName = shippingAddress.businessName;
    state.shippingAddress.email = shippingAddress.email;
    state.shippingAddress.phone = shippingAddress.phone;

    state.shippingAddress.country = shippingAddress.address.country;
    state.shippingAddress.region = shippingAddress.address.state;
    state.shippingAddress.city = shippingAddress.address.city;
    state.shippingAddress.street = shippingAddress.address.street;
    state.shippingAddress.zip = shippingAddress.address.zipCode;

    /** @type {User} */
    let billingAddress = container.resolve('config').billingRequisites;
    state.billingAddress.firstName = billingAddress.firstName;
    state.billingAddress.lastName = billingAddress.lastName;

    state.billingAddress.country = billingAddress.address.country;
    state.billingAddress.region = billingAddress.address.state;
    state.billingAddress.city = billingAddress.address.city;
    state.billingAddress.street = billingAddress.address.street;
    state.billingAddress.zip = billingAddress.address.zipCode;

    state.hasBillingAddress = container.resolve('config').billingDifferentWithShipping;
}

function changeCreditCardField(fieldName, value) {
    switch (fieldName) {
        case "number":
            return formatCreditCardNumber(value);
        case "cv":
            return formatCVC(value);
        case "expiry":
            return formatExpirationDate(value);
        default:
            return value;
    }
}