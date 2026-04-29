import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pizzas/';

// Get all pizzas
export const getPizzas = createAsyncThunk('pizzas/getPizzas', async (filters = {}, thunkAPI) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(API_URL + (params ? `?${params}` : ''));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Get single pizza
export const getPizzaById = createAsyncThunk('pizzas/getPizzaById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Add pizza (admin)
export const addPizza = createAsyncThunk('pizzas/addPizza', async (pizzaData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, pizzaData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Update pizza (admin)
export const updatePizza = createAsyncThunk('pizzas/updatePizza', async ({ id, data }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(API_URL + id, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Delete pizza (admin)
export const deletePizza = createAsyncThunk('pizzas/deletePizza', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(API_URL + id, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  pizzas: [],
  pizza: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'All',
    sort: 'popular',
    search: '',
    minPrice: '',
    maxPrice: '',
    available: false
  }
};

const pizzaSlice = createSlice({
  name: 'pizzas',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPizzas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPizzas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pizzas = action.payload;
      })
      .addCase(getPizzas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPizzaById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPizzaById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pizza = action.payload;
      })
      .addCase(getPizzaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPizza.fulfilled, (state, action) => {
        state.pizzas.push(action.payload);
      })
      .addCase(updatePizza.fulfilled, (state, action) => {
        const index = state.pizzas.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.pizzas[index] = action.payload;
        }
      })
      .addCase(deletePizza.fulfilled, (state, action) => {
        state.pizzas = state.pizzas.filter(p => p._id !== action.payload);
      });
  }
});

export const { setFilters, clearFilters } = pizzaSlice.actions;
export default pizzaSlice.reducer;