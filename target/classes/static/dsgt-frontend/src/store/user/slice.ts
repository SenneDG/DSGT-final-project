import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  token: string | null;
  roles: string[];
}

const initialState: UserState = {
  user: null,
  token: null,
  roles: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: any; token: string, roles: string[] }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;