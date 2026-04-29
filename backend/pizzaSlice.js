import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pizzas/';

// Async Thunks
export const getPizzas = createAsyncThunk('pizzas/getPizzas', async (query = {}, thunkAPI) => {
  try {
    const { category, search, sort, minPrice, maxPrice, available } = query;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (available !== undefined) params.append('available', available);

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getPizzaById = createAsyncThunk('pizzas/getPizzaById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addPizza = createAsyncThunk('pizzas/addPizza', async (pizzaData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(API_URL, pizzaData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updatePizza = createAsyncThunk('pizzas/updatePizza', async ({ id, pizzaData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.put(API_URL + id, pizzaData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const deletePizza = createAsyncThunk('pizzas/deletePizza', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await axios.delete(API_URL + id, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const pizzaSlice = createSlice({
  name: 'pizzas',
  initialState: {
    pizzas: [],
    pizza: null,
    isLoading: false,
    error: null,
    filters: {
      category: 'All',
      search: '',
      sort: 'popular',
      minPrice: '',
      maxPrice: '',
      available: true
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPizzas.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getPizzas.fulfilled, (state, action) => { state.isLoading = false; state.pizzas = action.payload; })
      .addCase(getPizzas.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getPizzaById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getPizzaById.fulfilled, (state, action) => { state.isLoading = false; state.pizza = action.payload; })
      .addCase(getPizzaById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(addPizza.fulfilled, (state, action) => { state.pizzas.push(action.payload); })
      .addCase(updatePizza.fulfilled, (state, action) => {
        const index = state.pizzas.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.pizzas[index] = action.payload;
        if (state.pizza && state.pizza._id === action.payload._id) state.pizza = action.payload;
      })
      .addCase(deletePizza.fulfilled, (state, action) => {
        state.pizzas = state.pizzas.filter(p => p._id !== action.payload);
        if (state.pizza && state.pizza._id === action.payload) state.pizza = null;
      });
  },
});

export const { setFilters } = pizzaSlice.actions;
export default pizzaSlice.reducer;