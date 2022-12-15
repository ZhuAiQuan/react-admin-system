import { createSlice } from '@reduxjs/toolkit';
import type { MenuTheme } from 'antd'

const initialState = {
  theme: 'dark'
};
type InitialState = typeof initialState;
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state: InitialState) => {
      state.theme === 'dark' 
        ? state.theme = 'light'
        : state.theme = 'dark'
    }
  }
})
export const { setTheme } = themeSlice.actions

export default themeSlice.reducer