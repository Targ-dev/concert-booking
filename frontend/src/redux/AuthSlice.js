import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

let token = localStorage.getItem('token')
let decoded = {}

try {
  decoded = token ? jwtDecode(token) : {};
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    // Token expired
    token = null;
    localStorage.removeItem('token');
  }
} catch (e) {
  token = null;
  localStorage.removeItem('token');
}


const initialState = {
  token,
  name: decoded.name || null,
  role: decoded.role || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { token } = action.payload
            const decoded = jwtDecode(token)
            state.token = token
            state.name = decoded.name
             state.role = decoded.role
             localStorage.setItem('token', token)
        },
        logout: (state) => {
            state.token = null
            state.name = null
            state.role = null
            localStorage.removeItem('token')
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;