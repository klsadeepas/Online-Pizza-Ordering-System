import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

// Get cart
export const getCart = createAsyncThunk('cart/getCart', async (userId, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL + `cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Save cart
export const saveCart = createAsyncThunk('cart/saveCart', async (cartData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL + 'cart', cartData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async (cartId, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(API_URL + `cart/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  items: [],
  totalAmount: 0,
  isLoading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.pizzaId === newItem.pizzaId && 
        item.size === newItem.size && 
        item.crust === newItem.crust &&
        JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings)
      );
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const { pizzaId, size, crust, toppings } = action.payload;
      state.items = state.items.filter(
        item => !(item.pizzaId === pizzaId && 
        item.size === size && 
        item.crust === crust &&
        JSON.stringify(item.toppings) === JSON.stringify(toppings))
      );
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { pizzaId, size, crust, toppings, quantity } = action.payload;
      const item = state.items.find(
        item => item.pizzaId === pizzaId && 
        item.size === size && 
        item.crust === crust &&
        JSON.stringify(item.toppings) === JSON.stringify(toppings)
      );
      
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.pizzaId === pizzaId && 
            i.size === size && 
            i.crust === crust &&
            JSON.stringify(i.toppings) === JSON.stringify(toppings))
          );
        }
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    clearCartItems: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;