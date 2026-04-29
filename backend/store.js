import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pizzaReducer from './pizzaSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pizzas: pizzaReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});