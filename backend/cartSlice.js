import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart/';

const calculateTotals = (items) => {
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { items, totalAmount };
};

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(API_URL + userId, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updateCartOnServer = createAsyncThunk('cart/updateCartOnServer', async (cartData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const userId = thunkAPI.getState().auth.user.id;
    await axios.post(API_URL, { userId, ...cartData }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return cartData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const clearCartItems = createAsyncThunk('cart/clearCartItems', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const userId = thunkAPI.getState().auth.user.id;
    const cart = thunkAPI.getState().cart;
    if (cart._id) { // Only delete if a cart exists on server
      await axios.delete(API_URL + cart._id, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    _id: null, // To store the cart ID from the backend
    items: [],
    totalAmount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.pizzaId === newItem.pizzaId &&
          item.size === newItem.size &&
          item.crust === newItem.crust &&
          JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings)
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      Object.assign(state, calculateTotals(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.pizzaId !== action.payload);
      Object.assign(state, calculateTotals(state.items));
    },
    updateQuantity: (state, action) => {
      const { pizzaId, quantity } = action.payload;
      const item = state.items.find((item) => item.pizzaId === pizzaId);
      if (item) {
        item.quantity = quantity;
      }
      Object.assign(state, calculateTotals(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state._id = action.payload._id;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state._id = null;
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;