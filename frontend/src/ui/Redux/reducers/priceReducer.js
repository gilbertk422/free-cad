/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

const initialState = {
  openPrice: false
};

export default function priceReducer(state = initialState, action) {
  // console.log(state,'priceReducer')
  switch (action.type) {
    case "OPEN_PRICE":
      gtag('event', 'Price', {
      'event_category': 'Web CAD'
      });
      return { openPrice: action.payload};
    case "CLOSE_PRICE":
      return { openPrice: action.payload};
 
    default:
      return state;
  }
}
