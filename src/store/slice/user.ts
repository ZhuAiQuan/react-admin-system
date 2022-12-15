import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import type { State } from '@/store';
import routes from "@/router/config";
import { encode } from "@/utils/base64";
import { checkJson } from "@/utils/tools";
import axios from "axios";
import { login, loginOut } from "api/user";
import { Router } from "@/types/router";
import { message } from "antd";
import { setToken, clearCookies, getToken } from "@/utils/cookies";

const initialState = {
  token: getToken(),
  asyncAddRoute: false,
  asyncRoutes: "",
  localRoutes: routes,
  roleRoute: (checkJson("routes") as Router.backRouter[]) || [],
  leftSideRoute: (checkJson("left-side") as Router.backRouter[]) || [],
  breadCrumb: localStorage.getItem("breadcrunb")
    ? JSON.parse(localStorage.getItem("breadcrunb") as string)
    : [],
  userInfo: (checkJson("userInfo") as Request.UserInfo) || {
    name: "",
    userName: "",
  },
};
type InitialState = {
  token: string | boolean;
  asyncAddRoute: boolean;
  asyncRoutes: string;
  localRoutes: Router.CustomRouteObj[];
  roleRoute: Router.backRouter[];
  breadCrumb: Store.BreadCrumb[];
  leftSideRoute: Router.backRouter[];
  userInfo: typeof initialState["userInfo"];
};
export const getActivityList = createAsyncThunk(
  "user/getActivityList",
  async (params: any) => {
    console.log(params, "接口需要的参数");
    const { data } = await axios.get(
      "https://test.dancebox.cn/api/v1/front/activity"
    );
    return data;
  }
);
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ username, password }: { username: string; password: string }) => {
    const {
      data: { code, data, msg },
    } = await login(username, password);
    if (!+code) {
    } else {
      message.error(msg);
    }
    return data;
  }
);
export const userLoginOut = createAsyncThunk("user/loginOut", async () => {
  const { data } = await loginOut();
  return data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addRoleRoutes: (
      state: InitialState,
      actions: Store.Payload<Router.backRouter[]>
    ) => {
      state.roleRoute = actions.payload;
    },
    getDefaultRoutes: (state: InitialState) => {
      state.roleRoute =
        (JSON.parse(
          localStorage.getItem("routes") as string
        ) as Router.backRouter[]) || [];
    },
    getBreadCrumb: (
      state: InitialState,
      actions: Store.Payload<Store.BreadCrumb[]>
    ) => {
      const { payload } = actions;
      localStorage.setItem("breadcrunb", JSON.stringify(payload));
      state.breadCrumb = payload;
      // return {
      //   ...state,
      //   breadCrumb:
      // }
    },
    getLeftSideRoutes: (
      state: InitialState,
      actions: Store.Payload<Router.backRouter[]>
    ) => {
      state.leftSideRoute = actions.payload;
    },
  },
  extraReducers: {
    [getActivityList.pending.type]: (state, action) => {
      console.log(state, action);
    },
    [getActivityList.fulfilled.type]: (state, action) => {
      console.log(state, action);
    },
    [getActivityList.rejected.type]: (state, action) => {
      console.log(state, action);
    },
    [userLogin.fulfilled.type]: (state, type) => {
      if (type.payload) {
        const { name, token, userName } = type.payload as {
          name: string;
          token: string;
          userName: string;
        };
        state.token = token;
        // 存储token
        setToken(token);
        localStorage.setItem(
          "userInfo",
          encode(JSON.stringify({ userName, name }))
        );
        state.userInfo.name = name;
        state.userInfo.userName = userName;
        state.token = token;
      }
    },
    [userLoginOut.fulfilled.type]: (state, type) => {
      state.token = "";
      // 退出登录 清除全部数据
      sessionStorage.clear();
      localStorage.clear();
      clearCookies();
    },
  },
});

export const {
  addRoleRoutes,
  getDefaultRoutes,
  getBreadCrumb,
  getLeftSideRoutes,
} = userSlice.actions;

export default userSlice.reducer;
