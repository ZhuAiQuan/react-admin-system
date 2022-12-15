import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 0海外1国内
  type: localStorage.getItem('defaultActiveKey') ? Number(localStorage.getItem('defaultActiveKey')) : 0,
  showLocal: false
}
type InitialState = typeof initialState;
export const globaSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    changeType: (state: InitialState, actions: Store.Payload<number>) => {
      localStorage.setItem('defaultActiveKey', actions.payload+'');
      state.type = actions.payload
    },
    changeLocal: (state: InitialState, actions: Store.Payload<boolean>) => {
      state.showLocal = actions.payload
    }
  }
})

export const { changeType, changeLocal } = globaSlice.actions;

export default globaSlice.reducer