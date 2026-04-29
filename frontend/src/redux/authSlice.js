import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Get current user
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return thunkAPI.rejectWithValue('No token found');
    
    const response = await axios.get(API_URL + 'me', {
      // No need to set user in local storage here, as it's already done on login/register
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Clear user data on logout
  return null;
});

// Update user profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5000/api/users/${userData.id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Update user in local storage
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const toggleFavorite = createAsyncThunk('auth/toggleFavorite', async (pizzaId, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:5000/api/users/favorites/${pizzaId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({ ...user, favorites: response.data }));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Load user from local storage
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { ...action.payload.user, isAdmin: action.payload.user.role === 'admin' }; // Ensure isAdmin is set
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // Set isAuthenticated to false on rejection
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { ...action.payload.user, isAdmin: action.payload.user.role === 'admin' }; // Ensure isAdmin is set
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // Set isAuthenticated to false on rejection
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { ...action.payload, isAdmin: action.payload.role === 'admin' }; // Ensure isAdmin is set
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => { // User object from backend already has isAdmin
        state.user = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) {
          state.user.favorites = action.payload;
        }
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;