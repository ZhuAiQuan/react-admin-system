import { configureStore, combineReducers } from '@reduxjs/toolkit'
import user from './slice/user';
import global from './slice/global'

const reducer = combineReducers({
  user,
  global
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // 开启dispatch会提示序列号错误之类的信息
    serializableCheck: false
  }),
});

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store;