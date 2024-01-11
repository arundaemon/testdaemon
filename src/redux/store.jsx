import { applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk];


export const store = configureStore(
  { reducer: rootReducer },
  composeWithDevTools(applyMiddleware(...middleware))
);




// const store = configureStore({
//     reducer: {
//         cart: cartReducer,
//         product: productReducer,
//     },
// });

// export default store;